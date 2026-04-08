---
title: VS Code Integration
description: Integração com VS Code API e ExtensionContext
---

## ExtensionContext

Objeto fornecido pelo VS Code à função `activate()` contendo informações e APIs da extensão.

## API / Interface

- **Tipo**: `vscode.ExtensionContext`
- **Uso atual**: Recebido como parâmetro `_context` mas não utilizado
- **Recursos disponíveis**:
  - `subscriptions`: Array para registrar disposables
  - `extensionPath`: Caminho absoluto da extensão
  - `globalState`: Armazenamento persistente global
  - `workspaceState`: Armazenamento persistente do workspace
  - `secrets`: API para armazenar dados sensíveis
  - `extensionUri`: URI da extensão
  - `storageUri`: URI para armazenamento de arquivos

## Estado de Integração

A extensão importa o módulo `vscode` mas não utiliza nenhuma API no momento. O parâmetro `_context` possui prefixo `_` indicando que não é utilizado.

## Uso do ExtensionContext

### globalState

Armazenamento persistente usado para:

```typescript
// Cache de hashes para detecção de mudanças
interface HashCache {
  [filePath: string]: string; // path -> hash
}

await context.globalState.update('hashCache', hashCache);
const cache = context.globalState.get<HashCache>('hashCache', {});
```

### subscriptions

Array para registrar disposables que serão automaticamente limpos:

```typescript
// Todos os recursos que precisam de cleanup
context.subscriptions.push(
  ...commands,           // Comandos registrados
  fileWatcher,          // File system watcher
  webviewProvider,      // Webview provider
  statusBarItem         // Status bar item
);
```

### Outros Recursos Utilizados

- **extensionPath**: Caminho para assets da extensão
- **extensionUri**: URI base para webview resources
- **workspaceState**: Estado específico do workspace (não utilizado inicialmente)

## Referências

- Arquivos: `extension/src/extension.ts`
- Links: [VS Code API - ExtensionContext](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext)
