---
title: Hooks e Estado
description: Gerenciamento de estado da webview e sincronizacao com eventos da extension.
---

## Escopo

Padronizar hooks de comunicacao, cache local de UI e atualizacao de estado.

## API / Interface

- Entrada: eventos de protocolo, estado inicial e parametros de renderizacao.
- Operacoes: normalizar mensagem, atualizar estado derivado e publicar mudancas.
- Saida: estado consistente para componentes consumidores da webview.

## Contrato

- Estado derivado da extension deve ser a referencia principal.
- Hooks de mensagem devem encapsular parse, validacao e dispatch.
- Estado local da UI deve ser restrito ao necessario para renderizacao.

## Regras de Implementacao

- Evitar duplicacao do mesmo estado em multiplos hooks.
- Desinscrever listeners ao desmontar componentes.
- Registrar erro de parse em trilha de diagnostico.

## Efeitos Colaterais

- Atualiza cache local de interface a partir de eventos da extension.
- Propaga eventos de mudanca para componentes dependentes.

## Erros e Limites

- Erro de parse de evento nao deve interromper consumo de eventos seguintes.
- Estado local inconsistente deve ser reconciliado com novo snapshot da extension.

