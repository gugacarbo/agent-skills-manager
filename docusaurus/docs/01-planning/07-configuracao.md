---
title: Configuração
sidebar_label: Configuração
---

# Configuração

## Estrutura de Configuração

```json
{
  "agent": "copilot"
}
```

| Campo   | Tipo   | Padrão    | Descrição                           |
| ------- | ------ | --------- | ----------------------------------- |
| `agent` | string | `copilot` | Agent padrão: `copilot` \| `claude` |

## Arquivos de Configuração

### Global
- **Path**: `~/.vscode/extensions/agent-skills-manager/config.json`
- **Escopo**: Todos os workspaces

### Workspace
- **Path**: `.vscode/agent-skills-manager.json`
- **Escopo**: Projeto específico
- **Prioridade**: Sobrescreve configuração global

## Exemplos

### Configuração Mínima

```json
{
  "agent": "copilot"
}
```

### Configuração com Claude

```json
{
  "agent": "claude"
}
```

## Configuração via Settings do VS Code

A extensão registra as seguintes settings:

```json
{
  "agent-skills-manager.agent": "copilot"
}
```

## Validação

A extensão valida configurações ao iniciar:

1. Verifica se JSON é válido
2. Valida valores permitidos para `agent`
3. Reporta erros no Output panel

Erros de validação são reportados no Output do VS Code.
