---
title: Extension Lifecycle
description: Funções de ciclo de vida da extensão VS Code
---

## activate()

Função invocada quando a extensão é ativada pelo VS Code.

## API / Interface

- **Assinatura**: `activate(context: vscode.ExtensionContext): void`
- **Parâmetros**:
  - `context`: Objeto ExtensionContext fornecido pelo VS Code contendo informações sobre a extensão, diretórios, subscrições e estado
- **Retorno**: `void`
- **Efeitos colaterais**: Inicializa todos os componentes da extensão

## Responsabilidades

A função `activate()` deve executar as seguintes tarefas na ordem especificada:

### 1. Inicializar Sync Engine

```typescript
const syncEngine = new SyncEngine(context);
await syncEngine.initialize();
```

### 2. Registrar Commands

```typescript
// Registrar todos os comandos da extensão
const commands = [
  vscode.commands.registerCommand('skills.sync', () => syncEngine.sync()),
  vscode.commands.registerCommand('skills.openConfig', () => openConfigPanel()),
  vscode.commands.registerCommand('skills.resolveConflicts', () => openConflictResolver()),
  vscode.commands.registerCommand('skills.gitPull', () => gitManager.manualPull()),
  vscode.commands.registerCommand('skills.clearCache', () => cacheManager.clearHashCache())
];

// Adicionar ao context.subscriptions para cleanup automático
context.subscriptions.push(...commands);
```

### 3. Criar Webview Provider

```typescript
const webviewProvider = new SkillsWebviewProvider(context.extensionUri, syncEngine);
context.subscriptions.push(
  vscode.window.registerWebviewViewProvider('skills.webview', webviewProvider)
);
```

### 4. Setup File Watcher

```typescript
const fileWatcher = vscode.workspace.createFileSystemWatcher('**/.copilot/skills/**/*.yaml');

fileWatcher.onDidChange(() => syncEngine.onFileChanged());
fileWatcher.onDidCreate(() => syncEngine.onFileCreated());
fileWatcher.onDidDelete(() => syncEngine.onFileDeleted());

context.subscriptions.push(fileWatcher);
```

## deactivate()

Função invocada quando a extensão é desativada ou descarregada pelo VS Code.

## API / Interface

- **Assinatura**: `deactivate(): void | Thenable<void>`
- **Parâmetros**: Nenhum
- **Retorno**: `void` ou `Thenable<void>` para operações assíncronas
- **Efeitos colaterais**: Cleanup de todos os recursos da extensão

## Responsabilidades

A função `deactivate()` deve executar as seguintes tarefas de cleanup:

### 1. Salvar Cache de Hashes

```typescript
async deactivate(): Promise<void> {
  // Salvar cache de hashes antes de desativar
  await cacheManager.saveHashCache();
}
```

### 2. Dispose Subscriptions

```typescript
// Dispose automático de todos os subscriptions registrados
// O VS Code automaticamente chama dispose() em todos os itens em context.subscriptions
// Não é necessário fazer manualmente se registrados corretamente
```

### 3. Stop File Watcher

```typescript
// File watcher é automaticamente disposed via context.subscriptions
// Mas pode-se fazer stop explícito se necessário:
fileWatcher?.dispose();
```

### 4. Fechar Conexão Webview

```typescript
// Webview é automaticamente disposed via context.subscriptions
// Cleanup adicional se necessário:
webviewProvider?.dispose();
```

## Estado Persistente

A extensão utiliza `context.globalState` para persistir:

- **Cache de hashes**: Para detecção de mudanças entre sessões
- **Configurações de usuário**: Preferências que não vão para settings.json
- **Timestamp da última sync**: Para tracking de sincronização

Exemplo:

```typescript
// Durante activate()
const lastSync = context.globalState.get<number>('lastSyncTimestamp', 0);

// Durante operação
await context.globalState.update('lastSyncTimestamp', Date.now());

// Durante deactivate()
await cacheManager.saveHashCache(); // Salva no globalState
```

## Referências

- Arquivos: `extension/src/extension.ts`
- Links: [VS Code Extension API - Activation Events](https://code.visualstudio.com/api/references/activation-events)
