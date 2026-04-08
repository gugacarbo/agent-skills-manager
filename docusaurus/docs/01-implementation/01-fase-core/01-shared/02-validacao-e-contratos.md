---
title: Validacao e Contratos
description: Validacao de dados com schemas e limites de erro nas fronteiras.
---

## Escopo

Padronizar validacao de configuracao e mensagens nas fronteiras do sistema.

## Fronteiras de Validacao

- Entrada da webview para extension.
- Leitura de configuracao persistida.
- Eventos de filesystem e sync antes de mutacao de estado.
- Persistencia de configuracao e resultado de operacoes.

## Contrato

- Toda entrada externa deve ser validada antes de uso.
- Erro de validacao nao deve travar a extensao quando houver fallback seguro.
- Contratos devem preservar campos de erro para telemetria e depuracao.
- Handler so pode executar logica de negocio com payload validado.
- Erro deve retornar estrutura consistente para consumo da UI.

## Regras de Implementacao

- Validar payload recebido pela extension antes de executar acao.
- Validar estado de configuracao antes de persistir.
- Retornar erro padronizado para campos ausentes, tipo incorreto e estrutura invalida.
- Classificar erro em recuperavel e nao recuperavel quando aplicavel.
- Nao propagar excecao bruta para a camada de interface.

## Erros e Limites

- Violacao de schema deve retornar codigo e mensagem legivel.
- Erro em lote deve preservar contexto de cada item invalido.
- Falha de validacao repetida deve gerar log suficiente para diagnostico.
