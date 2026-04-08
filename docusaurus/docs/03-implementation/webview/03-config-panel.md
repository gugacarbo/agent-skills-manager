---
title: ConfigPanel Component
description: Painel de configuração e edição de skills (planejado)
---

## Status: 🔜 Não Implementado

Este componente está **planejado para a Fase 1**, mas ainda não foi implementado.

## Objetivo

Fornecer interface para visualização e edição de configurações de skills, incluindo metadados, dependências e parâmetros.

## Especificação Planejada

### Props (Proposta)

```typescript
interface ConfigPanelProps {
  // Skill sendo editada (null se nenhuma selecionada)
  skill: SkillConfig | null;
  
  // Callback quando configuração é alterada
  onChange?: (config: SkillConfig) => void;
  
  // Callback para salvar mudanças
  onSave?: (config: SkillConfig) => Promise<void>;
  
  // Estado de salvamento
  saving?: boolean;
  
  // Modo readonly (visualização apenas)
  readonly?: boolean;
  
  // Validação em tempo real
  validate?: (config: SkillConfig) => ValidationResult;
}

interface SkillConfig {
  id: string;
  name: string;
  description: string;
  location: 'project' | 'user' | 'builtin';
  enabled: boolean;
  triggers?: string[];
  dependencies?: string[];
  metadata?: Record<string, unknown>;
}

interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
  warnings?: Record<string, string>;
}
```

### Layout Planejado

```
┌─────────────────────────────────────┐
│ [Skill Icon] Skill Name          [⚙]│
├─────────────────────────────────────┤
│                                     │
│ Description                         │
│ [Text area with skill description]  │
│                                     │
│ Configuration                       │
│ ┌─────────────────────────────────┐ │
│ │ Name:        [input]            │ │
│ │ Location:    [project ▼]        │ │
│ │ Enabled:     [✓] Active         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Triggers (keywords)                 │
│ [create prd] [write spec] [+]       │
│                                     │
│ Dependencies                        │
│ [ralph-worker] [react] [+]          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Cancel] [Save Changes]         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Comportamento Planejado

### Edição

#### Estados do Painel
- **Empty State**: Nenhuma skill selecionada → "Select a skill to configure"
- **View Mode**: Skill selecionada, readonly=true
- **Edit Mode**: Skill selecionada, readonly=false
- **Saving**: Mostra loading spinner, desabilita inputs

#### Validação em Tempo Real
- Nome não pode ser vazio
- Nome deve ser único no escopo (project/user)
- Triggers devem ser strings não vazias
- Dependencies devem referenciar skills existentes
- Feedback visual: borda vermelha + mensagem de erro

#### Auto-save vs Manual Save
**Decisão necessária**: escolher entre:
1. Auto-save com debounce (500ms)
2. Manual save com botão "Save Changes"
3. Híbrido: auto-save para minor changes, confirmação para major changes

### Integração com Extension

Comunicação via message protocol:

```typescript
// webview → extension: solicitar dados da skill
{
  type: 'config.load',
  payload: { skillId: 'ralph-prd' }
}

// extension → webview: responder com dados
{
  type: 'config.data',
  payload: {
    skill: { /* SkillConfig */ },
    schema: { /* JSON Schema para validação */ }
  }
}

// webview → extension: salvar mudanças
{
  type: 'config.save',
  payload: { skill: { /* SkillConfig atualizada */ } }
}

// extension → webview: confirmar salvamento
{
  type: 'config.saved',
  payload: { success: true, skillId: 'ralph-prd' }
}
```

## Componentes Internos Planejados

### FormField Component
Input genérico com label, validação e mensagens de erro:
```typescript
<FormField
  label="Skill Name"
  value={config.name}
  onChange={handleNameChange}
  error={errors.name}
  required
/>
```

### TagInput Component
Gerenciamento de tags para triggers e dependencies:
```typescript
<TagInput
  label="Triggers"
  tags={config.triggers}
  onAdd={handleAddTrigger}
  onRemove={handleRemoveTrigger}
  placeholder="Add trigger keyword..."
/>
```

### Switch Component
Toggle para enabled/disabled:
```typescript
<Switch
  checked={config.enabled}
  onCheckedChange={handleToggleEnabled}
  label="Active"
/>
```

## Requisitos Técnicos

### Dependências Necessárias
Usar componentes shadcn/ui:
- `Input`, `Textarea`, `Label`
- `Switch`, `Select`
- `Button` (já implementado)
- `Badge` (para tags)
- `Alert` (para mensagens de validação)

### State Management
Usar hooks locais ou considerar:
- `useReducer` para estado complexo do form
- `react-hook-form` para validação e gerenciamento de forms
- `zod` para schemas de validação TypeScript-first

### Performance
- Debounce em onChange handlers (300-500ms)
- Memoização de funções de validação
- Lazy loading de metadados pesados

## Acessibilidade

- Labels associados com inputs via `htmlFor`/`id`
- Mensagens de erro anunciadas via `aria-describedby`
- `aria-invalid` em campos com erros
- `aria-required` em campos obrigatórios
- `role="alert"` em mensagens de validação
- Suporte completo a keyboard navigation

## Critérios de Aceite

- [ ] Renderiza configuração de skill selecionada
- [ ] Permite edição de campos: name, description, enabled
- [ ] Gerencia triggers e dependencies como tags
- [ ] Validação em tempo real com feedback visual
- [ ] Salva mudanças via message protocol
- [ ] Loading states durante save operations
- [ ] Error handling com mensagens descritivas
- [ ] Readonly mode funcional
- [ ] Acessibilidade completa (ARIA, keyboard)

## Exemplo de Uso (Futuro)

```tsx
import { ConfigPanel } from './components/ConfigPanel';
import { useSkillConfig } from './hooks/useSkillConfig';

function App() {
  const { skill, loading, save } = useSkillConfig(selectedSkillId);
  
  return (
    <ConfigPanel
      skill={skill}
      onSave={save}
      saving={loading}
      validate={validateSkillConfig}
    />
  );
}
```

## Referências

- [shadcn/ui Forms](https://ui.shadcn.com/docs/components/form)
- [react-hook-form](https://react-hook-form.com/)
- [zod validation](https://zod.dev/)
- Message Protocol: `docs/03-implementation/protocols/`
