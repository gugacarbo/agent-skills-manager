---
title: Estratégias de Testes
sidebar_label: Testes
---

# Estratégias de Testes

## Decisão

**Decisão**: **Testes unitários para funções críticas**

## Escopo Incluído

- Path resolver
- Sync engine
- Validação de schema (Zod)
- Git operations (com mocks)

## Escopo Excluído

- Testes E2E (por enquanto)
- Testes de integração complexos

## Racional

- Custo-benefício inicial
- Cobertura de funções críticas
- Rápida execução no CI

## Stack

- Vitest (runner)
- Testing Library (se necessário)

## Referências

- [Decisões de Arquitetura](./05-decisoes-arquitetura) - Contexto completo das decisões
