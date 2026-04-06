---
title: Destinos de Sync
sidebar_position: 3
slug: sync-destinations
---

# Destinos de Sync

Os destinos de sync definem **onde** as skills ativas são copiadas. A extensão suporta tipos predefinidos e destinos customizados.

## Tipos Predefinidos

| ID do Tipo       | Label               | Caminho Resolvido             |
| ---------------- | ------------------- | ----------------------------- |
| `claude`         | Claude Desktop      | `${workspaceFolder}/.claude/` |
| `github-copilot` | GitHub Copilot      | `${workspaceFolder}/.github/` |
| `generic`        | .agents             | `${workspaceFolder}/.agents/` |
| `custom`         | Destino Customizado | `${workspaceFolder}/.custom/` |

## Variáveis Suportadas em Caminhos

| Variável             | Descrição                     | Exemplo de Resolução             |
| -------------------- | ----------------------------- | -------------------------------- |
| `~`                  | Home directory do usuário     | `/home/userName`                 |
| `${workspaceFolder}` | Pasta raiz do workspace atual | `/home/userName/projects/my-app` |
| `${skillName}`       | Nome da skill                 | `context7-mcp`                   |
| `${skillType}`       | Tipo (skill ou rule)          | `skill`                          |

## Configuração de Destinos

Os destinos são configurados via **storage da extensão** (`ExtensionContext.workspaceState`), junto com as skills ativas. A configuração é persistida automaticamente por workspace, sem poluir o filesystem do projeto.

### Estrutura de Dados (interno)

Abaixo está a representação dos dados armazenados no `workspaceState`:

```jsonc
{
  "activeSkills": ["context7-mcp", "react", "shadcn"],
  "activeRules": ["context7"],
  "destinations": [
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
    },
    {
      "id": "copilot-workspace",
      "type": "copilot-workspace",
      "path": "${workspaceFolder}/.vscode/copilot-skills",
      "enabled": true
    },
    {
      "id": "github-copilot",
      "type": "github-copilot",
      "path": "${workspaceFolder}/.github/skills",
      "enabled": true
    },
    {
      "id": "my-custom-destination",
      "type": "custom",
      "path": "${workspaceFolder}/.agents/skills",
      "enabled": true
    },
    {
      "id": "my-generic-destination",
      "type": "generic",
      "path": "/my-generic-destination/{name}/SKILL.md",
      "enabled": true
    }
  ]
}
```

### Propriedades de cada destino

| Propriedade | Tipo    | Obrigatória | Descrição                                                                                                      |
| ----------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `id`        | string  | ✅           | Identificador único do destino                                                                                 |
| `type`      | string  | ✅           | Tipo: `claude`, `claude-rules`, `copilot-workspace`, `github-copilot`, `github-workspace`, `generic`, `custom` |
| `path`      | string  | ✅           | Caminho do destino (suporta variáveis `~`, `${workspaceFolder}`)                                               |
| `enabled`   | boolean | ❌           | Se o destino está ativo (default: `true`)                                                                      |

### Vantagens deste approach

- **Por workspace** — cada projeto define seus próprios destinos automaticamente
- **Sem poluição** — nenhuma configuração no filesystem do projeto
- **Sem conflitos de git** — dados ficam no storage da extensão, não no repositório
- **API nativa** — usa `Memento` (`get`/`update`), sem parsing ou I/O manual

## Segurança de Arquivos

A extensão **nunca** sobrescreve arquivos que não contêm a marcação de arquivo gerenciado. Se um conflito for detectado (arquivo existe sem marcação), a extensão avisa e mantém o arquivo do usuário intacto.

## Estratégia de Sincronização

- **Cópia em vez de symlink**: a extensão replica os arquivos para os destinos para evitar problemas de permissão e cross-device
- **Source como fonte de verdade**: alterações feitas no destino não são propagadas de volta ao repositório de skills
- **Sem detecção de apps terceiros**: a extensão não valida se Claude Desktop ou Copilot estão instalados; ela apenas escreve no caminho configurado

## Marcação de Arquivos Gerenciados

Arquivos copiados pela extensão recebem um comentário HTML ao final do arquivo, como:

```markdown
---
name: context7-mcp
description: ...
---

<!-- Managed by Agent Skills Manager | Source: ~/agent-skills-repo/skills/context7-mcp/SKILL.md | DO NOT EDIT MANUALLY -->
```

Isso permite que a extensão:

- **Identifique** quais arquivos pode sobrescrever com segurança
- **Saiba** quais arquivos remover ao desativar uma skill
- **Não toque** em arquivos criados manualmente pelo usuário
