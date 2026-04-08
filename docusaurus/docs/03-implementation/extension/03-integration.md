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

## Próximas Integrações

Para implementar funcionalidades, a extensão precisará:
- Registrar comandos via `vscode.commands.registerCommand()`
- Adicionar disposables em `context.subscriptions`
- Utilizar APIs de workspace, window, ou language features

## Referências

- Arquivos: `extension/src/extension.ts`
- Links: [VS Code API - ExtensionContext](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext)
