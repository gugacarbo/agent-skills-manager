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
- **Efeitos colaterais**: Atualmente nenhum. A implementação está vazia

## deactivate()

Função invocada quando a extensão é desativada ou descarregada pelo VS Code.

## API / Interface

- **Assinatura**: `deactivate(): void`
- **Parâmetros**: Nenhum
- **Retorno**: `void`
- **Efeitos colaterais**: Atualmente nenhum. A implementação está vazia

## Comportamento Atual

Ambas as funções possuem implementação vazia. O ciclo de vida está registrado mas não executa lógica de inicialização ou finalização.

## Referências

- Arquivos: `extension/src/extension.ts`
- Links: [VS Code Extension API - Activation Events](https://code.visualstudio.com/api/references/activation-events)
