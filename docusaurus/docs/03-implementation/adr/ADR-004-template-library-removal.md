# ADR-004: Remoção de Template Library

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Roadmap original incluía "Template Library" na Fase 4, mas escopo e prioridade não estavam claros. Feature consumiria recursos significativos sem validação de valor para usuário.

## Alternativas Consideradas

### Opção 1: Manter Template Library na Fase 4
- Prós: Feature completa, usuário tem templates prontos
- Contras: Escopo grande, manutenção de templates, sem validação de necessidade

### Opção 2: Remover temporariamente do roadmap
- Prós: Foco em features core, pode reconsiderar com feedback
- Contras: Menos valor percebido inicialmente

### Opção 3: Implementar versão MVP mínima
- Prós: Algum valor com menos esforço
- Contras: MVP pode ser pior que nada

## Decisão

**Remover Template Library do roadmap temporariamente.**

Feature pode ser reconsiderada em iterações futuras após:
- Validação de necessidade com usuários reais
- Definição clara de escopo e fontes de templates
- Priorização vs outras features

## Consequências

### Positivas
- Foco em features core (sync, editor, multi-agent)
- Menos complexidade de manutenção
- Reduz escopo da Fase 4

### Negativas
- Usuários precisam criar skills do zero inicialmente
- Menos "wow factor" no lançamento

## Implementação

- [x] Remover Template Library dos documentos de roadmap
- [x] Atualizar critérios de aceite da Fase 4
- [x] Documentar remoção em decisões consolidadas
- [ ] Criar issue/backlog para reconsideração futura
