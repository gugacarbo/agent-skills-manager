---
title: Hash e Cache
description: Deteccao de mudancas com estrategia hibrida e validacao de integridade do cache.
---

## Escopo

Aplicar caminho rapido por metadados e validacao por hash quando necessario.

## API / Interface

- Entrada: metadados de arquivo e estado de cache conhecido.
- Processamento: comparar metadado, calcular hash quando exigido e atualizar cache.
- Saida: decisao de mudanca com motivo de classificacao.

## Contrato

- Comparar timestamp e tamanho como fast path.
- Recalcular hash quando metadados divergirem.
- Tratar corrupcao de cache como estado invalido e reconstruir.
- Registrar se decisao veio de fast path ou verificacao de hash.

## Regras de Implementacao

- Usar hash criptografico consistente para confirmacao de mudanca.
- Nao assumir cache valido apos erro de leitura/parse.
- Registrar quando houve fallback de metadado para hash.
- Reconstruir cache apos corrupcao detectada antes de novas decisoes.

## Erros e Limites

- Inconsistencia de cache invalida decisao automatica anterior.
- Falha de hash em arquivo inacessivel deve retornar erro rastreavel.
- Estrategia deve evitar custo desnecessario de hash em lote estavel.

