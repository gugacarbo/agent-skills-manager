---
title: Visão Geral dos Tipos Compartilhados
description: Estrutura e organização dos tipos compartilhados entre extension e webview
---

## Objetivo

O módulo `shared/` centraliza tipos, interfaces e schemas de validação usados tanto pela extension VS Code quanto pela webview React. Isso garante consistência de tipos e contratos de dados entre os dois ambientes.

## Estrutura do Módulo

```
shared/
├── src/              # Código-fonte TypeScript
├── dist/             # Build compilado
├── package.json      # Configuração do pacote
└── tsconfig.json     # Configuração TypeScript
```

## Dependências

- **zod**: ^4.3.6 - Biblioteca de validação de schemas com inferência de tipos TypeScript
- **typescript**: ^5.9.3 - Compilador TypeScript

## Estado Atual

O módulo está configurado mas **o diretório `src/` está vazio**. Nenhum tipo compartilhado foi implementado ainda.

## Arquitetura Prevista

Quando implementado, o módulo deve conter:

### 1. **Tipos de Configuração**
Estruturas para configuração de skills:
- Metadados de skill (nome, descrição, localização)
- Configurações de projeto/usuário
- Schemas de validação

### 2. **Contratos de Dados**
Mensagens entre extension e webview:
- Request/Response patterns
- Event payloads
- State synchronization

### 3. **Schemas Zod**
Validação runtime com type safety:
- Schemas de configuração
- Validação de inputs
- Type guards automáticos

## Uso Esperado

```typescript
// Na extension
import { SkillConfig, skillConfigSchema } from 'shared';

// Na webview
import type { MessagePayload } from 'shared';
```

## Build

```bash
# Desenvolvimento com watch mode
npm run dev

# Build de produção
npm run build

# Type checking
npm run typecheck
```

## Benefícios

1. **Single Source of Truth**: Um único local para definições de tipos
2. **Type Safety**: Tipos compartilhados garantem consistência
3. **Runtime Validation**: Zod valida dados em runtime
4. **DRY**: Evita duplicação de tipos entre extension/webview
5. **Refactoring Seguro**: Mudanças de tipo propagam automaticamente

## Próximos Passos

Para implementar o módulo shared:

1. Definir interfaces de configuração de skills
2. Criar schemas Zod para validação
3. Definir contratos de mensagens extension ↔ webview
4. Exportar tipos via `src/index.ts`
5. Configurar imports nos módulos extension e webview

## Referências

- [ADR-001](../../01-architecture/adr-001-tech-stack.md) - Define Zod como ferramenta de validação
- [Documentação Zod](https://zod.dev/)
