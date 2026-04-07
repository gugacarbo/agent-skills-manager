---
title: TreeView Implementation
---

## Objetivo

Exibir skills e rules com estado de validação e ativação no Explorer.

A implementação usa `SkillTreeDataProvider`.

## Status

**Planejado** — será implementado na Fase 3 (UI e Comandos).

## Tipos de nó

| Nó     | Descrição                       |
| ------ | ------------------------------- |
| Grupo  | Skills, Rules, Destinations     |
| Item   | Skill ou rule individual        |
| Status | Erro, warning, synced, disabled |

## Ações por item

- Ativar/desativar item.
- Validar item.
- Sincronizar item atual.
- Abrir arquivo fonte.

## Regras de atualização

- Refresh após `scan`, `validate` e `sync`.
- Atualização parcial quando apenas um item muda.
- Não bloquear render com IO pesado; usar async/thenable.
