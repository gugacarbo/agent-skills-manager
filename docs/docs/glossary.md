---
title: Glossário
sidebar_position: 1
slug: glossary
---

# Glossário

## Termos

### Skill

Arquivo `SKILL.md` contendo instruções para um agente de IA. Cada skill fica em seu próprio diretório dentro do source path. Skills são usadas por Claude Desktop e VS Code Copilot para especializar o comportamento do agente em tarefas específicas.

### Rule

Arquivo `.md` com instruções globais aplicadas pelo Claude Desktop. Rules podem ser **ativadas ou desativadas** por workspace, assim como skills. A diferença principal é que, quando presentes no destino, são sempre carregadas pelo Claude (não dependem de matching).

### Source Path

Diretório raiz do repositório git que contém todas as skills e rules. Configurado via `agentSkillsManager.skillSourcePath`. É a **fonte de verdade** para todas as skills gerenciadas pela extensão.

### Destination (Destino)

Local onde as skills ativas são copiadas. Pode ser um diretório global (ex: `~/.claude/skills/`) ou workspace-level (ex: `${workspaceFolder}/.claude/skills/`). Configurado via `agentSkillsManager.destinations`.

### Sync

Processo de copiar uma skill ativa do source path para os destinos configurados. O sync acontece automaticamente ao ativar/desativar skills, ao salvar edições, e quando mudanças externas são detectadas.

### SKILL.md

Arquivo markdown com frontmatter YAML no topo. O frontmatter contém metadados obrigatórios (`name`, `description`) e opcionais (`argument-hint`, `user-invokable`). O corpo contém as instruções para o agente.

### Frontmatter

Bloco de metadados YAML delimitado por `---` no topo de um arquivo markdown. Usado para definir propriedades da skill/rule de forma parseável.

### Workspace Config

Configuração persistida via `ExtensionContext.workspaceState` (API nativa do VS Code) que armazena quais skills estão ativas no workspace atual. Cada workspace mantém sua configuração independente, sem criar arquivos no projeto.

### Managed File

Arquivo copiado pela extensão para um destino. Identificado pelo header `<!-- Managed by Agent Skills Manager | ... -->` no topo. A extensão só modifica ou remove managed files.

### TreeView

Interface visual na sidebar do VS Code que lista todas as skills e rules disponíveis, com indicação de ativação/inativação e ações contextuais.

### Activation Event

Condição que determina quando a extensão do VS Code é carregada. Esta extensão usa `onView:skillsExplorer` (lazy activation) para minimizar impacto no startup.

### Claude Desktop

Aplicação da Anthropic que executa o Claude como assistente de IA. Suporta skills e rules em formatos específicos.

### VS Code Copilot

Extensão de IA do GitHub para VS Code. Suporta skills em formato próprio, com campos adicionais como `argument-hint` e `user-invokable`.

### IntelliSense

Recurso de autocompletion do VS Code. Esta extensão fornece IntelliSense para os campos do frontmatter YAML em arquivos SKILL.md.

### Diagnostics API

API do VS Code para reportar erros, warnings e informações que aparecem no Problems panel e como squiggly lines no editor.

### File Watcher

Mecanismo do VS Code (`FileSystemWatcher`) para monitorar mudanças em arquivos e diretórios. Usado para detectar mudanças no source path e disparar re-sync automático.
