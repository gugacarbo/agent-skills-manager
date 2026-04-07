---
title: Development Setup
---

## Requisitos

- Node.js 20+
- pnpm 10+
- VS Code 1.84+ (para desenvolver/testar a extensão)
- Git

## Instalar dependências

No diretório raiz (instala todas as workspaces de uma vez):

```bash
pnpm install
```

## Comandos do monorepo (Turborepo)

Na raiz do repositório, os seguintes comandos estão disponíveis:

```bash
# Desenvolvimento (todos os workspaces em paralelo)
pnpm dev

# Build (todos os workspaces)
pnpm build

# Verificar tipos (todos os workspaces)
pnpm typecheck

# Check completo de lint + format (Biome)
pnpm biome:check

# Limpar builds e cache
pnpm clean
```

### Filtrar por workspace com turbo

```bash
# Build apenas das docs
turbo build --filter=docs

# Dev apenas na extensão
turbo dev --filter=extension

# Build apenas do shared
turbo build --filter=shared

# Typecheck da webview
turbo typecheck --filter=webview
```

## Comandos diretos por workspace

Dentro de cada workspace, você pode rodar comandos diretamente:

### Docs (Docusaurus)

```bash
cd docs
pnpm start           # Dev server com hot reload
pnpm build           # Build de produção
pnpm typecheck       # Verificar tipos TypeScript
```

### Extension (VS Code)

```bash
cd extension
pnpm dev             # Watch mode (esbuild + tsc)
pnpm build           # Build de produção
pnpm check-types     # Verificar tipos TypeScript
pnpm lint            # Lint com Biome
pnpm test            # Executar testes (vscode-test)
pnpm clean           # Limpar dist/ e out/
```

### Webview (React + Vite)

```bash
cd webview
pnpm dev             # Vite dev server
pnpm build           # Build de produção
pnpm preview         # Preview do build
pnpm typecheck       # Verificar tipos TypeScript
pnpm lint            # Lint com Biome
pnpm clean           # Limpar dist/
```

### Shared (Types)

```bash
cd shared
pnpm build           # Compilar TypeScript
pnpm dev             # Watch mode
pnpm typecheck       # Verificar tipos
pnpm clean           # Limpar dist/
```

## Estratégia de trabalho

1. Altere páginas em `docusaurus/docs/`.
2. Rode `pnpm build` ou `turbo build --filter=docusaurus` para validar links e frontmatter.
3. Abra preview com `cd docusaurus && pnpm start` quando necessário.
4. Use `pnpm biome:check` antes de commits para manter código formatado.
5. Use `pnpm typecheck` para verificar tipos em todos os workspaces.

## Lint e formatação (Biome)

O projeto usa [Biome](https://biomejs.dev) como linter e formatter. A configuração está em `biome.json` na raiz e se aplica a todos os workspaces.

O comando `pnpm biome:check` executa lint, formatação e organização de imports com correção automática (`--write`).

## Erros comuns

- `Duplicate doc id`: duas páginas com mesmo `slug`/`id`.
- Frontmatter inválido: YAML mal formatado.
- Link quebrado: caminho relativo incorreto em markdown.
- `--workspace-root may only be used inside a workspace`: falta `pnpm-workspace.yaml` na raiz.
- Build do `shared` falha sem dependência TypeScript local — instalar com `cd shared && pnpm add -D typescript` se necessário.
