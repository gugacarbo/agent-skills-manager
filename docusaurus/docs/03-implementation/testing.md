---
title: Testing Strategy
---

## Objetivo

Garantir que indexação, validação e sincronização funcionem de forma previsível.

## Estado atual

A extensão possui um scaffold de teste em `extension/src/test/extension.test.ts` usando `@vscode/test-cli` + `@vscode/test-electron`. Os testes reais ainda não foram implementados.

## Infraestrutura de testes

| Workspace   | Ferramenta                                     | Comando      |
| ----------- | ---------------------------------------------- | ------------ |
| `extension` | `@vscode/test-cli` + `@vscode/test-electron`   | `pnpm test`  |
| `shared`    | Vitest                                         | `pnpm test`  |
| `webview`   | Vitest                                         | `pnpm test`  |
| `docs`      | Build do Docusaurus valida links e frontmatter | `pnpm build` |

## Escopo de testes

- **Unitários**: parser, validadores, resolução de path, diff de sync.
- **Integração**: fluxo completo de sync com mock de filesystem.
- **Manual**: comandos VS Code e comportamento do TreeView.

## Casos críticos

- Skill sem frontmatter obrigatório.
- Nome da skill divergente da pasta.
- Destino desabilitado não deve receber arquivos.
- Conflito em arquivo existente com políticas distintas.

## Checklist de validação

1. Refresh carrega alterações do diretório fonte.
2. Validate retorna erros claros por arquivo.
3. Sync respeita destinos ativos.
4. Auto-sync não sobrescreve arquivo não gerenciado.
