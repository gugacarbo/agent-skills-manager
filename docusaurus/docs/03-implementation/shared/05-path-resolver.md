---
title: Path Resolver
description: Resolução e validação de paths globais e workspace
---

# Path Resolver

:::info Status
**Planejado** - Implementação definida no ADR-005 para Fase 1 como pré-requisito da Fase 2
:::

O **Path Resolver** é um módulo utilitário responsável por normalizar, resolver e validar paths entre contextos globais (`~/.agents/`) e workspaces (`.agents/`). Garante consistência na manipulação de caminhos de arquivos e diretórios em toda a aplicação.

## Localização

- **Implementação**: `shared/src/path-resolver.ts`
- **Exportação**: `shared/src/index.ts`
- **Testes**: `shared/src/path-resolver.test.ts`

## API (Planejada)

```typescript
class PathResolver {
  /**
   * Normaliza um path removendo redundâncias e resolvendo '..' e '.'
   * @param path - Path a ser normalizado
   * @returns Path normalizado
   */
  normalize(path: string): string;

  /**
   * Resolve um path relativo para absoluto
   * Usa path.resolve do Node.js internamente e adiciona validação
   * para prevenir path traversal attacks
   * 
   * @param relativePath - Path relativo ou absoluto
   * @param base - Diretório base (opcional, usa CWD se omitido)
   * @returns Path absoluto resolvido
   */
  resolve(relativePath: string, base?: string): string;

  /**
   * Valida se um path é seguro e existe
   * Combina validação de segurança com verificação de existência
   * 
   * @param path - Path a ser validado
   * @returns true se path é válido e existe
   */
  validate(path: string): boolean;

  /**
   * Transforma path entre workspaces
   * Converte paths relativos de um workspace para outro
   */
  transform(path: string, fromWorkspace: string, toWorkspace: string): string;

  /**
   * Sanitiza path removendo caracteres perigosos
   * Previne path traversal e injeção
   */
  sanitize(path: string): string;

  /**
   * Valida permissões de acesso ao path
   * @returns { valid: boolean, warnings: string[] }
   */
  validatePermissions(path: string): PathValidationResult;
}

interface PathValidationResult {
  valid: boolean;
  warnings: string[];
  sanitized: string;
}
```

### Comportamento Detalhado

#### `resolve(relativePath, base?)`

Resolve symlinks para o path real utilizando:
1. `path.resolve()` do Node.js para resolução básica
2. `fs.realpathSync()` para seguir symlinks
3. Validação adicional para prevenir path traversal

```typescript
resolve(relativePath: string, base?: string): string {
  // 1. Resolve path usando Node.js path.resolve
  const resolved = path.resolve(base || process.cwd(), relativePath);
  
  // 2. Segue symlinks para obter path real
  const realPath = fs.realpathSync(resolved);
  
  // 3. Valida que não houve traversal malicioso
  if (!this.isPathSafe(realPath, base)) {
    throw new Error('Path traversal detectado');
  }
  
  return realPath;
}
```

#### Prevenção de Path Traversal

O PathResolver implementa múltiplas camadas de proteção contra ataques de path traversal:

**1. Sanitização Básica**
- Remove componentes `..` de paths relativos
- Valida prefixo do workspace para paths resolvidos
- Rejeita paths com null bytes ou caracteres perigosos

**2. Validação de Workspace**
```typescript
private isPathSafe(resolvedPath: string, base?: string): boolean {
  const workspaceRoot = base || process.cwd();
  // Path resolvido DEVE estar dentro do workspace
  return resolvedPath.startsWith(workspaceRoot);
}
```

**3. Exemplos de Paths**

| Path de Entrada | Resultado | Razão |
|----------------|-----------|-------|
| `./skill.ts` | ✅ Válido | Path relativo seguro |
| `../../../etc/passwd` | ❌ Inválido | Path traversal detectado |
| `~/.agents/skill.ts` | ✅ Válido (com warning) | Path absoluto global permitido |
| `/tmp/\0malicious` | ❌ Inválido | Null byte detectado |
| `.agents/sub/../skill.ts` | ✅ Válido | Normalizado para `.agents/skill.ts` |

## Comportamento

### Resolução Global vs Workspace

O Path Resolver diferencia entre dois contextos:

#### Global (`~/.agents/`)
- Diretório global do usuário
- Compartilhado entre todos os workspaces
- Skills, configs e recursos globais

#### Workspace (`.agents/`)
- Relativo ao workspace atual
- Isolado por projeto
- Skills e configs específicas do projeto

### Normalização

- Remove barras duplicadas: `/path//to///file` → `/path/to/file`
- Resolve `.` e `..`: `/path/./to/../file` → `/path/file`
- Converte separadores para o padrão do OS
- Remove trailing slashes (exceto root)

### Transformação Entre Workspaces

Converte paths relativos mantendo a estrutura:

```typescript
// Exemplo
const pathResolver = new PathResolver();
const transformed = pathResolver.transform(
  '.agents/skills/custom.ts',
  '/workspace-a',
  '/workspace-b'
);
// Resultado: '/workspace-b/.agents/skills/custom.ts'
```

### Validação e Sanitização

#### Sanitização

Remove ou escapa caracteres perigosos:
- Null bytes (`\0`)
- Path traversal attempts (`../../../etc/passwd`)
- Caracteres especiais do shell

#### Validação de Permissões

Verifica:
- Path está dentro de diretórios permitidos
- Usuário tem permissões necessárias (read/write)
- Path não aponta para locais sensíveis do sistema

## Segurança

### Modelo Permissivo com Avisos

Seguindo a **Decisão de Arquitetura #2**, o Path Resolver adota um modelo **permissivo com avisos**:

#### ✅ Permite
- Paths fora do workspace com aviso
- Operações em diretórios globais
- Acesso a recursos do sistema (com validação)

#### ⚠️ Avisa
- Paths absolutos fora de `.agents/` ou `~/.agents/`
- Tentativas de path traversal
- Acesso a diretórios sensíveis do sistema
- Operações destrutivas em paths não-workspace

#### 🚫 Bloqueia
- Paths com null bytes
- Injeção de comandos via path
- Paths malformados após sanitização

### Exemplo de Uso Seguro

```typescript
const pathResolver = new PathResolver();

// Path suspeito
const userPath = '../../../etc/passwd';

// Validação
const result = pathResolver.validate(userPath);

if (!result.valid) {
  console.error('Path inválido:', result.warnings);
  throw new Error('Path rejeitado');
}

if (result.warnings.length > 0) {
  console.warn('⚠️ Avisos de segurança:', result.warnings);
  // Usuário pode prosseguir sob sua responsabilidade
}

// Usar path sanitizado
const safePath = result.sanitized;
```

## Casos de Uso

### 1. Sync Engine (Fase 2)
Normalização e resolução de paths durante sincronização entre workspaces.

### 2. Skill Loader
Resolução de paths de skills em contextos global e workspace.

### 3. Config Manager
Validação de paths em arquivos de configuração.

## Dependências

- **Node.js**: `path` module (normalização básica)
- **Node.js**: `fs` module (verificação de existência)
- Sem dependências externas

## Testes (Planejados)

Cobertura esperada:

```typescript
describe('PathResolver', () => {
  describe('normalize', () => {
    it('remove barras duplicadas');
    it('resolve . e ..');
    it('remove trailing slashes');
  });

  describe('resolve', () => {
    it('converte relativo para absoluto');
    it('usa CWD como base padrão');
  });

  describe('sanitize', () => {
    it('remove null bytes');
    it('escapa path traversal');
    it('remove caracteres especiais');
  });

  describe('validate', () => {
    it('permite paths seguros');
    it('avisa sobre paths suspeitos');
    it('bloqueia paths maliciosos');
    it('valida permissões de arquivo');
  });

  describe('transform', () => {
    it('converte entre workspaces');
    it('mantém estrutura relativa');
  });
});
```

## Referências

- **ADR-005**: [Path Resolver Timing](../adr/ADR-005-path-resolver-timing.md) - Define implementação na Fase 1
- **Decisões de Arquitetura**: [Modelo de Segurança](../../01-planning/05-decisoes-arquitetura.md#2-modelo-de-segurança) - Modelo permissivo com avisos
- **Implementação**: `shared/src/path-resolver.ts` (a implementar)

## Próximos Passos

Conforme ADR-005, implementação planejada para Fase 1:

- [ ] Criar `shared/src/path-resolver.ts`
- [ ] Implementar classe `PathResolver`
- [ ] Adicionar testes unitários
- [ ] Exportar em `shared/src/index.ts`
- [ ] Documentar API e casos de uso
