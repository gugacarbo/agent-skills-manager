---
title: Technical Glossary
---

## Skill

Arquivo `SKILL.md` com instruções reutilizáveis para um agente.

## Rule

Arquivo markdown global com `alwaysApply: true`.

## Source Path

Diretório base onde a extensão descobre skills e rules.

## Destination

Local de sincronização para onde os arquivos são materializados.

## Sync

Processo de copiar/atualizar/remover arquivos entre origem e destino.

## Managed File

Arquivo marcado como gerenciado pela extensão, permitindo overwrite seguro.

## Conflict Resolution

Estratégia para conflitos: `ask`, `overwrite` ou `skip`. Configurável via [`agentSkillsManager.conflictResolution`](api/configuration).

## Estado da Extensão (`globalState`)

Estado persistido no local storage da extensão (`ExtensionContext.globalState`) que armazena skills e rules ativos. Os dados são específicos da máquina e do workspace.
