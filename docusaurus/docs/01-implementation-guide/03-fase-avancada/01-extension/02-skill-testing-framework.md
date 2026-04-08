---
title: Skill Testing Framework
description: Validacao estrutural e regras de qualidade para skills antes da sincronizacao.
---

## Escopo

Adicionar validacoes para qualidade de skills com severidade configuravel.

## API / Interface

- Entrada: skill candidata e conjunto de regras ativas.
- Operacoes: validar schema, executar regras e classificar severidade.
- Saida: relatorio estruturado consumivel por sync panel e logs.

## Contrato

- Validacao de schema obrigatoria.
- Regras de lint podem gerar warning ou erro conforme configuracao.
- Resultado de teste deve ser consumivel pelo painel de sync.
- Regra deve publicar identificador, severidade e sugestao de correcao.

## Regras de Implementacao

- Executar validacao sem sandbox como regra inicial.
- Nao bloquear sync por warnings quando politica permitir continuidade.
- Consolidar saida por categoria de erro para facilitar correcao.
- Garantir determinismo de resultado para mesma entrada e mesmas regras.

## Erros e Limites

- Falha de regra nao deve invalidar execucao das demais regras.
- Erro de parser deve ser classificado separadamente de erro de lint.
- Mudanca de regra ativa deve ser refletida no proximo ciclo de validacao.

