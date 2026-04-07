---
title: Skill & Rule Formats
---

## Skill

### Estrutura

```text
{source-path}/skills/{skill-name}/SKILL.md
```

### Frontmatter mínimo

```yaml
---
name: my-skill
description: Quando e como a skill deve ser usada
---
```

### Campos opcionais

| Campo            | Tipo      | Padrão | Descrição                                               |
| ---------------- | --------- | ------ | ------------------------------------------------------- |
| `argument-hint`  | `string`  | —      | Dica de argumento exibida ao usuário ao invocar a skill |
| `user-invocable` | `boolean` | `true` | Se `false`, a skill não aparece na lista de invocação   |
| `version`        | `string`  | —      | Versão em semver (`x.y.z`) — opcional e pouco utilizado |

### Regras de validação

- `name` em kebab-case.
- `name` deve bater com o nome da pasta da skill.
- `description` obrigatória e não vazia.

## Rule

### Estrutura

```text
{source-path}/rules/{rule-name}.md
```

### Frontmatter mínimo

```yaml
---
alwaysApply: true
---
```

### Regras de validação

- `alwaysApply` deve ser `true`.
- Corpo do markdown não pode ser vazio.
