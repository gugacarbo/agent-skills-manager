---
title: Visão Geral dos Componentes
description: Estrutura e arquitetura dos componentes React da webview
---

## Estado Atual da Implementação

A webview está em **fase inicial de desenvolvimento**. A infraestrutura básica está configurada, mas os componentes principais ainda não foram implementados.

### Estrutura Atual

```
webview/src/
├── App.tsx              # Componente raiz (placeholder)
├── main.tsx             # Entry point com React 19
├── index.css            # Estilos globais
├── components/
│   └── ui/
│       └── button.tsx   # Componente Button (shadcn/ui)
└── lib/
    └── utils.ts         # Utilitário cn() para classes CSS
```

## Stack Tecnológica

- **React**: 19.2.4 (com React Compiler)
- **TypeScript**: 6.0.2
- **Build Tool**: Vite 8.0.5
- **Styling**: Tailwind CSS 4.2.2 + shadcn/ui
- **Icons**: Lucide React
- **Variantes de Estilo**: class-variance-authority

## Componentes Planejados (ADR-007)

Segundo [ADR-007](../../adr/ADR-007-treeview-phase.md), os seguintes componentes devem ser implementados na **Fase 1**:

### TreeView (Não Implementado)
- Navegação hierárquica por skills e agents
- Virtualização para listas grandes
- Base para indicadores de status de sync (Fase 2)
- Integração com VS Code Tree Data Provider

### ConfigPanel (Não Implementado)
- Edição de configurações de skills
- Visualização de metadados
- Validação em tempo real

### SyncPanel (Fase 2)
- Status de sincronização
- Resolução de conflitos
- Indicadores visuais de mudanças

## Componentes Implementados

### App Component
**Status**: ✅ Implementado (placeholder)  
**Arquivo**: `webview/src/App.tsx`

Componente raiz minimalista que renderiza "Helou Uordi". Será expandido para incluir:
- Layout principal da aplicação
- Roteamento entre painéis
- Provider de contexto para comunicação com extension

```typescript
function App() {
  return <>Helou Uordi</>;
}
```

### Button Component
**Status**: ✅ Implementado  
**Arquivo**: `webview/src/components/ui/button.tsx`

Componente de botão baseado em shadcn/ui com suporte a:
- Variantes: default, outline, secondary, ghost, destructive, link
- Tamanhos: xs, sm, default, lg, icon variants
- Composição via Radix UI Slot
- Estados: disabled, aria-invalid, focus-visible, hover

## Utilitários

### cn() Function
**Arquivo**: `webview/src/lib/utils.ts`

Utilitário para merge de classes Tailwind CSS usando `clsx` e `tailwind-merge`:

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Configuração de Build

- **Dev Server**: `pnpm dev` (Vite)
- **Build**: `pnpm build` (TypeScript + Vite)
- **Lint**: `pnpm lint` (Biome)
- **Type Check**: `pnpm typecheck`

## Próximos Passos

1. Implementar TreeView component conforme ADR-007
2. Criar sistema de comunicação webview ↔ extension via message protocol
3. Implementar ConfigPanel para edição de skills
4. Adicionar custom hooks para gerenciamento de estado
5. Integrar com VS Code Tree Data Provider

## Referências

- [ADR-007: TreeView na Fase 1](../../adr/ADR-007-treeview-phase.md)
- Protocolo de Comunicação: `docs/03-implementation/protocols/`
- Extension Bridge: `docs/03-implementation/extension/`
