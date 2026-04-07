---
title: Sync Destinations
---

## DestinationConfig

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

## Tipos de destino predefinidos

| Tipo             | Path padrão                   | Descrição                                 |
| ---------------- | ----------------------------- | ----------------------------------------- |
| `claude`         | `${workspaceFolder}/.claude/` | Claude                                    |
| `github-copilot` | `${workspaceFolder}/.github/` | GitHub Copilot                            |
| `generic`        | `${workspaceFolder}/.agents/` | Genérico (repositório local)              |
| `custom`         | definido pelo usuário         | Qualquer caminho com variáveis suportadas |

## Variáveis de path

| Variável             | Descrição         |
| -------------------- | ----------------- |
| `~`                  | Home do usuário   |
| `${workspaceFolder}` | Raiz do workspace |

## Comportamento de sync

1. Ignora destinos com `enabled: false`.
2. Resolve variáveis para caminho absoluto.
3. Escreve apenas arquivos gerenciados pela extensão.
4. Aplica política de conflito configurada.

Veja também [Configuration Reference](configuration) para o schema completo e [Skill & Rule Formats](supported-formats) para detalhes de validação.

## Exemplo

```json
{
  "id": "copilot-local",
  "type": "github-copilot",
  "path": "${workspaceFolder}/.copilot/skills/${skillName}",
  "enabled": true
}
```
