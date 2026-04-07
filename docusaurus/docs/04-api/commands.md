---
title: Command Reference
---

## Status

Os comandos abaixo são **planejados**.

## Comandos planejados

| Command ID                        | Uso                            |
| --------------------------------- | ------------------------------ |
| `agentSkillsManager.openSettings` | Abre configurações da extensão |

## Registro em package.json

Comandos devem ser declarados em `contributes.commands` e vinculados em `contributes.menus` quando houver
ação por contexto (Explorer/tree item).

## Boas práticas

- Sempre mostrar feedback de sucesso/erro no VS Code.
- Não bloquear UI para operações de IO longas.
- Reutilizar uma camada de service para evitar lógica duplicada entre comandos.
