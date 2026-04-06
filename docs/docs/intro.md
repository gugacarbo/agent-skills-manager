---
slug: intro
title: Agent Skills Manager
sidebar_position: 1
---

# 🤖 Agent Skills Manager

> Gerencie, sincronize e valide **skills** de agentes de IA a partir de um repositório git central, com adaptadores por agente.

## O Problema

Sempre que você precisa de uma skill para seu agente de IA, precisa baixá-la manualmente. As skills globais ficam em diretórios específicos da máquina (`~/.claude/skills/`, extensões do Copilot) e **não são versionadas** no repositório do projeto. Quando você clona o repo em outra máquina, as skills não estão disponíveis.

## A Solução

Uma extensão do VS Code que transforma um **repositório git** na fonte de verdade para todas as suas skills:

- 📁 **Repositório Git como fonte** — Todas as skills ficam em um repositório git. Versione, compartilhe e sincronize via git normalmente.
- 🌳 **TreeView na sidebar** — Interface visual para explorar, ativar/desativar, criar e editar skills.
- ✅ **Ativação por workspace** — Repositório global de skills, mas por workspace você escolhe quais estão ativas.
- 🔄 **Sync automático** — Quando uma skill é modificada no repositório-fonte, a extensão copia automaticamente para os diretórios dos agentes ativos.
- 🎯 **Interface genérica de agente** — Cada agente implementa a mesma interface base, o que permite suporte a Claude Desktop, VS Code Copilot e novos agentes sem mudar o núcleo da extensão.
- ✏️ **Editor com templates e validação** — Criação de skills via wizard, validação de frontmatter YAML, e IntelliSense.

## Escopo da v1

| ✅ Incluído                              | ❌ Excluído                           |
| --------------------------------------- | ------------------------------------ |
| Gerenciamento de skills e rules         | —                                    |
| TreeView com ativação/desativação       | UI de git (clone, pull, push)        |
| Editor com templates e validação        | —                                    |
| Sync automático para múltiplos destinos | Skill sharing/collaboration features |
| Publishing workflow                     | Versionamento semântico de skills    |
| Interface genérica de agente            | —                                    |
| IntelliSense para frontmatter YAML      |                                      |

## Começando

```bash
# Instalar dependências
npm install

# Compilar
npm run compile

# Empacotar extensão
npm run package
```

