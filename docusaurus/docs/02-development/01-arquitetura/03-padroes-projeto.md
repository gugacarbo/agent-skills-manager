---
title: Padrões de Projeto
sidebar_label: Padrões
description: Message passing, path resolution e padrões de comunicação entre componentes
---

# Padrões de Projeto

## Message Passing

### Webview → Extension

```typescript
vscode.postMessage({
  type: 'SYNC_PATTERN',
  payload: { destination: 'workspace-1' }
})
```

### Extension → Webview

```typescript
webview.postMessage({
  type: 'SYNC_COMPLETE',
  status: 'success'
})
```

### Tipos de Mensagem por Capability

#### Core (sempre habilitado)

| Tipo            | Direção             | Descrição                           |
| --------------- | ------------------- | ----------------------------------- |
| `GET_STATUS`    | Webview → Extension | Solicita status atual               |
| `STATUS_UPDATE` | Extension → Webview | Retorna status e capacidades ativas |
| `CONFIG_UPDATE` | Bidirecional        | Atualização de configuração         |

#### Sync Capability (quando sincronização estiver habilitada)

| Tipo            | Direção             | Descrição                  |
| --------------- | ------------------- | -------------------------- |
| `SYNC_PATTERN`  | Webview → Extension | Inicia sincronização       |
| `SYNC_COMPLETE` | Extension → Webview | Sync finalizado            |
| `SYNC_ERROR`    | Extension → Webview | Erro no sync               |
| `TREE_REFRESH`  | Extension → Webview | TreeView precisa atualizar |

## Path Resolution

```typescript
const resolver = new PathResolver(workspaceRoot)
const skillsPath = resolver.resolve('skills')
```

**Responsabilidades do PathResolver**:
- Normalização de paths
- Validação de diretórios
- Resolução de caminhos relativos/absolutos

## Tipos Compartilhados

```typescript
// shared/src/types.ts
interface AppConfig {
  agent: 'copilot' | 'claude'
  syncDirection: 'push' | 'pull' | 'bidirectional'
  autoSync: boolean
}

type ExtensionMessage =
  | { type: 'GET_STATUS' }
  | { type: 'STATUS_UPDATE'; payload: { capabilities: string[] } }
  | { type: 'CONFIG_UPDATE'; payload: { config: AppConfig } }
  | { type: 'SYNC_PATTERN'; payload: { destination: string } }
  | { type: 'SYNC_COMPLETE'; payload: { status: 'success'; syncedFiles: number } }
  | { type: 'SYNC_ERROR'; payload: { error: string } }
  | { type: 'TREE_REFRESH' }
```

## Referências

- [Configuração e Validação](../implementacao/01-configuracao-validacao.md) - Schema Zod
- [Componentes](./01-componentes.md) - Visão geral dos componentes
