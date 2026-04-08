---
title: Configuração e Validação
sidebar_label: Configuração
description: Schema Zod, arquivos de configuração e fluxo de validação
---

# Configuração e Validação

## 1. Schema Zod como Fonte de Verdade

**Decisão**: Usar **Zod** para validação runtime

**Racional**:
- Type safety end-to-end com TypeScript
- Validação em runtime de arquivos carregados
- Mensagens de erro claras e úteis
- Schema como fonte de verdade única

**Implementação**:
1. ✅ `zod` instalado no shared package
2. Implementar `ConfigSchema` em `shared/src/types.ts`
3. Exportar tipos e validadores

## 2. Schema de Configuração

```typescript
import { z } from 'zod'

export const ConfigSchema = z.object({
  agent: z
    .enum(['copilot', 'claude'])
    .default('copilot')
    .describe('Agent padrão para skills'),

  syncDirection: z
    .enum(['push', 'pull', 'bidirectional'])
    .default('bidirectional')
    .describe('Direção da sincronização'),

  autoSync: z
    .boolean()
    .default(false)
    .describe('Habilita auto-sync via file watcher'),

  debounceMs: z
    .number()
    .min(0)
    .max(10000)
    .default(500)
    .describe('Debounce em ms para file watcher'),

  logLevel: z
    .enum(['error', 'warn', 'info', 'debug'])
    .default('info')
    .describe('Nível de log'),

  logToFile: z
    .boolean()
    .default(false)
    .describe('Habilita log em arquivo'),
})

export type Config = z.infer<typeof ConfigSchema>
```

## 3. Campos de Configuração

| Campo           | Tipo    | Padrão          | Descrição                                   |
| --------------- | ------- | --------------- | ------------------------------------------- |
| `agent`         | string  | `copilot`       | Agent padrão: `copilot` ou `claude`         |
| `syncDirection` | string  | `bidirectional` | Direção: `push`, `pull`, ou `bidirectional` |
| `autoSync`      | boolean | `false`         | Habilita auto-sync via file watcher         |
| `debounceMs`    | number  | `500`           | Debounce em ms para file watcher            |
| `logLevel`      | string  | `info`          | Nível de log                                |
| `logToFile`     | boolean | `false`         | Habilita log em arquivo                     |

## 4. Arquivos de Configuração

### Configuração Global

**Armazenamento**: `ExtensionContext.globalState` (VS Code API)

**Formato**: JSON serializado

**Escopo**: Todos os workspaces

**Prioridade**: Baixa (sobrescrita por workspace)

### Configuração por Workspace

**Path**: `.vscode/agent-skills-manager.json`

**Criação**: Automática mediante ação do usuário (comando ou primeira edição)

**Escopo**: Projeto específico

**Prioridade**: Alta (sobrescreve global)

### Settings do VS Code

```json
{
  "agent-skills-manager.agent": "copilot",
  "agent-skills-manager.autoSync": true
}
```

## 5. Precedência de Configuração

**Ordem de resolução (maior prioridade para menor)**:
1. `.vscode/agent-skills-manager.json` (workspace)
2. Settings do VS Code (`agent-skills-manager.*`)
3. `globalState` da extensão
4. Defaults do `ConfigSchema`

## 6. Fluxo de Validação

```mermaid
sequenceDiagram
    participant FS as FileSystem
    participant P as Parser
    participant Z as Zod
    participant L as Logger
    participant C as Config

    FS->>P: Lê arquivo JSON
    P->>Z: Parse do JSON
    alt JSON Inválido
        P->>L: Erro de parse
        L->>C: Retorna default
    else JSON Válido
        Z->>Z: Validação schema
        alt Schema Inválido
            Z->>L: Erro de validação
            L->>C: Retorna default
        else Schema Válido
            Z->>C: Config válida
        end
    end
```

**Implementação**:
```typescript
function loadConfig(filePath: string): Config {
  try {
    const rawConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const result = ConfigSchema.safeParse(rawConfig)

    if (!result.success) {
      logger.error('Config inválida', result.error)
      return getDefaultConfig()
    }

    return result.data
  } catch (error) {
    logger.error('Erro ao ler config', error)
    return getDefaultConfig()
  }
}
```
