---
title: Estrutura de Diretórios
sidebar_label: Estrutura de Diretórios
description: Organização dos pacotes e diretórios do projeto
---

# Estrutura de Diretórios

## Visão Geral

```
agent-skills-manager/
├── extension/        # VS Code extension (Node.js)
├── webview/          # React UI (TypeScript + Vite)
├── shared/           # Tipos e utilitários compartilhados
└── docusaurus/       # Documentação
```

## Decisão: pnpm workspaces

**Racional**:
- Compartilhamento eficiente de dependências
- Build coordenado entre packages
- Versionamento sincronizado

## Pacotes

### Extension (`extension/`)


```plaintext
extension/
├── src/
│   └── extension.ts
├── test/
├── esbuild.js        # ✅ Configurado
├── tsconfig.json     # ✅ Configurado
└── package.json      # ✅ Configurado
```

**Stack**: Node.js, VS Code API, TypeScript

**Scripts Disponíveis**:
- `pnpm dev` - Watch mode
- `pnpm build` - Build production
- `pnpm test` - VS Code test runner

### Webview (`webview/`)

```
webview/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   └── lib/
│       └── utils.ts
├── index.html
├── vite.config.ts
├── components.json
└── package.json
```

**Stack**: React 19, TypeScript, Vite, shadcn/ui, Tailwind CSS v4

**Scripts Disponíveis**:
- `pnpm dev` - Vite dev server
- `pnpm build` - Vite build
- `pnpm lint` - Biome lint

### Shared (`shared/`)


```plaintext
shared/
├── src/
├── tsconfig.json     # ✅ Configurado
└── package.json      # ✅ Configurado
```

**Propósito**: Código compartilhado entre extension e webview

**Próximos Passos**:
- `path-resolver.ts` - Resolução de paths
- `types.ts` - Interfaces e schemas Zod
- `index.ts` - Exportação de módulos

**Dependências**:
- `zod` - Validação de schemas

## Referências

- [Componentes](./01-componentes.md) - Descrição dos módulos
- [Estado Atual](../../03-implementation/index.md) - Status de implementação
- [Padrões de Projeto](./03-padroes-projeto.md) - Arquitetura e padrões
