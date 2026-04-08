---
title: ADR-002 Protocolo de Mensagens por Capability
sidebar_label: "002: Message Protocol"
description: Protocolo de comunicação Extension ↔ Webview com capabilities
---

# ADR-002: Protocolo de Mensagens por Capability

**Data**: 2026-04-08
**Status**: Aceito
**Decisores**: Equipe de desenvolvimento

## Contexto

A comunicação entre VS Code Extension (Node.js) e Webview (React) usa `postMessage`.
Precisamos de um protocolo:
- Type-safe (TypeScript)
- Extensível para novas features
- Com descoberta de capabilities em runtime
- Sem duplicação de tipos entre extension e webview

## Decisão

**Protocolo baseado em capabilities com tipos compartilhados**:

1. **Tipos compartilhados** em `shared/src/types.ts`
2. **União discriminada** por `type` field
3. **Capabilities** definidas como grupos de mensagens
4. **Descoberta via `STATUS_UPDATE`** retornando capabilities ativas

### Estrutura

```typescript
// shared/src/types.ts
export type ExtensionMessage =
  // Core (sempre disponível)
  | { type: 'GET_STATUS' }
  | { type: 'STATUS_UPDATE'; payload: { capabilities: string[] } }
  | { type: 'CONFIG_UPDATE'; payload: { config: AppConfig } }

  // Sync Capability (opcional)
  | { type: 'SYNC_PATTERN'; payload: { destination: string } }
  | { type: 'SYNC_COMPLETE'; payload: { status: 'success'; syncedFiles: number } }
  | { type: 'SYNC_ERROR'; payload: { error: string } }
  | { type: 'TREE_REFRESH' }
```

## Alternativas Consideradas

### Opção 1: Tipos duplicados em extension e webview
- **Prós**:
  - Independência entre packages
  - Menos acoplamento
- **Contras**:
  - Drift inevitável entre implementações
  - Duplicação de código
  - Refactoring mais difícil

### Opção 2: RPC-style com request/response pairing
- **Prós**:
  - Pattern request-response explícito
  - Timeouts nativos
- **Contras**:
  - Mais complexo
  - Overhead para mensagens unidirecionais
  - Biblioteca adicional necessária

### Opção Escolhida: União discriminada compartilhada
**Justificativa**:
- TypeScript garante exaustividade em `switch`
- Zero duplicação de código
- Evolução do protocolo em um único lugar
- Capabilities permitem features opcionais

## Consequências

### Positivas
- Type safety end-to-end
- Evolução controlada do protocolo
- Descoberta de features em runtime
- Refactoring seguro com TypeScript

### Negativas
- `shared` package se torna dependency crítica
- Breaking changes afetam extension e webview simultaneamente

### Neutras
- Versionamento do protocolo pode ser necessário no futuro
- Documentação de capabilities precisa estar sincronizada

## Implementação

- [x] Instalar Zod no shared package
- [ ] Criar `shared/src/types.ts` com `ExtensionMessage`
- [ ] Criar `shared/src/capabilities.ts` com enum de capabilities
- [ ] Implementar handler de mensagens na extension
- [ ] Implementar handler de mensagens no webview
- [ ] Adicionar `STATUS_UPDATE` com lista de capabilities
- [ ] Webview ajusta UI baseado em capabilities disponíveis
- [ ] Adicionar testes para cada tipo de mensagem

## Referências

- [Message Passing](../../02-development/02-implementacao/04-message-passing.md)
- [Padrões de Projeto](../../02-development/01-arquitetura/03-padroes-projeto.md)
- [Decisões Consolidadas](../../02-development/04-roadmap/00-decisoes-consolidadas.md) (Q7, Q8, Q12)
