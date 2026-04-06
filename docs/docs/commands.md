---
title: Comandos
sidebar_position: 4
slug: commands
---

# Comandos

Todos os comandos são acessíveis via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) e ficam sob o prefixo **Agent Skills Manager**.

## Comandos Principais

| Comando                       | Atalho | Descrição                                            |
| ----------------------------- | ------ | ---------------------------------------------------- |
| `Show Skills Explorer`        | —      | Foca na sidebar Agent Skills                         |
| `Create New Skill`            | —      | Abre o wizard de criação de skill                    |
| `Create New Rule`             | —      | Cria uma nova rule no source                         |
| `Refresh Skills Index`        | —      | Recarrega o índice de skills                         |
| `Sync Active Skills`          | —      | Força sincronização manual de todas as skills ativas |
| `Configure Skill Source Path` | —      | Abre file picker para configurar source path         |

## Comandos de Ativação

| Comando                 | Descrição                                         |
| ----------------------- | ------------------------------------------------- |
| `Activate Skill`        | Ativa uma skill específica (prompt de seleção)    |
| `Deactivate Skill`      | Desativa uma skill específica (prompt de seleção) |
| `Toggle Skill`          | Alterna ativação/desativação de uma skill         |
| `Activate All Skills`   | Ativa todas as skills disponíveis                 |
| `Deactivate All Skills` | Desativa todas as skills ativas                   |

## Comandos de Edição

| Comando        | Descrição                                      |
| -------------- | ---------------------------------------------- |
| `Edit Skill`   | Abre o SKILL.md da skill selecionada no editor |
| `Rename Skill` | Renomeia a skill (pasta + frontmatter name)    |
| `Delete Skill` | Remove a skill do repositório                  |

## Comandos de Informação

| Comando            | Descrição                                                   |
| ------------------ | ----------------------------------------------------------- |
| `Show Skill Info`  | Exibe detalhes da skill (nome, descrição, status, destinos) |
| `Copy Skill Path`  | Copia o caminho absoluto da skill para o clipboard          |
| `Show Sync Status` | Exibe status da última sincronização                        |

## Context Menus

### TreeView (botão direito em skill)

- Ativar Skill
- Desativar Skill
- Editar Skill
- Criar Nova Skill
- Criar Nova Rule
- Copiar Caminho
- Renomear
- Excluir
- Sincronizar

### Editor (context menu em SKILL.md)

- Validate Skill
- Sync Skill
- Show Skill Info

## Atalhos de Teclado

Os atalhos podem ser customizados nas keybindings do VS Code:

```jsonc
{
  "key": "ctrl+shift+a",
  "command": "agentSkillsManager.showSkillsExplorer"
}
```
