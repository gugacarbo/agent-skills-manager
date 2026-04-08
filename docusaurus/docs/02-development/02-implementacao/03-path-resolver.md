---
title: Path Resolver
sidebar_label: Path Resolver
description: Módulo de resolução e normalização de caminhos
---

# Path Resolver

## Visão Geral

Módulo responsável por normalizar, resolver e validar caminhos de arquivos e diretórios no filesystem.

## Implementação

**Localização**: `shared/src/path-resolver.ts`

**Passos**:
1. Criar `shared/src/path-resolver.ts`
2. Implementar classe `PathResolver`
3. Adicionar testes unitários
4. Exportar em `shared/src/index.ts`

## Responsabilidades

1. **Normalização**: Converte caminhos para formato padronizado
2. **Resolução**: Transforma caminhos relativos em absolutos
3. **Validação**: Verifica se diretórios/arquivos existem
4. **Transformação**: Ajusta caminhos entre diferentes workspaces

## API

```typescript
class PathResolver {
  constructor(workspaceRoot: string)

  resolve(path: string): string
  normalize(path: string): string
  isValid(path: string): boolean
  exists(path: string): Promise<boolean>
  relativize(absolutePath: string): string
}
```

## Uso

```typescript
const resolver = new PathResolver(workspaceRoot)

// Resolve path relativo ao workspace
const skillsPath = resolver.resolve('skills')

// Normaliza path
const normalized = resolver.normalize('path/to/../file.txt')

// Verifica existência
const exists = await resolver.exists('skills/react/')
```

## Casos de Uso

| Caso            | Descrição                                 |
| --------------- | ----------------------------------------- |
| Multi-workspace | Resolve paths entre diferentes workspaces |
| Sincronização   | Normaliza caminhos antes de copiar        |
| Validação       | Verifica estrutura de diretórios          |
