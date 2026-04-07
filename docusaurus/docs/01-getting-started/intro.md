---
title: Technical Overview
---

## Objetivo

O Agent Skills Manager é uma extensão VS Code para gerenciar skills e rules de agentes de IA a partir de um
repositório fonte.

## Escopo Funcional

- Descobrir skills e rules no caminho configurado.
- Sincronizar conteúdo para destinos configurados ([claude](../api/sync-destinations), [claude-rules](../api/sync-destinations), [copilot-workspace](../api/sync-destinations), [github-copilot](../api/sync-destinations), [github-workspace](../api/sync-destinations), [generic](../api/sync-destinations) ou [custom](../api/sync-destinations)).
- Ativar/desativar itens por workspace.
- Validar formato de arquivos antes de sincronizar.
- Expor comandos para refresh, sync e validação.

## Stack Técnica

| Camada            | Tecnologia                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo**      | [Turborepo](https://turbo.build) + [pnpm workspaces](https://pnpm.io/workspaces)                                                            |
| **Linter/Format** | [Biome](https://biomejs.dev) 2.x                                                                                                            |
| **Documentação**  | [Docusaurus 3.9](https://docusaurus.io) com Mermaid, MDX 3, React 18                                                                        |
| **Extensão**      | VS Code Extension API (TypeScript, esbuild, engine ≥1.84)                                                                                   |
| **Webview**       | [React 19](https://react.dev) + [Vite 8](https://vite.dev) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Shared**        | TypeScript puro (ES2022, módulos Node16)                                                                                                    |

## Estado atual do projeto

O projeto está em fase **inicial de implementação**. A infraestrutura do monorepo e os 4 workspaces estão configurados e funcionais:

- **docs**: Site de documentação completo com Docusaurus (build funcional).
- **extension**: Scaffold VS Code com entry point e esbuild (hello world command).
- **webview**: App React 19 com Vite, Tailwind 4 e shadcn/ui (componente `button` instalado).
- **shared**: Types compartilhados (placeholder, pronto para expansão).

Veja [Development Roadmap](../implementation/development-phases) para o plano de implementação.

## Fluxo de alto nível

O fluxo detalhado está documentado em [System Architecture](../architecture/architecture).

## Páginas recomendadas

- [Development Setup](development-setup): preparar ambiente e executar docs.
- [Project Structure](../architecture/project-structure): layout do monorepo e workspaces.
- [Architecture](../architecture/architecture): componentes e fluxo interno.
- [Configuration Reference](../api/configuration): schema das configurações VS Code.
- [Skill & Rule Formats](../api/supported-formats): validação e estrutura de arquivos.
- [Sync Destinations](../api/sync-destinations): tipos de destino e comportamento de sync.
