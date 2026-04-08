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

Confirma sucesso de operação de sincronização.

```typescript
{
  type: 'SYNC_COMPLETE';
  payload: {
    status: 'success';
    syncedFiles: number; // Quantidade de arquivos sincronizados
  }
}
```

**Uso**: Após `SYNC_PATTERN` concluir com sucesso.

**UI Impact**: Mostra notificação de sucesso, atualiza contadores.

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

⚠️ **A definir em `shared/src/types.ts`**

Configuração da aplicação compartilhada entre extension e webview.

```typescript
interface AppConfig {
  // A ser definido conforme necessidades da aplicação
  skillsPath?: string;
  autoSync?: boolean;
  // ...
}
```

## Capabilities

Sistema de descoberta de funcionalidades em runtime.

### Capabilities Conhecidas

| Capability | Descrição |
|------------|-----------|
| `sync` | Sincronização de patterns |
| `tree` | Navegação em árvore de skills |
| `config` | Gerenciamento de configuração |

### Uso

Webview verifica `capabilities` no `STATUS_UPDATE` para habilitar/desabilitar features:

```typescript
const hasSync = capabilities.includes('sync');
if (hasSync) {
  // Habilita botão "Sync Pattern"
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
