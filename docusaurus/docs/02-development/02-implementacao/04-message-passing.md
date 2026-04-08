---
title: Message Passing
sidebar_label: Message Passing
description: Comunicação entre Extension e Webview via VS Code API
---

# Message Passing

## Visão Geral

Comunicação bidirecional entre a VS Code Extension (Node.js) e a Webview (React) usando `postMessage`.

## Arquitetura

```mermaid
graph LR
    A[Webview] -->|postMessage| B[Extension]
    B -->|postMessage| A
```

## Webview → Extension

```typescript
vscode.postMessage({
  type: 'SYNC_PATTERN',
  payload: { destination: 'workspace-1' }
})
```

## Extension → Webview

```typescript
webview.postMessage({
  type: 'SYNC_COMPLETE',
  status: 'success',
  data: { syncedFiles: 5 }
})
```

## Tipos de Mensagem

### Core

| Tipo            | Direção             | Payload                      | Descrição                   |
| --------------- | ------------------- | ---------------------------- | --------------------------- |
| `GET_STATUS`    | Webview → Extension | `{}`                         | Request de status           |
| `STATUS_UPDATE` | Extension → Webview | `{ capabilities: string[] }` | Status atual e capabilities |
| `CONFIG_UPDATE` | Bidirecional        | `{ config }`                 | Atualização de configuração |

### Sync Capability

| Tipo            | Direção             | Payload                   | Descrição                  |
| --------------- | ------------------- | ------------------------- | -------------------------- |
| `SYNC_PATTERN`  | Webview → Extension | `{ destination: string }` | Inicia sincronização       |
| `SYNC_COMPLETE` | Extension → Webview | `{ status, data }`        | Sync finalizado            |
| `SYNC_ERROR`    | Extension → Webview | `{ error }`               | Erro no sync               |
| `TREE_REFRESH`  | Extension → Webview | `{}`                      | TreeView precisa atualizar |

## Contrato de Tipos

**Decisão**: usar união discriminada compartilhada em `shared/src/types.ts`, consumida por extension e webview.

Benefícios:
- Evita drift entre implementações
- Garante exaustividade de `switch` por `type`
- Simplifica evolução do protocolo de mensagens
- Capabilities definidas como tipos compartilhados para descoberta em runtime

## Tratamento de Erros

```typescript
window.addEventListener('message', (event) => {
  const { type, payload } = event.data

  switch (type) {
    case 'SYNC_ERROR':
      showErrorNotification(payload.error)
      break
    default:
      console.warn('Unknown message type:', type)
  }
})
```
