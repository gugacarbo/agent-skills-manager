---
title: Formatos Suportados
sidebar_position: 2
slug: supported-formats
---

# Formatos Suportados

## Skills (SKILL.md)

### Estrutura de diretório

```
skills/<skill-name>/SKILL.md
```

### Formato do arquivo

```yaml
---
name: skill-name                # OBRIGATÓRIO — deve bater com nome da pasta
description: "..."              # OBRIGATÓRIO — frases-gatilho para ativação automática
argument-hint: "..."            # OPCIONAL (VS Code Copilot) — dica de argumento
user-invokable: false           # OPCIONAL (VS Code Copilot) — false = skill interno
---

# Título da Skill

## Seção

Conteúdo markdown com instruções...
```

### Campos do Frontmatter

| Campo            | Tipo    | Obrigatório | Plataformas | Descrição                                                                |
| ---------------- | ------- | ----------- | ----------- | ------------------------------------------------------------------------ |
| `name`           | string  | ✅           | Todas       | Identificador único, kebab-case. Deve bater com o nome da pasta          |
| `description`    | string  | ✅           | Todas       | Descrição com trigger keywords. Usado para matching automático do agente |
| `argument-hint`  | string  | ❌           | Copilot     | Dica para argumentos opcionais que o usuário fornece                     |
| `user-invokable` | boolean | ❌           | Copilot     | `false` = skill invocado automaticamente por outros skills               |

### Compatibilidade entre Plataformas

Na v1, o frontmatter é copiado **integralmente** para todos os destinos.
Campos não reconhecidos por uma plataforma são ignorados por ela. A
conversão/remoção de campos específicos por destino fica deferida para v2.

### Regras de Validação

- **`name`**: Regex `^[a-z0-9][a-z0-9-]*[a-z0-9]$` (kebab-case, sem espaços, sem `_`)
- **`name`**: Deve ser idêntico ao nome da pasta pai
- **`description`**: Non-empty, máximo 500 caracteres
- **Frontmatter YAML**: Delimitado por `---`, sem vírgulas desescapadas, indentação com espaços (não tabs)
- **Corpo**: Deve conter pelo menos uma seção markdown (`## `)

### Exemplos

**Claude Desktop** (`context7-mcp/SKILL.md`):

```yaml
---
name: context7-mcp
description: This skill should be used when the user asks about libraries, frameworks, API references, or needs code examples. Activates for setup questions, code generation involving libraries, or mentions of specific frameworks like React, Vue, Next.js, Prisma, Supabase, etc.
---
```

**VS Code Copilot** (`address-pr-comments/SKILL.md`):

```yaml
---
name: address-pr-comments
description: "Address review comments (including Copilot comments) on the active pull request. Use when: responding to PR feedback, fixing review comments, resolving PR threads, implementing requested changes from reviewers, addressing code review, fixing PR issues."
argument-hint: "Optionally specify a reviewer name or file to focus on"
---
```

**VS Code Copilot** (`show-github-search-result/SKILL.md`):

```yaml
---
name: show-github-search-result
description: Summarizes the results of a GitHub search query in a human friendly markdown table that is easy to read and understand. ALWAYS use this skill when displaying the results of a GitHub search query.
user-invokable: false
---
```

---

## Rules (Claude Desktop)

### Estrutura de diretório

```
rules/<rule-name>.md
```

### Formato do arquivo

```yaml
---
alwaysApply: true               # OBRIGATÓRIO — a regra é sempre aplicada
---

Conteúdo markdown com instruções globais...
```

### Campos do Frontmatter

| Campo         | Tipo    | Obrigatório | Descrição                                          |
| ------------- | ------- | ----------- | -------------------------------------------------- |
| `alwaysApply` | boolean | ✅           | Se esta regra deve ser sempre aplicada pelo Claude |

### Exemplo

```yaml
---
alwaysApply: true
---

When working with libraries, frameworks, or APIs — use Context7 MCP to fetch current documentation instead of relying on training data.
```

---

## Diferenças entre Skills e Rules

| Aspecto                     | Skills                          | Rules                          |
| --------------------------- | ------------------------------- | ------------------------------ |
| **Localização no source**   | `skills/<name>/SKILL.md`        | `rules/<name>.md`              |
| **Estrutura**               | Diretório dedicado + `SKILL.md` | Arquivo `.md` direto           |
| **Nome do arquivo**         | `SKILL.md` (maiúsculas)         | Qualquer nome descritivo `.md` |
| **Frontmatter obrigatório** | `name` + `description`          | `alwaysApply`                  |
| **Propósito**               | Workflow especializado          | Instruções globais             |
| **Ativação**                | Automática por matching         | Sempre aplicada                |

## Manifest do Repositório

`manifest.json` no source repo é **opcional** na v1. A estrutura de diretórios
(`skills/<name>/SKILL.md` e `rules/*.md`) já é suficiente para indexação.
