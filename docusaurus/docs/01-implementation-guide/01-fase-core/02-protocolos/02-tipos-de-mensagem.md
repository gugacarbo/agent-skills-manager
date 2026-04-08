---
title: Tipos de Mensagem
description: Taxonomia de mensagens de comando, estado, erro e sincronizacao.
---

## Escopo

Definir lista de tipos aceitos e o contrato minimo de cada grupo.

## API / Interface

- Grupo comando: inicia acao no host da extensao.
- Grupo estado: atualiza representacao de interface.
- Grupo erro: comunica falha com contexto processavel.
- Grupo sync: publica progresso, conflito e resultado.

## Contrato

- Comando: solicita execucao de acao na extension.
- Estado: atualiza dados de interface e contexto.
- Erro: informa falha com codigo e descricao.
- Sync: comunica progresso, conflito e resultado final.
- Cada tipo deve ter schema proprio e semantica unica.
- Tipo nao pode reutilizar payload de outro grupo sem contrato explicito.

## Regras de Implementacao

- Usar discriminador unico por tipo.
- Evitar payload generico sem schema dedicado.
- Versionar mensagens por capacidade quando houver quebra de contrato.
- Consolidar catalogo de tipos no pacote compartilhado.
- Tratar removacao de tipo como mudanca de compatibilidade.

## Erros e Limites

- Tipo invalido deve retornar erro de contrato e nao erro interno.
- Campo obrigatorio ausente invalida mensagem inteira.
- Compatibilidade retroativa deve ser explicita quando houver evolucao.

