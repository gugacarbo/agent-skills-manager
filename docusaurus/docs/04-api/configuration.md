---
title: Configuration Reference
---

## Status

Estas configurações são **planejadas**. A extensão ainda não implementa a leitura dessas configurações.

## Namespace

Todas as configurações usam `agentSkillsManager.*`.

## Settings

| Chave                                   | Tipo                                              | Default  | Descrição                               |
| --------------------------------------- | ------------------------------------------------- | -------- | --------------------------------------- |
| `agentSkillsManager.skillSourcePath`    | `string`                                          | `""`     | Diretório fonte das skills/rules        |
| `agentSkillsManager.autoSync`           | `boolean`                                         | `true`   | Sincroniza ao ativar/desativar extensão |
| `agentSkillsManager.syncOnSave`         | `boolean`                                         | `true`   | Sincroniza ao salvar arquivo monitorado |
| `agentSkillsManager.watchSourceChanges` | `boolean`                                         | `true`   | Observa mudanças externas na origem     |
| `agentSkillsManager.conflictResolution` | `"ask" \| "overwrite" \| "skip"`                  | `"ask"`  | Política padrão para conflitos          |
| `agentSkillsManager.logLevel`           | `"debug" \| "info" \| "warn" \| "error" \| "off"` | `"info"` | Nível de log                            |
| `agentSkillsManager.statusBarEnabled`   | `boolean`                                         | `true`   | Exibe status no rodapé                  |

Veja [Sync Destinations](sync-destinations) para os tipos de destino disponíveis e variáveis de path.

## Exemplo

```json
{
  "agentSkillsManager.skillSourcePath": "${workspaceFolder}/.agents",
  "agentSkillsManager.conflictResolution": "ask"
}
```

## Configuração atual da extensão

O `package.json` da extensão (`extension/package.json`) define a engine VS Code (`^1.84.0`) e o manifesto de comandos. As configurações em `contributes.configuration` serão adicionadas na Fase 1 (Core).
