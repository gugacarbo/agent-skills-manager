---
title: Decisões de Arquitetura
sidebar_label: Decisões
---

# Decisões de Arquitetura

Este documento consolida as decisões técnicas de arquitetura do Agent Skills Manager.

## 1. Validação de Schema

**Decisão**: Usar **Zod** para validação runtime

**Alternativas Consideradas**:
- JSON Schema (mais leve, menos type-safe)
- Validação manual (mais frágil)

**Racional**:
- Type safety end-to-end com TypeScript
- Validação em runtime de arquivos carregados
- Mensagens de erro claras e úteis
- Schema como fonte de verdade única

**Impacto**:
- Dependência: `zod`
- Schema definitions em `shared/types.ts`
- Validação em todos os pontos de entrada

---

## 2. Modelo de Segurança

**Decisão**: **Permissivo com avisos**

**Alternativas Consideradas**:
- Restritivo (bloquear paths fora do workspace)
- Configurável por policy

**Racional**:
- Flexibilidade para usuários avançados
- Avisos claros sobre riscos
- Usuário mantém controle final
- Balanceia segurança e usabilidade

**Implementação**:
- Warn em operações potencialmente perigosas
- Validação de paths (sanitize)
- Confirmação em operações destrutivas

---
