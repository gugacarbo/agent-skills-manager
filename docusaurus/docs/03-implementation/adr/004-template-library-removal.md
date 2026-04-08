---
title: ADR-004 Exclusão de Template Library
sidebar_label: "004: Template Library Removal"
description: Remoção temporária da Template Library do roadmap
---

# ADR-004: Exclusão de Template Library do Roadmap Inicial

**Data**: 2026-04-08  
**Status**: Aceito  
**Decisores**: Equipe de desenvolvimento  

## Contexto

O roadmap original incluía uma "Template Library" na Fase 4 com:
- Biblioteca embutida de templates de skills
- Picker de templates na UI
- Aplicação em 1 clique
- Templates atualizáveis via updates da extensão
- Possível suporte a templates customizados/remotos

Após análise de prioridades e recursos, identificou-se necessidade de focar no core do produto primeiro.

## Decisão

**Remover Template Library do roadmap temporariamente**

- Feature completamente removida das Fases 1-4
- Pode ser reconsiderada em iterações futuras após validação do produto core
- Documentação atualizada para refletir remoção
- Foco permanece em sincronização, validação e multi-agent

## Alternativas Consideradas

### Opção 1: Manter como Fase 5
- **Prós**: 
  - Não perde o planejamento
  - Pode ser implementada depois
- **Contras**:
  - Adiciona complexidade ao roadmap
  - Distração do foco atual

### Opção 2: Implementar MVP ultra-simples
- **Prós**: 
  - Algum valor entregue
  - Validação mais cedo
- **Contras**:
  - Recursos dispersos
  - MVP pode decepcionar usuários
  - Manutenção de feature não-prioritária

### Opção Escolhida: Remover completamente
**Justificativa**: 
- Foco total no core value: sincronização de skills
- Recursos limitados devem ir para features essenciais
- Template Library é "nice-to-have", não "must-have"
- Pode retornar após validação do produto base

## Consequências

### Positivas
- Roadmap mais focado e alcançável
- Menos features = menos código para manter
- Time pode focar em qualidade da sincronização
- Reduz escopo da Fase 4

### Negativas
- Usuários terão que criar skills manualmente
- Onboarding pode ser mais difícil para novos usuários
- Sem exemplos "prontos para usar"

### Neutras
- Pode ser reconsiderada após lançamento
- Feedback de usuários pode validar necessidade
- Possível implementação comunitária no futuro

## Implementação

- [x] Atualizar `01-decisoes-features.md` (remover Template Library)
- [x] Atualizar `01-fases-implementacao.md` (remover da Fase 4)
- [x] Atualizar `02-criterios-aceite.md` (remover critérios de templates)
- [x] Atualizar `00-decisoes-consolidadas.md` (adicionar decisão Q14)
- [x] Criar este ADR documentando a decisão

## Referências

- [Decisões de Features](../../02-development/03-features/01-decisoes-features.md)
- [Fases da Implementação](../../02-development/04-roadmap/01-fases-implementacao.md)
- [Decisões Consolidadas](../../02-development/04-roadmap/00-decisoes-consolidadas.md) (Q14)
