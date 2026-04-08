---
title: Padrões de Código
sidebar_label: Padrões de Código
---

# Padrões de Código

## Padrões de Projeto

### Message Passing

Comunicação entre extension e webview usa message passing assíncrono:

```typescript
// Webview → Extension
vscode.postMessage({ type: 'SYNC_PATTERN', payload: {...} })

// Extension → Webview
webview.postMessage({ type: 'SYNC_COMPLETE', status: 'success' })
```

### Path Resolution

Resolução de caminhos centralizada no módulo shared:

```typescript
const resolver = new PathResolver(workspaceRoot)
const skillsPath = resolver.resolve('skills')
```

### Tipos Compartilhados

Interfaces e tipos definidos em `shared/types.ts`:

```typescript
interface AppConfig {
  agent: 'copilot' | 'claude'
}
```

## Considerações de Performance

### Lazy Loading

- Webview carregada sob demanda
- TreeView com virtualização para listas grandes
- Code splitting no build do React

### Cache

- Paths resolvidos em cache
- Estado da UI persistido entre sessões
- Git operations otimizadas

## Segurança

### Webview Security

- Content Security Policy restritiva
- Sanitização de inputs do usuário
- Validação de paths antes de operações

### Git Operations

- Validação de branches e tags
- Prevenção de overwrite acidental
- Conflict detection pré-sincronização

## Referências

- [Visão Geral da Arquitetura](./01-visao-geral) - Componentes principais
- [Decisões de Arquitetura](./05-decisoes-arquitetura) - Racional das decisões
