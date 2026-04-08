---
title: TreeView
description: Instrucao de implementacao da arvore de skills na Fase 1.
---

## Escopo

Entregar navegacao hierarquica de skills como componente principal da webview.

## API / Interface

- Entrada: estrutura de arvore recebida da extension e estado de selecao.
- Operacoes: renderizacao virtualizada, expansao/colapso e selecao de item.
- Saida: eventos de interacao para atualizacao de estado e navegacao.

## Contrato

- Renderizar estrutura hierarquica recebida da extension.
- Suportar quantidade alta de itens com virtualizacao quando necessario.
- Reservar pontos de extensao para badges de sincronizacao na Fase 2.

## Regras de Implementacao

- Tratar expansao e selecao de forma previsivel e restauravel.
- Exibir estado vazio e erro de carregamento com mensagens claras.
- Nao recalcular arvore completa para atualizacao pontual.

## Efeitos Colaterais

- Dispara eventos de selecao para o fluxo de detalhes/configuracao.
- Atualiza representacao visual conforme eventos de refresh da extension.

## Erros e Limites

- Item malformado deve ser ignorado com log de diagnostico.
- Falha de virtualizacao nao deve impedir renderizacao basica da lista.

