---
title: Contratos de Dados
description: Protocolo de comunicação entre extension e webview
---

## Estado Atual

⚠️ **Não implementado**: Este documento descreve os contratos de dados que devem ser criados.

## Arquitetura de Comunicação

A extension VS Code e a webview comunicam-se via mensagens (postMessage API). Os contratos de dados garantem type safety nessa comunicação.

```
┌─────────────┐                    ┌──────────┐
│  Extension  │ ◄─── Messages ───► │  Webview │
│  (Node.js)  │                    │  (React) │
└─────────────┘                    └──────────┘
```

## Proposta de Implementação

### Message Base

Estrutura base para todas as mensagens:

```typescript
import { z } from 'zod';

export const baseMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number(),
});

export type BaseMessage = z.infer<typeof baseMessageSchema>;
```

### Commands (Webview → Extension)

Comandos enviados da webview para a extension:

```typescript
export const commandSchema = z.discriminatedUnion('type', [
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
]);

export type Command = z.infer<typeof commandSchema>;

export type Message = BaseMessage & Command;
```

### Responses (Extension → Webview)

Respostas da extension para a webview:

```typescript
export const responseSchema = z.discriminatedUnion('type', [
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
    }),
  }),
]);

export type Response = z.infer<typeof responseSchema>;

export type ResponseMessage = BaseMessage & Response;
```

## Tipos de Mensagens

### 1. GET_SKILLS

Solicita lista de todas as skills.

**Command:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "GET_SKILLS"
}
```

**Response:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "SKILLS_LOADED",
  payload: {
    skills: [...]
  }
}
```

### 2. REFRESH_SKILLS

Recarrega skills do disco.

**Command:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "REFRESH_SKILLS"
}
```

### 3. OPEN_SKILL

Abre arquivo de skill no editor.

**Command:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "OPEN_SKILL",
  payload: {
    skillPath: "/path/to/skill.md"
  }
}
```

### 4. TOGGLE_SKILL

Habilita/desabilita uma skill.

**Command:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "TOGGLE_SKILL",
  payload: {
    skillName: "my-skill",
    enabled: false
  }
}
```

**Response:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "SKILL_UPDATED",
  payload: {
    skill: { ... }
  }
}
```

### 5. ERROR

Resposta de erro genérica.

**Response:**
```typescript
{
  id: "uuid",
  timestamp: 1234567890,
  type: "ERROR",
  payload: {
    message: "Failed to load skill",
    details: "File not found: skill.md"
  }
}
```

## Uso

### Na Extension

```typescript
import { commandSchema, type Message } from 'shared';

webview.onDidReceiveMessage((message: unknown) => {
  const parsed = commandSchema.parse(message);
  
  switch (parsed.type) {
    case 'GET_SKILLS':
      handleGetSkills();
      break;
    // ...
  }
});
```

### Na Webview

```typescript
import type { Command, ResponseMessage } from 'shared';

function sendCommand(command: Command) {
  vscode.postMessage(command);
}

window.addEventListener('message', (event) => {
  const response = event.data as ResponseMessage;
  // Processar resposta
});
```

## Type Safety

Uso de **discriminated unions** garante:

1. Exhaustive type checking
2. Autocomplete no IDE
3. Type narrowing automático

```typescript
function handleResponse(response: Response) {
  switch (response.type) {
    case 'SKILLS_LOADED':
      // TypeScript sabe que response.payload.skills existe
      return response.payload.skills;
    
    case 'SKILL_UPDATED':
      // TypeScript sabe que response.payload.skill existe
      return response.payload.skill;
    
    case 'ERROR':
      // TypeScript sabe que response.payload.message existe
      throw new Error(response.payload.message);
  }
}
```

## Próximos Passos

1. Criar arquivo `shared/src/messages.ts`
2. Implementar schemas de mensagens
3. Adicionar helper functions (createMessage, createResponse)
4. Criar testes de serialização/deserialização
5. Integrar na extension e webview

## Referências

- [VS Code Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [Zod Discriminated Unions](https://zod.dev/?id=discriminated-unions)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions)
