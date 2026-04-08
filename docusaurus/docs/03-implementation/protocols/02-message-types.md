---
title: Message Types
description: Catálogo completo de tipos de mensagens e seus payloads
---

## Visão Geral

Este documento lista todos os tipos de mensagens definidos no protocolo, seus payloads e direção de comunicação.

## Status de Implementação

⚠️ **Tipos definidos em ADR-002, aguardando implementação em `shared/src/types.ts`**

## Definição de Tipos

Baseado em **ADR-002**, a união discriminada completa:

```typescript
type ExtensionMessage =
  | { type: 'GET_STATUS' }
  | { type: 'STATUS_UPDATE'; payload: { capabilities: string[] } }
  | { type: 'CONFIG_UPDATE'; payload: { config: AppConfig } }
  | { type: 'SYNC_PATTERN'; payload: { destination: string } }
  | { type: 'SYNC_COMPLETE'; payload: { status: 'success'; syncedFiles: number } }
  | { type: 'SYNC_ERROR'; payload: { error: string } }
  | { type: 'TREE_REFRESH' }
```

## Mensagens por Direção

### Webview → Extension

#### `GET_STATUS`

Solicita o status atual da extension.

```typescript
{ type: 'GET_STATUS' }
```

**Uso**: Enviada ao carregar a webview para obter estado inicial.

**Resposta esperada**: `STATUS_UPDATE`

---

#### `SYNC_PATTERN`

Solicita sincronização de um pattern para destino especificado.

```typescript
{
  type: 'SYNC_PATTERN';
  payload: {
    destination: string; // Caminho do destino
  }
}
```

**Uso**: Usuário clica em "Sync Pattern" na UI.

**Respostas possíveis**:
- `SYNC_COMPLETE` (sucesso)
- `SYNC_ERROR` (falha)

### Extension → Webview

#### `STATUS_UPDATE`

Atualiza capabilities disponíveis na extension.

```typescript
{
  type: 'STATUS_UPDATE';
  payload: {
    capabilities: string[]; // Ex: ['sync', 'tree', 'config']
  }
}
```

**Uso**: Resposta a `GET_STATUS` ou quando capabilities mudam.

**UI Impact**: Habilita/desabilita features conforme capabilities.

---

#### `CONFIG_UPDATE`

Notifica mudanças na configuração da aplicação.

```typescript
{
  type: 'CONFIG_UPDATE';
  payload: {
    config: AppConfig; // Configuração completa
  }
}
```

**Uso**: Quando settings do VS Code são alteradas.

**UI Impact**: Atualiza preferências na UI.

---

#### `SYNC_COMPLETE`

Confirma conclusão de operação de sincronização.

```typescript
{
  type: 'SYNC_COMPLETE';
  payload: {
    status: 'success' | 'partial' | 'warning';
    syncedFiles: number; // Quantidade de arquivos sincronizados
  }
}
```

**Status Values**:
- `'success'`: Todos os arquivos foram sincronizados sem problemas
- `'partial'`: Alguns arquivos foram sincronizados, mas outros falharam
- `'warning'`: Sincronização completa, mas com avisos (ex: arquivos ignorados, permissões alteradas)

**Uso**: Após `SYNC_PATTERN` concluir (com ou sem problemas).

**UI Impact**: Mostra notificação apropriada baseada no status, atualiza contadores.

---

#### `SYNC_ERROR`

Reporta erro em operação de sincronização.

```typescript
{
  type: 'SYNC_ERROR';
  payload: {
    error: string; // Mensagem de erro para usuário
  }
}
```

**Uso**: Quando `SYNC_PATTERN` falha.

**UI Impact**: Mostra mensagem de erro, mantém estado anterior.

---

#### `TREE_REFRESH`

Solicita refresh da árvore de skills na UI.

```typescript
{ type: 'TREE_REFRESH' }
```

**Uso**: Quando filesystem muda (watcher detecta mudança).

**UI Impact**: Re-renderiza árvore de skills.

## Tipos Auxiliares

### `AppConfig`

Configuração da aplicação compartilhada entre extension e webview.

```typescript
interface AppConfig {
  configVersion: string;  // Schema version for compatibility
  autoSync?: boolean;
  autoCommit?: boolean;
  autoApproveDeletes?: boolean;
  retryAttempts?: number;
  retryDelayMs?: number;
}
```

**Localização de Armazenamento**: 
- A configuração é armazenada em `.vscode/agent-skills.json` no workspace (conforme [ADR-001](../adr/ADR-001-precedencia-configuracao.md))
- Ordem de precedência: workspace file > VS Code Settings > globalState > defaults

**Nota**: Não existe mais arquivo `agents.json` - toda configuração usa `.vscode/agent-skills.json`

## Capabilities

Sistema de descoberta de funcionalidades em runtime.

### Capabilities Conhecidas

Lista estática de capabilities disponíveis:

| Capability | Descrição |
|------------|-----------|
| `sync` | Sincronização de patterns |
| `tree` | Navegação em árvore de skills |
| `config` | Gerenciamento de configuração |

### Versionamento

Capabilities suportam versionamento usando o formato `capability@version`:

```typescript
// Exemplos
capabilities: [
  'sync@2.0',
  'tree@1.0',
  'config@1.5'
]
```

### Registro

As capabilities são registradas e gerenciadas em `shared/src/capabilities.ts`. Este arquivo centraliza:
- Lista de capabilities disponíveis
- Versões de cada capability
- Validação de capabilities suportadas
- Helpers para verificação de compatibilidade

```typescript
// shared/src/capabilities.ts (exemplo planejado)
export const CAPABILITIES = {
  SYNC: 'sync',
  TREE: 'tree',
  CONFIG: 'config'
} as const;

export function parseCapability(capability: string): { name: string; version?: string } {
  const [name, version] = capability.split('@');
  return { name, version };
}
```

### Uso

Webview verifica `capabilities` no `STATUS_UPDATE` para habilitar/desabilitar features:

```typescript
const hasSync = capabilities.some(cap => cap.startsWith('sync'));
if (hasSync) {
  // Habilita botão "Sync Pattern"
}

// Com versionamento
const syncCap = capabilities.find(cap => cap.startsWith('sync@'));
const { version } = parseCapability(syncCap);
if (version && version >= '2.0') {
  // Usa features da versão 2.0+
}
```

## Evolução do Protocolo

### Adicionando Novos Tipos

1. Adicionar à união `ExtensionMessage` em `shared/src/types.ts`
2. TypeScript garantirá que todos os handlers sejam atualizados
3. Implementar handlers em extension e webview
4. Documentar neste arquivo
5. Adicionar testes de integração

### Breaking Changes

- Renomear `type`: Quebra ambos os lados
- Alterar estrutura de `payload`: Requer versionamento ou migração
- Remover tipo: TypeScript detectará usos órfãos

### Versionamento

⚠️ **Sistema de versionamento não definido ainda**

Futuras considerações:
- Campo `version` na mensagem?
- Versionamento no handshake inicial?
- Compatibilidade retroativa?

## Referências

- [ADR-002: Message Passing Protocol](../adr/ADR-002-message-passing-protocol.md)
- [Message Protocol](./01-message-protocol.md)
- [Fluxo de Comunicação](./03-communication-flow.md)
