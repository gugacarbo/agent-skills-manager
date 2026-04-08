# ADR-008: Estratégia Híbrida de Hash

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Sync Engine precisa detectar mudanças em arquivos. Três estratégias possíveis:
- Timestamp: rápido mas impreciso
- Hash SHA-256: preciso mas lento
- Git diff: preciso mas mais lento ainda

## Alternativas Consideradas

### Opção 1: SHA-256 sempre (máxima precisão)
- Prós: 100% precisão, detecta qualquer mudança
- Contras: Lento para arquivos grandes, I/O intensivo

### Opção 2: Timestamp + tamanho (95% precisão)
- Prós: Muito rápido, baixo I/O
- Contras: False positives/negatives possíveis

### Opção 3: Híbrido (timestamp primeiro, SHA-256 se diferente)
- Prós: Rápido na maioria dos casos, preciso quando necessário
- Contras: Complexidade adicional

## Decisão

**Estratégia híbrida: timestamp primeiro, SHA-256 só se diferente.**

Algoritmo:
1. Comparar timestamp + tamanho
2. Se iguais → assumir sem mudança (skip)
3. Se diferentes → calcular SHA-256 para confirmar
4. Comparar hashes para decisão final

## Consequências

### Positivas
- Performance otimizada (fast path para maioria dos casos)
- Precisão garantida quando necessário
- Escalável para grandes volumes de arquivos

### Negativas
- Complexidade adicional na implementação
- Timestamp pode ser enganoso (touches sem mudança de conteúdo)
- Requer cache de hashes para máxima eficiência

## Cache Corruption Protection

Para garantir a integridade do cache de hashes, implementar proteção contra corrupção:

### Detecção de Corrupção

O cache deve incluir um checksum para validar sua integridade:

```typescript
interface CacheFile {
  version: string;
  checksum: string;  // SHA-256 do conteúdo do cache
  entries: HashCache;
}
```

### Estratégia de Recuperação

**Quando detectar corrupção**:
1. Registrar evento de corrupção no log
2. Descartar cache corrompido
3. Rebuild automático: rescan todos os arquivos
4. Reconstruir cache do zero

**Triggers de detecção**:
- Checksum inválido na leitura
- Estrutura JSON malformada
- Versão incompatível
- Campos obrigatórios ausentes

### Implementação

```typescript
async loadCache(): Promise<HashCache> {
  try {
    const data = await fs.readFile(this.cachePath, 'utf8');
    const cacheFile: CacheFile = JSON.parse(data);
    
    // Validar checksum
    const calculatedChecksum = this.calculateChecksum(cacheFile.entries);
    if (cacheFile.checksum !== calculatedChecksum) {
      logger.warn('Cache corrupted: checksum mismatch. Rebuilding...');
      return this.rebuildCache();
    }
    
    // Validar versão
    if (cacheFile.version !== CACHE_VERSION) {
      logger.info('Cache version changed. Rebuilding...');
      return this.rebuildCache();
    }
    
    return cacheFile.entries;
  } catch (error) {
    logger.warn('Failed to load cache. Rebuilding...', error);
    return this.rebuildCache();
  }
}

async rebuildCache(): Promise<HashCache> {
  logger.info('Starting cache rebuild...');
  const newCache: HashCache = {};
  const files = await this.scanAllFiles();
  
  for (const file of files) {
    const stats = await fs.stat(file);
    const hash = await this.calculateHash(file);
    newCache[file] = {
      size: stats.size,
      mtime: stats.mtimeMs,
      hash
    };
  }
  
  await this.saveCache(newCache);
  logger.info(`Cache rebuilt: ${files.length} files processed`);
  return newCache;
}
```

## Cache Encryption

Para proteção adicional contra modificação maliciosa do cache:

### Criptografia AES-256

O arquivo de cache deve ser criptografado usando AES-256-GCM:

```typescript
interface EncryptedCacheFile {
  iv: string;           // Initialization Vector (base64)
  authTag: string;      // Authentication Tag (base64)
  encrypted: string;    // Dados criptografados (base64)
}
```

### Key Derivation Strategy

A chave de criptografia é derivada de:
1. **Workspace path**: Garante que cada workspace tem sua chave
2. **Machine ID**: VSCode API fornece ID único da máquina
3. **Salt persistente**: Armazenado em local seguro

```typescript
async deriveKey(): Promise<Buffer> {
  const machineId = await vscode.env.machineId;
  const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const salt = await this.getOrCreateSalt();
  
  // PBKDF2 com 100,000 iterações
  return crypto.pbkdf2Sync(
    `${machineId}:${workspacePath}`,
    salt,
    100000,
    32,
    'sha256'
  );
}
```

### Justificativa

**Por que criptografar?**
- **Proteção contra modificação maliciosa**: Impede que atacantes manipulem hashes no cache
- **Integridade garantida**: GCM mode fornece autenticação além de criptografia
- **Defesa em profundidade**: Camada adicional de segurança mesmo em sistemas comprometidos

**Trade-offs**:
- ✅ Segurança aumentada significativamente
- ✅ Overhead mínimo (~1ms por operação)
- ⚠️ Complexidade adicional na implementação
- ⚠️ Requer gestão de chaves

### Implementação

```typescript
async saveCache(cache: HashCache): Promise<void> {
  const cacheFile: CacheFile = {
    version: CACHE_VERSION,
    checksum: this.calculateChecksum(cache),
    entries: cache
  };
  
  const plaintext = JSON.stringify(cacheFile);
  const key = await this.deriveKey();
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  
  const encryptedFile: EncryptedCacheFile = {
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64'),
    encrypted: encrypted.toString('base64')
  };
  
  await fs.writeFile(
    this.cachePath,
    JSON.stringify(encryptedFile),
    'utf8'
  );
}

async loadCache(): Promise<HashCache> {
  try {
    const data = await fs.readFile(this.cachePath, 'utf8');
    const encryptedFile: EncryptedCacheFile = JSON.parse(data);
    
    const key = await this.deriveKey();
    const iv = Buffer.from(encryptedFile.iv, 'base64');
    const authTag = Buffer.from(encryptedFile.authTag, 'base64');
    const encrypted = Buffer.from(encryptedFile.encrypted, 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    const cacheFile: CacheFile = JSON.parse(decrypted.toString('utf8'));
    
    // Validações de checksum e versão...
    return cacheFile.entries;
    
  } catch (error) {
    // Erro de decriptação ou validação = rebuild
    logger.warn('Cache decryption failed. Rebuilding...', error);
    return this.rebuildCache();
  }
}
```

## Implementação

- [ ] Implementar comparação por timestamp + size
- [ ] Implementar cálculo de SHA-256
- [ ] Implementar cache de hashes
- [ ] Implementar proteção contra corrupção (checksum)
- [ ] Implementar rebuild automático de cache
- [ ] Implementar criptografia AES-256-GCM do cache
- [ ] Implementar key derivation com PBKDF2
- [ ] Adicionar logging de eventos de corrupção/rebuild
- [ ] Adicionar métricas de performance
- [ ] Benchmark em cenários reais
- [ ] Documentar algoritmo e edge cases
