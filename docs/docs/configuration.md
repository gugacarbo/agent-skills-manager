---
title: Configuração
sidebar_position: 2
slug: configuration
---

# Configuração

Todas as configurações ficam nas settings do VS Code, sob o prefixo `agentSkillsManager.`.

## Propriedades

### `skillSourcePath`

- **Tipo**: `string`
- **Obrigatório**: ✅
- **Default**: `""`
- **Descrição**: Caminho absoluto para o diretório raiz do repositório de skills

```jsonc
{
  "agentSkillsManager.skillSourcePath": "/home/gustavo/agent-skills-repo"
}
```

### `autoSync`

- **Tipo**: `boolean`
- **Obrigatório**: ❌
- **Default**: `true`
- **Descrição**: Habilita sincronização automática ao ativar/desativar skills

```jsonc
{
  "agentSkillsManager.autoSync": true
}
```

### `syncOnSave`

- **Tipo**: `boolean`
- **Obrigatório**: ❌
- **Default**: `true`
- **Descrição**: Sincroniza automaticamente ao salvar uma skill no editor

```jsonc
{
  "agentSkillsManager.syncOnSave": true
}
```

### `watchSourceChanges`

- **Tipo**: `boolean`
- **Obrigatório**: ❌
- **Default**: `true`
- **Descrição**: Monitora mudanças no source path (edições externas ao VS Code)

```jsonc
{
  "agentSkillsManager.watchSourceChanges": true
}
```

### `logLevel`

- **Tipo**: `string`
- **Obrigatório**: ❌
- **Default**: `"info"`
- **Valores**: `"debug"`, `"info"`, `"warn"`, `"error"`, `"off"`
- **Descrição**: Nível de detalhamento dos logs

```jsonc
{
  "agentSkillsManager.logLevel": "info"
}
```

### `statusBarEnabled`

- **Tipo**: `boolean`
- **Obrigatório**: ❌
- **Default**: `true`
- **Descrição**: Mostra informações de status na status bar do VS Code

```jsonc
{
  "agentSkillsManager.statusBarEnabled": true
}
```

### `activationMode`

- **Tipo**: `string`
- **Obrigatório**: ❌
- **Default**: `"lazy"`
- **Valores**: `"lazy"`, `"eager"`
- **Descrição**: Define quando a extensão é ativada (`lazy` ao abrir a sidebar, `eager` na inicialização)

```jsonc
{
  "agentSkillsManager.activationMode": "lazy"
}
```

### `conflictResolution`

- **Tipo**: `string`
- **Obrigatório**: ❌
- **Default**: `"ask"`
- **Valores**: `"ask"`, `"overwrite"`, `"skip"`
- **Descrição**: Estratégia de resolução de conflitos quando o destino já tem um arquivo sem header gerenciado

```jsonc
{
  "agentSkillsManager.conflictResolution": "ask"
}
```

## Workspace Config (Storage da Extensão)

Cada workspace pode ter suas próprias skills ativas, persistidas via **`ExtensionContext.workspaceState`** (API nativa do VS Code). A configuração é salva automaticamente por workspace, sem criar arquivos no projeto e sem risco de conflito com git.

### Como Funciona

- Quando um workspace é aberto, a extensão lê o `workspaceState` para determinar quais skills estão ativas
- Se não houver dados salvos, nenhuma skill está ativa (estado inicial)
- A extensão atualiza o storage automaticamente ao ativar/desativar skills via TreeView
- A API `Memento` (`get`/`update`) fornece acesso key-value simples e transparente

### Decisão Técnica Aplicada

- O projeto usa `workspaceState` por padrão para manter estado por workspace, sem arquivos locais de configuração
- O armazenamento é key-value via API nativa `Memento`, reduzindo complexidade de parsing/serialização

### Compartilhamento com a Equipe

Como a configuração fica no storage da extensão (e não no filesystem), ela **não é versionável via git** por padrão. Cada membro da equipe ativa as skills desejadas no próprio workspace. Para padronizar, use a configuração de destinos compartilhados nas VS Code Settings (veja [Destinos de Sync](/docs/sync-destinations)).

## Configuração Completa de Exemplo

```jsonc
{
  "agentSkillsManager.skillSourcePath": "/home/gustavo/agent-skills-repo",
  "agentSkillsManager.destinations": [
    {
      "id": "claude-global",
      "type": "claude",
      "path": "~/.claude/skills",
      "enabled": true
    },
    {
      "id": "claude-rules-global",
      "type": "claude-rules",
      "path": "~/.claude/rules",
      "enabled": true
    }
  ],
  "agentSkillsManager.autoSync": true,
  "agentSkillsManager.syncOnSave": true,
  "agentSkillsManager.watchSourceChanges": true,
  "agentSkillsManager.logLevel": "info",
  "agentSkillsManager.statusBarEnabled": true,
  "agentSkillsManager.activationMode": "lazy",
  "agentSkillsManager.conflictResolution": "ask"
}
```
