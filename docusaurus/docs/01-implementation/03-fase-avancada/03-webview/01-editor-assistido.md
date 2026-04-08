---
title: Editor Assistido
description: Instrucao de implementacao da UI assistida com validacao e preview em paralelo.
---

## Escopo

Implementar editor assistido para configuracoes e metadados de skills.

## API / Interface

- Entrada: estado atual validado e rascunho em edicao.
- Operacoes: editar campos, validar incrementalmente e atualizar preview.
- Saida: payload persistivel somente quando contrato estiver valido.

## Contrato

- Exibir formulario e preview com sincronizacao bidirecional controlada.
- Validar dados durante edicao sem perder contexto da tela.
- Persistir apenas quando contrato compartilhado estiver valido.
- Diferenciar claramente estado rascunho de estado aplicado.

## Regras de Implementacao

- Organizar estado em camadas: rascunho, valido e persistido.
- Exibir diferenca entre valor atual e valor aplicado.
- Evitar acoplamento direto do formulario com APIs de persistencia.
- Exibir erro por campo e erro global com prioridade clara.

## Erros e Limites

- Campo invalido nao deve bloquear navegacao do usuario na tela.
- Persistencia com contrato invalido deve ser recusada com feedback objetivo.
- Falha de sincronizacao entre formulario e preview deve manter ultimo estado valido.

