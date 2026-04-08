# ADR-013: Interface do Editor Assistido

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Fase 3 inclui "Editor Assistido de Skills" para facilitar criação e edição de skills. Precisamos definir interface.

## Alternativas Consideradas

### Opção 1: Editor baseado em formulário
- Prós: Validação inline, fácil para iniciantes
- Contras: Menos flexível, verbose

### Opção 2: Editor de texto com syntax highlighting
- Prós: Flexível, rápido para experts
- Contras: Menos assistido, mais erros

### Opção 3: Split editor (formulário + preview)
- Prós: Melhor dos dois mundos, preview em tempo real
- Contras: Mais complexo de implementar

### Opção 4: Editor simples sem assistência
- Prós: Simples de implementar
- Contras: Sem valor agregado vs editor de texto normal

## Decisão

**Split editor: formulário à esquerda, preview markdown/texto à direita.**

Layout:
```
┌─────────────────┬─────────────────┐
│   Formulário    │     Preview     │
│                 │                 │
│ Name: [____]    │  # React Skill  │
│ Desc: [____]    │                 │
│ Trigger: [___]  │  Description... │
│                 │                 │
│ [Validar]       │  Trigger: ...   │
└─────────────────┴─────────────────┘
```

Features:
- Formulário estruturado com campos validados
- Preview em tempo real (markdown rendering)
- Validação inline com Zod
- Syntax highlighting no preview
- Auto-save

## Consequências

### Positivas
- Experiência guiada para iniciantes
- Preview em tempo real reduz erros
- Validação inline previne problemas
- Flexibilidade para experts via texto

### Negativas
- Mais complexo de implementar
- Requer sincronização form ↔ preview
- Mais espaço de tela necessário

## Implementação

- [ ] Design do layout split
- [ ] Implementar formulário com campos validados
- [ ] Implementar preview com markdown rendering
- [ ] Implementar sincronização bidirecional
- [ ] Adicionar syntax highlighting
- [ ] Implementar auto-save
- [ ] Testes de usabilidade
