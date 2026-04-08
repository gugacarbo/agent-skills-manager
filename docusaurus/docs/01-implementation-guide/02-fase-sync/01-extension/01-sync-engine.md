---
title: Sync Engine
description: Orquestracao de deteccao de mudancas, aplicacao de politicas e execucao de sync.
---

## Escopo

Implementar motor de sincronizacao com fluxo deterministico e auditavel.

## API / Interface

- Entrada: comando manual, autosync e eventos de alteracao monitorados.
- Operacoes: detectar mudancas, aplicar politicas, executar plano de sync.
- Saida: relatorio com operacoes, conflitos, erros e duracao.

## Contrato

- Iniciar ciclo de sync por comando manual ou autosync.
- Detectar mudancas antes de aplicar escrita em destino.
- Produzir resultado com operacoes executadas, conflitos e erros.
- Encerrar cada execucao com status final consumivel pela webview.
- Preservar rastreabilidade de decisoes para auditoria tecnica.

## Regras de Implementacao

- Aplicar politicas de conflito e operacoes destrutivas antes de escrever.
- Registrar eventos de inicio, decisao e resultado final.
- Separar erro recuperavel e erro terminal no relatorio de execucao.
- Isolar fases de planejamento e aplicacao para evitar escrita parcial invalida.
- Garantir consistencia entre estado de execucao e notificacoes para a UI.

## Efeitos Colaterais

- Atualiza arquivos de destino conforme politica vigente.
- Emite eventos de progresso e resultado para painel de sync.
- Registra trilha de operacoes para recuperacao orientada por Git.

## Erros e Limites

- Falha em operacao critica encerra ciclo com status de erro.
- Erro de IO, rede e validacao deve manter classificacao distinta.
- Estado intermediario deve ser explicitado quando houver cancelamento.

