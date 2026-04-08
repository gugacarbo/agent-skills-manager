---
title: Tipos de Configuração
description: Estruturas de dados para configuração de skills
---

## Estado Atual

⚠️ **Não implementado**: Este documento descreve os tipos que devem ser criados no módulo `shared/`.

## Proposta de Implementação

### SkillConfig

Interface principal para configuração de uma skill:

```typescript
import { z } from 'zod';

export const skillConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  location: z.enum(['project', 'user', 'builtin']),
  path: z.string(),
  enabled: z.boolean().default(true),
  metadata: z.object({
    version: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
});

export type SkillConfig = z.infer<typeof skillConfigSchema>;
```

### Campos

- **name**: `string` - Nome único da skill (identificador)
- **description**: `string` - Descrição do propósito da skill
- **location**: `'project' | 'user' | 'builtin'` - Origem da skill
  - `project`: Definida no repositório atual
  - `user`: Configuração global do usuário
  - `builtin`: Skill nativa do sistema
- **path**: `string` - Caminho para o arquivo de definição
- **enabled**: `boolean` - Se a skill está ativa (default: true)
- **metadata**: `object?` - Informações adicionais opcionais
  - **version**: `string?` - Versão da skill
  - **author**: `string?` - Autor da skill
  - **tags**: `string[]?` - Tags para categorização

## SkillLocation

Enum para localização de skills:

```typescript
export enum SkillLocation {
  Project = 'project',
  User = 'user',
  Builtin = 'builtin'
}
```

## SkillsConfig

Configuração agregada de múltiplas skills:

```typescript
export const skillsConfigSchema = z.object({
  skills: z.array(skillConfigSchema),
  settings: z.object({
    autoRefresh: z.boolean().default(true),
    showBuiltin: z.boolean().default(true),
  }).optional(),
});

export type SkillsConfig = z.infer<typeof skillsConfigSchema>;
```

## Uso Esperado

### Na Extension

```typescript
import { skillConfigSchema, type SkillConfig } from 'shared';

function loadSkillConfig(data: unknown): SkillConfig {
  // Validação runtime com Zod
  return skillConfigSchema.parse(data);
}
```

### Na Webview

```typescript
import type { SkillConfig } from 'shared';

interface SkillCardProps {
  skill: SkillConfig;
}
```

## Validação

Benefícios do uso de Zod:

1. **Type Safety**: Tipos TypeScript inferidos automaticamente
2. **Runtime Validation**: Valida dados em runtime (ex: JSON parsing)
3. **Error Messages**: Mensagens de erro detalhadas
4. **Transformations**: Pode aplicar transformações (trim, lowercase, etc)
5. **Defaults**: Valores padrão para campos opcionais

## Exemplo de Validação

```typescript
const result = skillConfigSchema.safeParse(jsonData);

if (result.success) {
  const config: SkillConfig = result.data;
  // Usar config validado
} else {
  console.error('Invalid config:', result.error);
}
```

## Próximos Passos

1. Criar arquivo `shared/src/config.ts`
2. Implementar schemas acima
3. Adicionar testes unitários
4. Exportar via `shared/src/index.ts`
5. Integrar na extension e webview

## Referências

- [Zod Documentation](https://zod.dev/)
- [TypeScript Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
