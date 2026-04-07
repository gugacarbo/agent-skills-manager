---
title: Project Structure
---

## Monorepo com Turborepo

O projeto usa [Turborepo](https://turbo.build) para gerenciar múltiplos pacotes em um único repositório, com [pnpm workspaces](https://pnpm.io/workspaces) e [Biome](https://biomejs.dev) para lint/format.

## Estrutura atual do repositório

```text
agent-skills-manager/
|- docusaurus/                  # Workspace: documentação (Docusaurus 3.9)
|  |- docs/                    # Páginas da documentação técnica (.md)
|  |- src/                     # App Docusaurus (home, estilos, componentes)
|  |- static/                  # Assets estáticos
|  \- sidebars.ts              # Configuração da sidebar de navegação
|- extension/                  # Workspace: extensão VS Code
|  |- src/
|  |  |- extension.ts          # Entry point da extensão (esbuild bundle)
|  |  \- test/                 # Testes da extensão
|  |- esbuild.js               # Build script (esbuild → dist/extension.js)
|  \- package.json             # Manifesto VS Code + scripts
|- webview/                    # Workspace: webview da extensão (React + Vite)
|  |- src/
|  |  |- main.tsx              # Entry point React
|  |  |- App.tsx               # Componente raiz
|  |  |- components/ui/        # Componentes shadcn/ui (button, etc.)
|  |  \- lib/utils.ts          # Utilitários (cn, etc.)
|  |- components.json          # Configuração shadcn/ui (radix-nova preset)
|  |- vite.config.ts           # Vite + React + Tailwind CSS 4
|  \- index.html               # HTML shell da webview
|- shared/                     # Workspace: interfaces/types compartilhados
|  |- src/index.ts             # Tipos exportados
|  \- tsconfig.json            # Configuração TypeScript (ES2022, Node16)
|- biome.json                  # Configuração do Biome (lint + format)
|- turbo.json                  # Configuração do Turborepo (tasks)
|- pnpm-workspace.yaml         # Definição dos workspaces
|- package.json                # Raiz do monorepo
\- pnpm-lock.yaml
```

## Workspaces

| Workspace    | Pacote       | Descrição                                                        |
| ------------ | ------------ | ---------------------------------------------------------------- |
| `docusaurus` | `docusaurus` | Site de documentação (Docusaurus 3.9, React 18, Mermaid support) |
| `extension`  | `extension`  | Extensão VS Code (TypeScript, esbuild, VS Code ≥1.84)            |
| `webview`    | `webview`    | Webview da extensão (React 19, Vite 8, Tailwind 4, shadcn/ui)    |
| `shared`     | `shared`     | Tipos e interfaces compartilhados entre extension e webview      |

## Pastas importantes

- `docusaurus/docs/`: páginas da documentação técnica.
- `docusaurus/src/`: app Docusaurus (home, estilos e componentes).
- `docusaurus/sidebars.ts`: definição da navegação lateral.
- `extension/src/`: código-fonte da extensão VS Code.
- `webview/src/`: componentes React da webview (com shadcn/ui).
- `shared/`: contratos compartilhados entre extension e webview.

## Configuração de ferramentas

| Arquivo               | Propósito                                               |
| --------------------- | ------------------------------------------------------- |
| `turbo.json`          | Tasks do Turborepo (build, dev, lint, typecheck, clean) |
| `pnpm-workspace.yaml` | Define os 4 workspaces do monorepo                      |
| `biome.json`          | Linter e formatter (Biome 2.x)                          |

## Tecnologias por workspace

### docs

- [Docusaurus 3.9](https://docusaurus.io) com preset classic e Mermaid
- React 18, MDX 3, Prism para syntax highlighting
- TypeScript 6.0

### extension

- VS Code Extension API (TypeScript, `esbuild` bundler)
- `@vscode/test-cli` + `@vscode/test-electron` para testes
- VS Code engine ≥1.84

### webview

- [React 19](https://react.dev) + [Vite 8](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) com `@tailwindcss/vite`
- [shadcn/ui](https://ui.shadcn.com) (preset `radix-nova`, Radix UI + Lucide icons)
- Babel com React Compiler plugin
- TypeScript 6.0

### shared

- TypeScript puro (ES2022, módulos Node16)
- Exporta tipos e interfaces reutilizáveis


Essa estrutura separa responsabilidades e facilita testes.
