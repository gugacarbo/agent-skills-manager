---
title: Sync Strategies
description: Estratégias de sincronização e resolução de conflitos
---

# Sync Strategies

Este documento detalha as estratégias de sincronização do Sync Engine, baseadas no [ADR-003: Estratégia de Sincronização](../adr/ADR-003-sync-strategy.md).

## Status da Implementação

⚠️ **PLANEJADO** - Definido através de ADR, aguardando implementação.

## Visão Geral

O Sync Engine precisa detectar mudanças, resolver conflitos e sincronizar arquivos entre múltiplos workspaces e o repositório Git central. A estratégia escolhida é **auto-merge conservador com fallback manual**.

## Tipos de Conflito

O sistema classifica conflitos em três categorias:

### 1. `same` - Arquivos Idênticos

**Critério**: Hash SHA-256 idêntico entre origem e destino.

**Resolução**: Skip (nenhuma ação necessária).

```typescript
if (sourceHash === targetHash) {
  return ConflictType.Same;
}
```

**Exemplo**:
```
Git:       skill-a.yaml (hash: abc123)
Global:    skill-a.yaml (hash: abc123)
Ação:      Skip - arquivos já sincronizados
```

### 2. `different` - Alterações Não-Sobrepostas

**Critério**: Arquivo modificado em apenas um local, OU modificações em linhas diferentes.

**Resolução**: 
- Se modificado em apenas um workspace → cópia direta
- Se modificações em linhas diferentes → merge linha a linha automático

```typescript
if (modifiedInOneWorkspaceOnly(file)) {
  return ConflictType.Different; // Copy directly
}

if (modificationsOnDifferentLines(file)) {
  return ConflictType.Different; // Auto-merge
}
```

**Exemplo 1 - Cópia Direta**:
```
Git:       skill-a.yaml (modificado hoje)
Global:    skill-a.yaml (modificado há 3 dias)
Ação:      Copia de Git → Global
```

**Exemplo 2 - Merge Automático**:
```
Git:
  line 1: title: My Skill
  line 2: description: Old description  ← modificado no Git
  line 3: version: 1.0.0

Global:
  line 1: title: My Skill
  line 2: description: Old description
  line 3: version: 2.0.0                 ← modificado no Global

Ação: Merge automático
  line 1: title: My Skill
  line 2: description: Old description
  line 3: version: 2.0.0
```

### 3. `conflict` - Conflito Real

**Critério**: Mesma linha modificada em ambos os workspaces, ou ambiguidade na detecção.

**Resolução**: Intervenção manual obrigatória.

```typescript
if (sameLineModifiedInBoth(file)) {
  return ConflictType.Conflict; // Requires user intervention
}
```

**Exemplo**:
```
Git:
  line 2: description: New Git description  ← modificado no Git

Global:
  line 2: description: New Global description  ← modificado no Global

Ação: Prompt usuário para escolher versão ou fazer merge manual
```

## Estratégia de Merge

### Auto-Merge Conservador

A estratégia escolhida prioriza **segurança** sobre **conveniência**:

#### Princípios

1. **Auto-merge apenas quando seguro**:
   - Alterações em linhas diferentes
   - Sem sobreposição de blocos
   - Sem ambiguidade na detecção

2. **Qualquer ambiguidade → conflito manual**:
   - Mesma linha modificada
   - Blocos adjacentes modificados
   - Estrutura do arquivo alterada

3. **Rastreabilidade completa**:
   - Todas as decisões registradas em log
   - Histórico de operações mantido
   - Audit trail para troubleshooting

#### Algoritmo

```typescript
async function resolveConflict(
  source: FileContent,
  target: FileContent
): Promise<MergeResult> {
  // 1. Comparar hashes
  if (source.hash === target.hash) {
    return { type: 'same', action: 'skip' };
  }

  // 2. Verificar modificação única
  if (!target.modified && source.modified) {
    return { type: 'different', action: 'copy', from: 'source' };
  }
  
  if (!source.modified && target.modified) {
    return { type: 'different', action: 'copy', from: 'target' };
  }

  // 3. Ambos modificados - tentar merge
  const lineByLine = compareLineByLine(source.content, target.content);
  
  if (lineByLine.hasConflict) {
    return { 
      type: 'conflict', 
      action: 'manual',
      conflicts: lineByLine.conflicts 
    };
  }

  // 4. Merge automático possível
  return {
    type: 'different',
    action: 'merge',
    result: lineByLine.merged
  };
}
```

### Merge Linha a Linha

Para arquivos com modificações não-sobrepostas:

```typescript
function compareLineByLine(
  source: string[],
  target: string[]
): MergeResult {
  const result: string[] = [];
  const conflicts: Conflict[] = [];
  
  const maxLines = Math.max(source.length, target.length);
  
  for (let i = 0; i < maxLines; i++) {
    const sourceLine = source[i];
    const targetLine = target[i];
    
    if (sourceLine === targetLine) {
      // Linha idêntica - usa qualquer uma
      result.push(sourceLine);
    } else if (!sourceLine) {
      // Linha adicionada no target
      result.push(targetLine);
    } else if (!targetLine) {
      // Linha adicionada no source
      result.push(sourceLine);
    } else {
      // Conflito - ambos modificaram a mesma linha
      conflicts.push({
        line: i + 1,
        source: sourceLine,
        target: targetLine
      });
    }
  }
  
  return {
    merged: result,
    hasConflict: conflicts.length > 0,
    conflicts
  };
}
```

### Definição de "Linha" e Normalização

#### Line Endings

O merge preserva os line endings originais do arquivo:

- **Cross-platform**: Suporta tanto `\n` (Unix/macOS) quanto `\r\n` (Windows)
- **Preservação**: Mantém o line ending original do arquivo base
- **Conversão**: Não converte automaticamente entre formatos

```typescript
function detectLineEnding(content: string): '\n' | '\r\n' {
  // Detecta primeiro line ending encontrado
  if (content.includes('\r\n')) {
    return '\r\n';
  }
  return '\n';
}

function splitLines(content: string): string[] {
  // Preserva line ending original
  const lineEnding = detectLineEnding(content);
  return content.split(lineEnding);
}
```

#### Whitespace Handling

**Whitespace-only lines** são normalizadas para comparação:

- `"   "` (apenas espaços) é tratado como equivalente a `""` (linha vazia)
- Trailing whitespace é ignorado na comparação
- Leading whitespace é preservado (importante para indentação)

```typescript
function normalizeWhitespace(line: string): string {
  // Remove trailing whitespace, preserva leading
  return line.trimEnd();
}

function areLinesEquivalent(line1: string, line2: string): boolean {
  const norm1 = normalizeWhitespace(line1);
  const norm2 = normalizeWhitespace(line2);
  
  // Whitespace-only lines são tratadas como equivalentes
  if (norm1 === '' && norm2 === '') {
    return true;
  }
  
  return norm1 === norm2;
}
```

### Merge para Arquivos Estruturados (YAML/JSON)

Para arquivos estruturados como YAML e JSON, usamos **merge híbrido**:

#### Estratégia Híbrida

1. **Tentar merge estrutural** (parsing AST)
2. Se parsing falhar ou merge estrutural for ambíguo → **fallback para line-by-line**

```typescript
async function mergeStructuredFile(
  source: string,
  target: string,
  fileType: 'yaml' | 'json'
): Promise<MergeResult> {
  try {
    // 1. Tentar parsing estrutural
    const sourceObj = parseStructured(source, fileType);
    const targetObj = parseStructured(target, fileType);
    
    // 2. Merge de objetos (deep merge)
    const merged = deepMerge(sourceObj, targetObj);
    
    // 3. Verificar se há conflitos estruturais
    if (hasStructuralConflicts(sourceObj, targetObj)) {
      throw new Error('Conflito estrutural detectado');
    }
    
    // 4. Serializar resultado
    const result = serializeStructured(merged, fileType);
    
    return {
      type: 'different',
      action: 'merge-structural',
      result
    };
  } catch (error) {
    // Fallback: merge line-by-line naive
    console.warn(`Merge estrutural falhou para ${fileType}, usando line-by-line`);
    return compareLineByLine(
      source.split('\n'),
      target.split('\n')
    );
  }
}

function hasStructuralConflicts(obj1: any, obj2: any): boolean {
  // Detecta propriedades modificadas em ambos os lados com valores diferentes
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  for (const key of keys) {
    if (key in obj1 && key in obj2) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        // Mesma propriedade modificada em ambos - conflito estrutural
        return true;
      }
    }
  }
  
  return false;
}
```

### Definição de "Ambiguidade" em Auto-Merge

#### Mudanças Adjacentes vs. Overlapping

**Adjacentes** (linhas vizinhas) **NÃO são ambíguas**:
```typescript
// Git modificou linha 5, Global modificou linha 7
// Contexto de 3 linhas: linha 7 está fora do contexto de linha 5
// Resultado: Auto-merge permitido
```

**Overlapping** (dentro do contexto) **SÃO ambíguas**:
```typescript
// Git modificou linha 5, Global modificou linha 6
// Contexto de 3 linhas: linha 6 está dentro do contexto de linha 5
// Resultado: Conflito manual
```

#### Linhas de Contexto

Utilizamos **3 linhas de contexto** (padrão git diff):

```typescript
const CONTEXT_LINES = 3;

function isOverlapping(line1: number, line2: number): boolean {
  return Math.abs(line1 - line2) <= CONTEXT_LINES;
}

// Exemplo
isOverlapping(5, 7);  // false - diferença de 2, mas linha 7 está na borda
isOverlapping(5, 6);  // true - diferença de 1, dentro do contexto
isOverlapping(10, 14); // false - diferença de 4, fora do contexto
```

## Alternativas Consideradas

### ❌ Opção 1: Merge Agressivo

```typescript
// Sempre tenta fazer merge, até em casos ambíguos
strategy: 'aggressive'
```

**Prós**:
- Menos intervenção manual
- Mais conveniente para o usuário
- Workflow mais fluido

**Contras**:
- ⚠️ **Risco de perda de dados**
- Pode sobrescrever mudanças importantes
- Difícil de debugar quando dá errado

**Decisão**: ❌ Rejeitado - segurança é mais importante que conveniência.

### ✅ Opção 2: Auto-Merge Conservador (ESCOLHIDA)

```typescript
// Merge apenas quando seguro, fallback para manual
strategy: 'conservative'
```

**Prós**:
- ✅ Seguro - nunca perde dados sem aviso
- ✅ Claro - usuário sabe quando precisa intervir
- ✅ Rastreável - histórico de decisões

**Contras**:
- Pode requerer intervenção manual frequente
- Complexidade de implementação

**Decisão**: ✅ **APROVADO** - balanceamento ideal entre segurança e usabilidade.

### ❌ Opção 3: Sempre Manual

```typescript
// Sempre pergunta ao usuário, mesmo para casos simples
strategy: 'manual'
```

**Prós**:
- Máximo controle para o usuário
- Zero risco de perda de dados

**Contras**:
- ⚠️ Friction muito alto
- Usuário cansado de responder prompts
- Má experiência de usuário

**Decisão**: ❌ Rejeitado - muito invasivo.

## Fluxo de Sincronização

```mermaid
graph TD
    A[Detecta mudança] --> B{Hash idêntico?}
    B -->|Sim| C[Skip - tipo: same]
    B -->|Não| D{Modificado onde?}
    
    D -->|Apenas Source| E[Copia de Source]
    D -->|Apenas Target| F[Copia de Target]
    D -->|Ambos| G{Linhas diferentes?}
    
    G -->|Sim| H[Auto-merge linha a linha]
    G -->|Não| I[Conflito - prompt usuário]
    
    E --> J[Registra no log]
    F --> J
    H --> J
    I --> K[Usuário resolve]
    K --> J
    
    J --> L[Sync completo]
```

## Tratamento de Conflitos Manuais

Quando um conflito manual é detectado:

### 1. Notificação ao Usuário

```typescript
interface ConflictNotification {
  title: string;
  message: string;
  files: ConflictFile[];
  actions: ConflictAction[];
}

const notification: ConflictNotification = {
  title: 'Conflito de Sincronização',
  message: '2 arquivos têm conflitos que requerem sua atenção',
  files: [
    {
      path: 'skill-a.yaml',
      conflicts: 1,
      preview: '...'
    }
  ],
  actions: [
    { label: 'Resolver Agora', handler: openConflictEditor },
    { label: 'Ver Detalhes', handler: showConflictDetails },
    { label: 'Adiar', handler: snoozeConflict }
  ]
};
```

### 2. Interface de Resolução

- Diff side-by-side mostrando ambas as versões
- Opções: "Usar Source", "Usar Target", "Editar Manualmente"
- Preview do resultado antes de aplicar
- Histórico de decisões anteriores

### 3. Aplicação da Resolução

```typescript
async function applyResolution(
  file: string,
  resolution: ConflictResolution
): Promise<void> {
  // Aplica resolução escolhida
  await fs.writeFile(file, resolution.content);
  
  // Registra decisão no log
  await logOperation({
    type: 'conflict_resolution',
    file,
    resolution: resolution.type,
    timestamp: Date.now()
  });
  
  // Notifica sucesso
  showNotification('Conflito resolvido', 'success');
}
```

## Histórico de Operações

Todas as decisões de merge são registradas:

```typescript
interface SyncOperation {
  id: string;
  timestamp: Date;
  type: 'same' | 'different' | 'conflict';
  action: 'skip' | 'copy' | 'merge' | 'manual';
  files: string[];
  result: 'success' | 'failed' | 'cancelled';
  user?: string;
  details: string;
}
```

### Exemplo de Log

```json
{
  "id": "sync-001",
  "timestamp": "2026-04-08T10:30:00Z",
  "type": "different",
  "action": "merge",
  "files": ["skill-a.yaml", "skill-b.yaml"],
  "result": "success",
  "details": "Auto-merged 2 files with non-overlapping changes"
}
```

## Testes de Cenários

### Cenários de Teste Previstos

1. **Teste: Arquivos Idênticos**
   - Setup: Mesmo conteúdo em ambos workspaces
   - Esperado: Skip sync

2. **Teste: Modificação Única**
   - Setup: Arquivo modificado apenas no Git
   - Esperado: Cópia direta para Global

3. **Teste: Merge Automático**
   - Setup: Linhas diferentes modificadas
   - Esperado: Merge linha a linha bem-sucedido

4. **Teste: Conflito Real**
   - Setup: Mesma linha modificada em ambos
   - Esperado: Prompt para resolução manual

5. **Teste: Blocos Adjacentes**
   - Setup: Modificações em blocos adjacentes
   - Esperado: Conflito manual (conservador)

## Consequências da Decisão

### Positivas ✅

- **Segurança**: Nunca perde dados sem confirmação explícita
- **Clareza**: Usuário sempre sabe quando precisa intervir
- **Rastreabilidade**: Histórico completo de operações
- **Previsibilidade**: Comportamento consistente e documentado

### Negativas ⚠️

- **Intervenção Manual**: Pode requerer ação do usuário frequentemente em ambientes colaborativos
- **Complexidade**: Implementação do merge engine é mais complexa
- **Falsos Positivos**: Pode classificar alguns casos seguros como conflitos

## Referências

- [ADR-003: Estratégia de Sincronização](../adr/ADR-003-sync-strategy.md)
- [ADR-008: Estratégia Híbrida de Hash](../adr/ADR-008-hash-strategy.md)
- [Sync Engine](./04-sync-engine.md)
- [Hash Strategy](./06-hash-strategy.md)
