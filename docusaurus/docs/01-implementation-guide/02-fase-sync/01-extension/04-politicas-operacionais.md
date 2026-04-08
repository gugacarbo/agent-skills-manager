---
title: Politicas Operacionais
description: Autosync, retry, delete-rename, conflitos binarios e politica de git pull.
---

## Escopo

Consolidar politicas obrigatorias para operacao segura do motor de sync.

## Parametros Operacionais

- Debounce de autosync: 500ms como padrao inicial.
- Retry de rede: 3 tentativas com backoff exponencial (2s, 4s, 8s).
- Delete e rename: confirmacao explicita por padrao.
- Merge de binario: sempre manual, sem auto-merge.

## Contrato

- Autosync habilitado por padrao com debounce.
- Retry com backoff em falhas de rede recuperaveis.
- Delete e rename com confirmacao explicita por padrao.
- Git pull sempre manual.
- Conflito em arquivo binario sempre manual.
- Operacao destrutiva em lote deve exibir preview consolidado antes da confirmacao.
- Erro nao recuperavel deve encerrar operacao com retorno claro para a UI.

## Regras de Implementacao

- Expor override de aprovacao automatica apenas para delete/rename, quando habilitado por configuracao.
- Manter canal de progresso e cancelamento para operacoes longas.
- Bloquear merge automatico de conteudo binario.
- Aplicar retry apenas para categoria de erro recuperavel.
- Garantir que autosync nao execute ciclos concorrentes sobre o mesmo alvo.

## Erros e Limites

- Falha de rede com retries esgotados deve retornar erro final com contexto da ultima tentativa.
- Falha de permissao ou credencial nao deve entrar em retry.
- Divergencia de estado apos conflito manual deve exigir novo ciclo de sincronizacao.

