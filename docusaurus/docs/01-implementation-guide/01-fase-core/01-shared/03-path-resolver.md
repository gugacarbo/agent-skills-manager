---
title: Path Resolver
description: Resolucao de caminhos com protecao contra path traversal e normalizacao.
---

## Escopo

Implementar resolucao de caminhos como pre-requisito para sincronizacao de arquivos.

## API Esperada

- `normalize(path)` para normalizacao de separadores e segmentos.
- `resolve(base, target)` para resolucao absoluta validada.
- `validate(path)` para verificar escopo permitido antes de IO.

## Contrato

- Receber base e caminho alvo.
- Normalizar separadores e validar escopo permitido.
- Bloquear qualquer saida fora da raiz esperada.
- Operacao com symlink deve validar caminho final resolvido.
- Metodo de validacao deve ser reutilizavel por extension e sync engine.

## Regras de Implementacao

- Validar caminho antes de ler ou escrever arquivo.
- Rejeitar caminho com tentativa de traversal.
- Reutilizar o mesmo resolver em extension e rotinas de sync.
- Tratar caminho invalido com erro previsivel e mensagem objetiva.
- Evitar duplicacao de logica de normalizacao em outros modulos.

## Erros e Limites

- Caminho fora da raiz deve falhar antes da operacao de disco.
- Caminho malformado deve retornar erro de validacao, nao erro generico.
- Falha de permissao deve ser tratada separadamente de path invalido.
