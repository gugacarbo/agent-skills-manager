---
title: Schemas de Validação
description: Validação runtime com Zod para garantir integridade de dados
---

## Estado Atual

⚠️ **Não implementado**: Este documento descreve como os schemas Zod devem ser organizados.

## Por Que Zod?

Conforme [ADR-001](../../01-architecture/adr-001-tech-stack.md), Zod foi escolhido para validação porque:

1. **Type Safety**: Infere tipos TypeScript automaticamente
2. **Runtime Validation**: Valida dados em runtime (crucial para JSON, APIs, inputs)
3. **Composable**: Schemas podem ser compostos e reutilizados
4. **Zero Dependencies**: Biblioteca leve
5. **Error Handling**: Mensagens de erro estruturadas e úteis

## Estrutura de Schemas

### Organização

```
shared/src/
├── schemas/
│   ├── config.ts      # Schemas de configuração
│   ├── messages.ts    # Schemas de mensagens
│   ├── metadata.ts    # Schemas de metadados
│   └── index.ts       # Re-exports
└── index.ts
```

## Schemas Fundamentais

### 1. Config Schemas

Validação de arquivos de configuração:

```typescript
// shared/src/schemas/config.ts
import { z } from 'zod';

export const skillMetadataSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  created: z.string().datetime().optional(),
  updated: z.string().datetime().optional(),
});

export const skillConfigSchema = z.object({
  name: z.string()
    .min(1, 'Nome não pode ser vazio')
    .max(100, 'Nome muito longo'),
  description: z.string()
    .min(1)
    .max(500),
  location: z.enum(['project', 'user', 'builtin']),
  path: z.string().min(1),
  enabled: z.boolean().default(true),
  metadata: skillMetadataSchema.optional(),
});

// Validação de array de skills
export const skillsArraySchema = z.array(skillConfigSchema);

// Validação de configuração completa
export const skillsConfigSchema = z.object({
  skills: skillsArraySchema,
  settings: z.object({
    autoRefresh: z.boolean().default(true),
    showBuiltin: z.boolean().default(true),
    sortBy: z.enum(['name', 'location', 'date']).default('name'),
  }).optional(),
});
```

### 2. Message Schemas

Validação de comunicação extension ↔ webview:

```typescript
// shared/src/schemas/messages.ts
import { z } from 'zod';
import { skillConfigSchema } from './config';

const baseMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
});

export const commandSchema = baseMessageSchema.and(
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('GET_SKILLS'),
    }),
    z.object({
      type: z.literal('REFRESH_SKILLS'),
    }),
    z.object({
      type: z.literal('OPEN_SKILL'),
      payload: z.object({
        skillPath: z.string(),
      }),
    }),
    z.object({
      type: z.literal('TOGGLE_SKILL'),
      payload: z.object({
        skillName: z.string(),
        enabled: z.boolean(),
      }),
    }),
  ])
);

export const responseSchema = baseMessageSchema.and(
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('SKILLS_LOADED'),
      payload: z.object({
        skills: z.array(skillConfigSchema),
      }),
    }),
    z.object({
      type: z.literal('SKILL_UPDATED'),
      payload: z.object({
        skill: skillConfigSchema,
      }),
    }),
    z.object({
      type: z.literal('ERROR'),
      payload: z.object({
        message: z.string(),
        details: z.string().optional(),
        code: z.string().optional(),
      }),
    }),
  ])
);
```

### 3. Path Schemas

Validação de caminhos de arquivos:

```typescript
// shared/src/schemas/paths.ts
import { z } from 'zod';

export const filePathSchema = z.string()
  .min(1)
  .refine(
    (path) => !path.includes('..'),
    'Path traversal não permitido'
  );

export const skillPathSchema = filePathSchema
  .refine(
    (path) => path.endsWith('.md') || path.endsWith('.mdx'),
    'Skill deve ser arquivo .md ou .mdx'
  );
```

## Uso de Schemas

### Parse vs SafeParse

```typescript
// parse: Lança erro se validação falhar
try {
  const config = skillConfigSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.errors);
  }
}

// safeParse: Retorna resultado com success flag
const result = skillConfigSchema.safeParse(data);
if (result.success) {
  const config = result.data;
} else {
  console.error(result.error);
}
```

### Transformations

```typescript
const normalizedConfigSchema = skillConfigSchema.transform((data) => ({
  ...data,
  name: data.name.toLowerCase().trim(),
}));
```

### Partial e Pick

```typescript
// Todos os campos opcionais
const partialConfigSchema = skillConfigSchema.partial();

// Apenas alguns campos
const skillSummarySchema = skillConfigSchema.pick({
  name: true,
  description: true,
  location: true,
});
```

### Extend

```typescript
// Adicionar campos
const extendedConfigSchema = skillConfigSchema.extend({
  customField: z.string().optional(),
});
```

## Error Handling

### Formato de Erros

```typescript
const result = skillConfigSchema.safeParse(invalidData);

if (!result.success) {
  result.error.errors.forEach((err) => {
    console.log({
      path: err.path,      // ['name']
      message: err.message, // 'Nome não pode ser vazio'
      code: err.code,      // 'too_small'
    });
  });
}
```

### Custom Error Messages

```typescript
const schema = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório',
    invalid_type_error: 'Nome deve ser string',
  }).min(1, 'Nome não pode ser vazio'),
});
```

## Helper Functions

### Validação Genérica

```typescript
// shared/src/utils/validation.ts
import { z } from 'zod';

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}

export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  return schema.safeParse(data);
}
```

### Type Guards

```typescript
export function isSkillConfig(data: unknown): data is SkillConfig {
  return skillConfigSchema.safeParse(data).success;
}
```

## Testes

Schemas devem ter testes unitários:

```typescript
import { describe, it, expect } from 'vitest';
import { skillConfigSchema } from './config';

describe('skillConfigSchema', () => {
  it('valida configuração válida', () => {
    const valid = {
      name: 'test-skill',
      description: 'Test',
      location: 'project',
      path: '/path/to/skill.md',
      enabled: true,
    };
    
    expect(() => skillConfigSchema.parse(valid)).not.toThrow();
  });
  
  it('rejeita nome vazio', () => {
    const invalid = {
      name: '',
      description: 'Test',
      location: 'project',
      path: '/path',
      enabled: true,
    };
    
    expect(() => skillConfigSchema.parse(invalid)).toThrow();
  });
});
```

## Próximos Passos

1. Criar diretório `shared/src/schemas/`
2. Implementar schemas básicos
3. Adicionar testes unitários
4. Criar helper functions
5. Documentar schemas com JSDoc
6. Exportar via `shared/src/index.ts`

## Referências

- [Zod Documentation](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [ADR-001](../../01-architecture/adr-001-tech-stack.md) - Decisão de usar Zod
