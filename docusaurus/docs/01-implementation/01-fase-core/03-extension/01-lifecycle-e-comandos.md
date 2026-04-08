---
title: Lifecycle e Comandos
description: Ativacao da extensao, registro de comandos e encerramento seguro.
---

## Escopo

Estabelecer ciclo de vida da extension e comandos disponiveis na Fase 1.

## API / Interface

- Entrada: eventos de ativacao do host da extensao.
- Operacoes: registro de comandos, bootstrap de componentes essenciais e dispose de recursos.
- Saida: estado operacional inicial publicado para a webview.

## Contrato

- Ativar recursos essenciais no startup.
- Registrar comandos com handlers idempotentes.
- Liberar recursos e listeners no dispose.
- Garantir que o comando retorne resposta contratual para sucesso e erro.
- Bloquear execucao quando pre-condicao obrigatoria nao estiver atendida.

## Regras de Implementacao

- Falha em comando deve retornar erro controlado para UI.
- Comando sem contexto minimo deve responder com estado invalido.
- Eventos de ativacao precisam estar alinhados com package da extensao.
- Centralizar registro de comandos para reduzir drift de comportamento.
- Encerrar listeners e watchers no ciclo de dispose para evitar leak.

## Efeitos Colaterais

- Registra comandos no ambiente do VS Code.
- Inicializa integracao com webview e componentes de estado.
- Cria trilha de log de inicializacao e encerramento.

## Erros e Limites

- Falha de ativacao parcial deve degradar funcionalidade de modo explicito.
- Comando desconhecido ou indisponivel deve retornar erro contratual.
- Nao executar comandos com dependencia critica nao inicializada.

