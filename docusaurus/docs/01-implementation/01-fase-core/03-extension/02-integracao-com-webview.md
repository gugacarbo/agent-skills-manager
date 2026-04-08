---
title: Integracao com Webview
description: Contrato de ponte entre extension host e interface webview.
---

## Escopo

Definir o acoplamento minimo entre extension e webview para operacao da fase.

## API / Interface

- Canal: troca de mensagens tipadas entre host e interface.
- Entrada: comandos e solicitacoes originadas na webview.
- Saida: estado, erro e notificacoes operacionais retornadas pela extension.

## Contrato

- Mensagem trafega apenas por protocolo tipado.
- Extension e fonte de verdade para estado operacional.
- Webview renderiza estado recebido sem mutacao local do contrato.
- Toda mensagem recebida deve encerrar com resposta explicita.
- Reconexao da webview deve restaurar estado consistente sem reload manual.

## Regras de Implementacao

- Inicializar bridge no bootstrap da view.
- Reenviar estado apos reconexao da webview.
- Centralizar tratamento de erro de comunicacao em camada unica.
- Isolar parse e validacao do transporte antes do handler de negocio.
- Evitar acoplamento da UI a detalhes internos da extension.

## Efeitos Colaterais

- Publica estado operacional para a camada de interface.
- Registra eventos de comunicacao para diagnostico.

## Erros e Limites

- Falha de parse de mensagem nao deve quebrar o canal.
- Tipo desconhecido deve retornar erro padronizado e rastreavel.
- Mensagem fora de contrato nao deve executar logica de negocio.

