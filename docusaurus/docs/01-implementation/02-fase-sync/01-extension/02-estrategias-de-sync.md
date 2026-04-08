---
title: Estrategias de Sync
description: Regras para merge conservador, copia direta e conflito manual.
---

## Escopo

Definir caminho de resolucao para mudancas concorrentes entre origem e destino.

## API / Interface

- Entrada: conjunto de diferencas detectadas por arquivo.
- Processamento: classificar mudanca, resolver automaticamente quando seguro e sinalizar conflito.
- Saida: plano de acao por item com status aplicavel.

## Contrato

- Mudanca em lado unico permite copia direta.
- Mudanca em ambos os lados exige avaliacao de merge.
- Ambiguidade deve virar conflito manual.
- Arquivo binario com divergencia deve ser classificado direto como conflito manual.

## Regras de Implementacao

- Aplicar auto-merge somente quando nao houver sobreposicao de linhas.
- Nao ocultar conflito por tentativa de merge agressivo.
- Preservar artefatos de comparacao para revisao do usuario.
- Garantir que estrategia selecionada seja reproduzivel em nova execucao.

## Erros e Limites

- Resultado ambivalente deve falhar para modo manual.
- Merge automatico nao deve ocorrer sem confianca estrutural suficiente.
- Item sem base de comparacao valida deve ser marcado para revisao.

