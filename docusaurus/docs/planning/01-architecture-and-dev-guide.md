---
title: Arquitetura e Guia de Desenvolvimento
---

## Objetivo

O Agent Skills Manager é uma extensão VS Code para gerenciar skills e rules de agentes de IA a partir de um repositório fonte.

## Escopo Funcional

- Descobrir skills e rules no caminho configurado.
- Sincronizar conteúdo para destinos configurados (`claude`, `github-copilot`, `generic` ou `custom`).
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

## Estrutura do Repositório

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

## Arquitetura do Sistema

A extensão é composta por camadas de configuração, indexação, validação, sincronização e UI.

### Fluxo de execução (planejado)

1. Ativação da extensão → carga de configuração (`agentSkillsManager.*`).
2. Indexação da origem (`skills/` e `rules/`).
3. Validação do conteúdo indexado.
4. Render do TreeView e habilitação dos comandos.
5. Sync manual ou automática conforme configuração.
6. Watch de mudanças (quando `watchSourceChanges` está habilitado).
7. Persistência de estado no local storage da extensão (`globalState`).

### Decisões de projeto

- Separar registry, validação e sync evita acoplamento alto.
- Sincronização usa metadados de arquivo gerenciado para segurança.
- Destinos são extensíveis via tipo `custom` e templates de path.
- `SkillWatcher` opera de forma independente para não bloquear a thread principal.
- Webview usa React 19 + shadcn/ui para UI moderna e consistente.
- Shared workspace garante contratos tipados entre extensão e webview.

### Comunicação extensão ↔ webview

A extensão se comunica com a webview via `vscode.postMessage` / `window.addEventListener('message')`. Os tipos das mensagens devem ser definidos em `shared/src/index.ts`.

### Persistência

- **Configuração VS Code**: namespace `agentSkillsManager.*`.
- **Estado da extensão**: `globalState` (local storage do VS Code) — armazena skills e rules ativos.

---

## Guia de Desenvolvimento

### Requisitos

- Node.js 20+
- pnpm 10+
- VS Code 1.84+ (para desenvolver/testar a extensão)
- Git

### Instalar dependências

No diretório raiz (instala todas as workspaces de uma vez):

```bash
pnpm install
```

### Comandos do monorepo (Turborepo)

Na raiz do repositório:

```bash
pnpm dev           # Desenvolvimento (todos os workspaces em paralelo)
pnpm build         # Build (todos os workspaces)
pnpm typecheck     # Verificar tipos (todos os workspaces)
pnpm biome:check   # Check completo de lint + format (Biome)
pnpm clean         # Limpar builds e cache
```

### Filtrar por workspace com turbo

```bash
turbo build --filter=docs         # Build apenas das docs
turbo dev --filter=extension      # Dev apenas na extensão
turbo build --filter=shared       # Build apenas do shared
turbo typecheck --filter=webview  # Typecheck da webview
```

### Comandos diretos por workspace

#### Docs (Docusaurus)

```bash
cd docusaurus
pnpm start        # Dev server com hot reload
pnpm build        # Build de produção
pnpm typecheck    # Verificar tipos TypeScript
```

#### Extension (VS Code)

```bash
cd extension
pnpm dev          # Watch mode (esbuild + tsc)
pnpm build        # Build de produção
pnpm check-types  # Verificar tipos TypeScript
pnpm lint         # Lint com Biome
pnpm test         # Executar testes (vscode-test)
pnpm clean        # Limpar dist/ e out/
```

#### Webview (React + Vite)

```bash
cd webview
pnpm dev          # Vite dev server
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm typecheck    # Verificar tipos TypeScript
pnpm lint         # Lint com Biome
pnpm clean        # Limpar dist/
```

#### Shared (Types)

```bash
cd shared
pnpm build        # Compilar TypeScript
pnpm dev          # Watch mode
pnpm typecheck    # Verificar tipos
pnpm clean        # Limpar dist/
```

### Documentação e validação

1. Altere páginas em `docusaurus/docs/`.
2. Rode `pnpm build` ou `turbo build --filter=docusaurus` para validar links e frontmatter.
3. Abra preview com `cd docusaurus && pnpm start` quando necessário.
4. Use `pnpm biome:check` antes de commits para manter código formatado.
5. Use `pnpm typecheck` para verificar tipos em todos os workspaces.

### Lint e formatação (Biome)

O projeto usa [Biome](https://biomejs.dev) como linter e formatter. A configuração está em `biome.json` na raiz e se aplica a todos os workspaces.

O comando `pnpm biome:check` executa lint, formatação e organização de imports com correção automática (`--write`).

## Estratégia de Testes

### Infraestrutura de testes

| Workspace   | Ferramenta                                     | Comando      |
| ----------- | ---------------------------------------------- | ------------ |
| `extension` | `@vscode/test-cli` + `@vscode/test-electron`   | `pnpm test`  |
| `shared`    | Vitest                                         | `pnpm test`  |
| `webview`   | Vitest                                         | `pnpm test`  |
| `docs`      | Build do Docusaurus valida links e frontmatter | `pnpm build` |

### Escopo de testes

- **Unitários**: parser, validadores, resolução de path, diff de sync.
- **Integração**: fluxo completo de sync com mock de filesystem.
- **Manual**: comandos VS Code e comportamento do TreeView.

### Casos críticos

- Skill sem frontmatter obrigatório.
- Nome da skill divergente da pasta.
- Destino desabilitado não deve receber arquivos.
- Conflito em arquivo existente com políticas distintas.

### Checklist de validação

1. Refresh carrega alterações do diretório fonte.
2. Validate retorna erros claros por arquivo.
3. Sync respeita destinos ativos.
4. Auto-sync não sobrescreve arquivo não gerenciado.

## Erros comuns

- `Duplicate doc id`: duas páginas com mesmo `slug`/`id`.
- Frontmatter inválido: YAML mal formatado.
- Link quebrado: caminho relativo incorreto em markdown.
- `--workspace-root may only be used inside a workspace`: falta `pnpm-workspace.yaml` na raiz.
- Build do `shared` falha sem dependência TypeScript local — instalar com `cd shared && pnpm add -D typescript` se necessário.
