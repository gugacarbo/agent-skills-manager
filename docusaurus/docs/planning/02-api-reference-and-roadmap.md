---
title: Referência de API e Roadmap
---

## Configuração

### Namespace

Todas as configurações usam `agentSkillsManager.*`.

### Settings

| Chave                                   | Tipo                                              | Default  | Descrição                               |
| --------------------------------------- | ------------------------------------------------- | -------- | --------------------------------------- |
| `agentSkillsManager.skillSourcePath`    | `string`                                          | `""`     | Diretório fonte das skills/rules        |
| `agentSkillsManager.autoSync`           | `boolean`                                         | `true`   | Sincroniza ao ativar/desativar extensão |
| `agentSkillsManager.syncOnSave`         | `boolean`                                         | `true`   | Sincroniza ao salvar arquivo monitorado |
| `agentSkillsManager.watchSourceChanges` | `boolean`                                         | `true`   | Observa mudanças externas na origem     |
| `agentSkillsManager.conflictResolution` | `"ask" \| "overwrite" \| "skip"`                  | `"ask"`  | Política padrão para conflitos          |
| `agentSkillsManager.logLevel`           | `"debug" \| "info" \| "warn" \| "error" \| "off"` | `"info"` | Nível de log                            |
| `agentSkillsManager.statusBarEnabled`   | `boolean`                                         | `true`   | Exibe status no rodapé                  |

### Exemplo

```json
{
  "agentSkillsManager.skillSourcePath": "${workspaceFolder}/.agents",
  "agentSkillsManager.conflictResolution": "ask"
}
```

As configurações em `contributes.configuration` serão adicionadas na Fase 1 (Core) do roadmap.

## Comandos

### Comandos planejados

| Command ID                        | Uso                            |
| --------------------------------- | ------------------------------ |
| `agentSkillsManager.openSettings` | Abre configurações da extensão |

Comandos devem ser declarados em `contributes.commands` e vinculados em `contributes.menus` quando houver ação por contexto (Explorer/tree item).

### Boas práticas

- Sempre mostrar feedback de sucesso/erro no VS Code.
- Não bloquear UI para operações de IO longas.
- Reutilizar uma camada de service para evitar lógica duplicada entre comandos.

## Formato de Skills e Rules

### Skill

**Estrutura:**

```text
{source-path}/skills/{skill-name}/SKILL.md
```

**Frontmatter mínimo:**

```yaml
---
name: my-skill
description: Quando e como a skill deve ser usada
---
```

**Campos opcionais:**

| Campo            | Tipo      | Padrão | Descrição                                               |
| ---------------- | --------- | ------ | ------------------------------------------------------- |
| `argument-hint`  | `string`  | —      | Dica de argumento exibida ao usuário ao invocar a skill |
| `user-invocable` | `boolean` | `true` | Se `false`, a skill não aparece na lista de invocação   |
| `version`        | `string`  | —      | Versão em semver (`x.y.z`) — opcional e pouco utilizado |

**Regras de validação:**

- `name` em kebab-case.
- `name` deve bater com o nome da pasta da skill.
- `description` obrigatória e não vazia.

### Rule

**Estrutura:**

```text
{source-path}/rules/{rule-name}.md
```

**Frontmatter mínimo:**

```yaml
---
alwaysApply: true
---
```

**Regras de validação:**

- `alwaysApply` deve ser `true`.
- Corpo do markdown não pode ser vazio.

## Destinos de Sincronização

### DestinationConfig

```ts
type DestinationType =
  | "claude"
  | "github-copilot"
  | "generic"
  | "custom";

interface DestinationConfig {
  id: string;
  type: DestinationType;
  path: string;
  enabled?: boolean;
}
```

### Tipos de destino predefinidos

| Tipo             | Path padrão                   | Descrição                    |
| ---------------- | ----------------------------- | ---------------------------- |
| `claude`         | `${workspaceFolder}/.claude/` | Claude                       |
| `github-copilot` | `${workspaceFolder}/.github/` | GitHub Copilot               |
| `generic`        | `${workspaceFolder}/.agents/` | Genérico (repositório local) |
| `custom`         | definido pelo usuário         | Qualquer caminho             |

### Variáveis de path

| Variável                | Descrição                                   |
| ----------------------- | ------------------------------------------- |
| `~`                     | Home do usuário                             |
| `${workspaceFolder}`    | Raiz do workspace                           |
| `${userSettingsFolder}` | Pasta de configurações do vscode do usuário |
| `${userHome}`           | Diretório home do usuário                   |
| `${userDesktop}`        | Pasta da área de trabalho do usuário        |
| `${userDocuments}`      | Pasta de documentos do usuário              |
| `${userDownloads}`      | Pasta de downloads do usuário               |

### Comportamento de sync

1. Ignora destinos com `enabled: false`.
2. Resolve variáveis para caminho absoluto.
3. Escreve apenas arquivos gerenciados pela extensão.
4. Aplica política de conflito configurada.

### Exemplo

```json
{
  "id": "copilot-local",
  "type": "github-copilot",
  "path": "${workspaceFolder}/.copilot/skills/${skillName}",
  "enabled": true
}
```

## TreeView

### Tipos de nó

| Nó     | Descrição                       |
| ------ | ------------------------------- |
| Grupo  | Skills, Rules, Destinations     |
| Item   | Skill ou rule individual        |
| Status | Erro, warning, synced, disabled |

### Ações por item

- Ativar/desativar item.
- Validar item.
- Sincronizar item atual.
- Abrir arquivo fonte.

### Regras de atualização

- Refresh após `scan`, `validate` e `sync`.
- Atualização parcial quando apenas um item muda.
- Não bloquear render com IO pesado; usar async/thenable.

---

## Roadmap

### Estado atual

### Fase 0 — Fundação ✅

- [x] Monorepo com Turborepo + pnpm workspaces
- [x] Biome para lint/format
- [x] Site de documentação (Docusaurus 3.9)
- [x] Extension scaffold (esbuild, VS Code ≥1.84)
- [x] Webview scaffold (React 19, Vite 8, Tailwind 4, shadcn/ui)
- [x] Shared workspace para tipos compartilhados

### Fase 1 — Core

- [x] Tipos compartilhados em `shared/src/index.ts` (SkillDescriptor, RuleDescriptor, etc.) - Parcialmente implementado com `expandPathAliases`
- [x] ConfigService — leitura de `agentSkillsManager.*` - Parcialmente implementado com `expandPathAliases`
- [ ] SkillRegistry — descoberta de skills e rules
- [x] Modelos de dados básicos - Parcialmente implementado com `expandPathAliases`

### Fase 2 — Validação e Sync

- [ ] ValidationEngine — validação de frontmatter e estrutura
- [ ] DestinationManager — resolução de destinos e paths
- [ ] SyncEngine — sync manual e dry-run

### Fase 3 — UI e Comandos

- [ ] SkillTreeDataProvider — TreeView com estado de ativo/inativo
- [ ] Comandos para refresh, validate e sync
- [ ] Webview com painel de gerenciamento
- [ ] Mensagens de erro e status

### Fase 4 — Automação

- [ ] Sync on save
- [ ] SkillWatcher — watch de mudanças na origem
- [ ] Tratamento de conflito (`ask`, `overwrite`, `skip`)
- [ ] Auto-sync ao ativar/desativar

### Definição de pronto

- Build da extensão sem erros (`pnpm build`)
- Testes unitários da camada core/sync
- Testes manuais de comando e TreeView
- Documentação de configuração atualizada
- Typecheck passando em todos os workspaces (`pnpm typecheck`)

---

## Glossário

| Termo                   | Definição                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Skill**               | Arquivo `SKILL.md` com instruções reutilizáveis para um agente.                    |
| **Rule**                | Arquivo markdown global com `alwaysApply: true`.                                   |
| **Source Path**         | Diretório base onde a extensão descobre skills e rules.                            |
| **Destination**         | Local de sincronização para onde os arquivos são materializados.                   |
| **Sync**                | Processo de copiar/atualizar/remover arquivos entre origem e destino.              |
| **Managed File**        | Arquivo marcado como gerenciado pela extensão, permitindo overwrite seguro.        |
| **Conflict Resolution** | Estratégia para conflitos: `ask`, `overwrite` ou `skip`. Configurável via setting. |
| **globalState**         | Estado persistido no local storage da extensão (`ExtensionContext.globalState`).   |
