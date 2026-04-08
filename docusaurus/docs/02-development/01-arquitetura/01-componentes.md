---
title: Componentes do Sistema
sidebar_label: Componentes
description: Diagrama e descrição dos componentes principais do Agent Skills Manager
---

# Componentes do Sistema

## Visão Geral da Arquitetura

```mermaid
graph TB
    A[VS Code Extension] --> B[Webview UI]
    A --> C[Path Resolver]
    A --> D[Sync Engine]
    B --> E[TreeView]
    B --> F[Config Panel]
    C --> G[Directory Management]
    D --> H[Git Sync]
```


### 1. VS Code Extension

**Localização**: `extension/`

**Responsabilidades**:
- Ativação e lifecycle management
- Registro de comandos VS Code
- Message passing com webview
- Integração com VS Code API

**Comandos Registrados**:
- `agent-skills-manager.sync` - Sincronizar patterns
- `agent-skills-manager.config` - Abrir configuração
- `agent-skills-manager.refresh` - Atualizar tree view

**Arquivos Principais**:
- `src/extension.ts` - Ponto de entrada
- `esbuild.js` - Configuração de build com esbuild

### 2. Webview UI

**Localização**: `webview/`

**Stack Tecnológico**:
- React 19
- TypeScript
- Vite (build)
- shadcn/ui (componentes)
- Tailwind CSS v4

**Componentes**:

#### App.tsx
- Root component

#### TreeView
- Navegação hierárquica por skills e agents
- Virtualização para listas grandes

#### Config Panel
- Visualização e edição de configuração
- Integração com VS Code settings

#### Sync Panel
- Controles de sincronização
- Preview de changes

### 3. Path Resolver

**Localização**: `shared/src/`

**Responsabilidades**:
- Normalização de paths
- Validação de diretórios
- Resolução de caminhos relativos/absolutos

**API**:
```typescript
const resolver = new PathResolver(workspaceRoot)
const skillsPath = resolver.resolve('skills')
```

### 4. Sync Engine

**Localização**: `extension/src/`

**Responsabilidades**:
- Detecção de mudanças
- Comparação de hashes (SHA-256)
- Coordenação de cópia entre workspaces
- Integração com Git (simple-git)

**Fluxo**:
1. Monitora arquivos via file watcher
2. Calcula hash dos arquivos modificados
3. Compara com destino
4. Resolve conflitos (automático ou manual)
5. Executa sync e commit Git

**Dependências**:
- `simple-git` para operações Git
- `crypto` (Node.js builtin) para hashes SHA-256
