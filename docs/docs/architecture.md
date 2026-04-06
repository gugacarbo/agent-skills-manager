---
title: Arquitetura
sidebar_position: 1
slug: architecture
---
<!-- markdownlint-disable-file MD013 -->

## Arquitetura

## Diagrama de Componentes

```mermaid
flowchart LR
    subgraph Source["📁 Repositório Git"]
        S[skills/]
        R[rules/]
        M[manifest.json]
    end

    subgraph Core["⚙️ Extensão VS Code"]
        REG[SkillRegistry]
        CFG[WorkspaceConfig]
        VAL[ValidationEngine]
        SYNC[SyncEngine]
        TREE[TreeDataProvider]
    end

    subgraph Dest["🎯 Destinos"]
        C[Claude Desktop]
        V[VS Code Copilot]
        W[Workspace Skills]
    end

    S --> REG
    R --> VAL
    REG --> TREE
    REG --> SYNC
    CFG --> SYNC
    SYNC --> Dest
```

## Fluxo de Dados

```mermaid
flowchart TD
    A[⚙️ Configura source path] --> B[📋 SkillRegistry]
    B --> C[🌲 TreeView]
    C --> D[✅ Ativa/desativa skills]
    D --> E[� workspaceState]
    E --> F[🔄 SyncEngine]
    F --> G[🎯 Destinos]
    B --> H[👁️ SkillWatcher]
    H --> F
    B --> I[✔️ Validation]
    I --> J[⚠️ Diagnostics]
```

## Estratégia de Sync

- **Cópia vs Symlink**: Cópia. Mais seguro, evita problemas de permissão e
    cross-device.
- **Auto-sync**: Watch + sync-on-save. Watch para mudanças externas,
    sync-on-save para edições no editor.
- **Remoção ao desativar**: Sim, com marcação. Arquivos gerenciados têm
    header para identificação segura.
- **Conflito de arquivos**: Nunca sobrescrever não-gerenciados. Se o destino
    tem arquivo sem marcação, o arquivo é preservado.

## Ativação

A extensão usa **lazy activation** — ela é carregada apenas quando a sidebar
"Agent Skills" é aberta.
Isso acontece via `onView:skillsExplorer` como activation event e garante zero
overhead para usuários que não usam a extensão na sessão.

Para cenários avançados, a ativação pode ser configurada para modo **eager**
via `agentSkillsManager.activationMode`.
