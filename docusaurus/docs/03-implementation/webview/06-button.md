---
title: Button Component
description: Componente de botão baseado em shadcn/ui com variantes e tamanhos
---

## Status: ✅ Implementado

Componente Button totalmente implementado baseado em shadcn/ui com suporte a variantes, tamanhos e composição via Radix UI.

## Arquivo

**Localização**: `webview/src/components/ui/button.tsx`

## Props

```typescript
interface ButtonProps extends React.ComponentProps<"button"> {
  // Variante visual do botão
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  
  // Tamanho do botão
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
  
  // Renderizar como child (composição via Radix Slot)
  asChild?: boolean;
  
  // Todas as props nativas de <button>
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // ... e outras
}
```

## Variantes

### default
Botão primário com background accent e texto branco:
```tsx
<Button variant="default">Save Changes</Button>
```

### outline
Botão com borda, background transparente:
```tsx
<Button variant="outline">Cancel</Button>
```

### secondary
Botão secundário com background muted:
```tsx
<Button variant="secondary">Secondary Action</Button>
```

### ghost
Botão sem borda, apenas hover state:
```tsx
<Button variant="ghost">Close</Button>
```

### destructive
Botão para ações destrutivas (vermelho/red):
```tsx
<Button variant="destructive">Delete Skill</Button>
```

### link
Texto com underline estilo link:
```tsx
<Button variant="link">Learn More</Button>
```

## Tamanhos

### Tamanhos padrão
- **xs**: `h-6` - extra small, texto xs
- **sm**: `h-7` - small, texto 0.8rem
- **default**: `h-8` - tamanho padrão
- **lg**: `h-9` - large

### Tamanhos de ícone (quadrado)
- **icon-xs**: `6x6` (24px)
- **icon-sm**: `7x7` (28px)
- **icon**: `8x8` (32px)
- **icon-lg**: `9x9` (36px)

**Exemplo com ícone**:
```tsx
import { Settings } from 'lucide-react';

<Button size="icon" variant="ghost">
  <Settings />
</Button>
```

## Composição com asChild

O prop `asChild` permite compor o Button com outros elementos usando Radix UI Slot:

```tsx
import { Button } from './components/ui/button';

// Renderizar como link
<Button asChild variant="link">
  <a href="/docs">Documentation</a>
</Button>

// Renderizar como Next.js Link
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## Estados Nativos

### Disabled
```tsx
<Button disabled>Disabled Button</Button>
```
- Opacity reduzida (50%)
- Pointer events desabilitados
- Cursor não muda para pointer

### aria-invalid
```tsx
<Button aria-invalid="true">Invalid State</Button>
```
- Borda vermelha (destructive)
- Ring vermelho no focus

### aria-expanded
```tsx
<Button aria-expanded="true">Dropdown Open</Button>
```
- Background muted quando expandido
- Útil para botões de dropdown/accordion

### Focus Visible
- Borda ring azul no tab navigation
- Ring com opacity 50%
- Outline removido

### Active
- Translate Y de 1px (efeito de "click")
- Apenas quando não tem `aria-haspopup`

## Styling

### Customização com className

O componente usa `cn()` utility para merge de classes Tailwind:

```tsx
<Button 
  variant="outline" 
  className="w-full justify-between"
>
  Open Menu
  <ChevronDown />
</Button>
```

### Ícones dentro do Button

SVGs são automaticamente estilizados:
- Shrink: 0 (não encolhem)
- Pointer events: none
- Size padrão: `4x4` (16px)
- Pode ser sobrescrito: `<Icon className="size-5" />`

```tsx
<Button>
  <Save /> {/* 16px automático */}
  Save Changes
</Button>

<Button>
  <Trash className="size-5" /> {/* 20px custom */}
  Delete
</Button>
```

### Data Attributes

O Button expõe data attributes úteis para styling:

```tsx
data-slot="button"         // Identifica como button
data-variant={variant}     // Variante atual
data-size={size}           // Tamanho atual
```

Útil para styling de wrappers:
```css
[data-slot="button-group"] > button {
  /* Styles para botões dentro de button group */
}
```

## Acessibilidade

### ARIA Support
- `aria-invalid`: borda e ring vermelhos
- `aria-expanded`: background muted quando true
- `aria-haspopup`: desabilita active state
- `disabled`: pointer-events desabilitados

### Keyboard Navigation
- Tab: navega para o botão
- Enter/Space: ativa o botão
- Focus visible: ring azul

### Screen Readers
- Texto interno é lido automaticamente
- Use `aria-label` para botões apenas com ícone:
```tsx
<Button size="icon" aria-label="Close dialog">
  <X />
</Button>
```

## Exemplos de Uso

### Button Group
```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>
```

### Loading State
```tsx
<Button disabled={loading}>
  {loading && <Loader2 className="animate-spin" />}
  {loading ? 'Saving...' : 'Save'}
</Button>
```

### Com Ícone e Texto
```tsx
<Button>
  <Download />
  Download Report
</Button>
```

### Destructive Confirmation
```tsx
<Button variant="destructive" onClick={handleDelete}>
  <Trash2 />
  Delete Skill
</Button>
```

### Link-style Navigation
```tsx
<Button variant="link" asChild>
  <a href="/docs" target="_blank">
    View Documentation
    <ExternalLink className="ml-1" />
  </a>
</Button>
```

## Dependências

- **class-variance-authority**: Gerenciamento de variantes CSS
- **radix-ui/react-slot**: Composição de componentes
- **lucide-react**: Ícones (opcional, mas recomendado)
- **tailwind-merge**: Merge inteligente de classes Tailwind

## Performance

- **React.memo**: Não aplicado (componente leve)
- **Callbacks**: Use `useCallback` em handlers complexos
- **Re-renders**: Evite passar objects/arrays inline em props

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('is disabled when disabled prop is true', () => {
  render(<Button disabled>Disabled</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

## Referências

- [shadcn/ui Button](https://ui.shadcn.com/docs/components/button)
- [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [class-variance-authority](https://cva.style/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
