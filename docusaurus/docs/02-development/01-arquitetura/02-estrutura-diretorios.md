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
│   └── extension.ts   # Ponto de entrada, ativação
├── esbuild.js        # Build configuration
└── package.json
```

**Stack**: Node.js, VS Code API, TypeScript

### Webview (`webview/`)

```plaintext
webview/
├── src/
│   ├── App.tsx       # Root component
│   ├── components/   # Componentes React
│   └── lib/          # Utilitários
├── index.html
├── vite.config.ts
└── package.json
```

**Stack**: React 19, TypeScript, Vite

### Shared (`shared/`)

```plaintext
shared/
├── src/
│   ├── path-resolver.ts  # Resolução de paths
│   ├── types.ts          # Interfaces compartilhadas
│   └── index.ts          # Exportação
└── package.json
```

**Propósito**: Código compartilhado entre extension e webview

## Referências

- [Componentes](./01-componentes.md) - Descrição dos módulos
- [Padrões de Projeto](./03-padroes-projeto.md) - Arquitetura e padrões
