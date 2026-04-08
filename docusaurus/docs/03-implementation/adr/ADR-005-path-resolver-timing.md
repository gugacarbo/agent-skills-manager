# ADR-005: Timing de Implementação do PathResolver

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

PathResolver está documentado mas implementação foi diferida. Sync Engine (Fase 2) depende dele para normalizar e resolver paths entre workspaces.

## Alternativas Consideradas

### Opção 1: Implementar agora na Fase 1 (pré-requisito)
- Prós: Disponível para Fase 2, permite testes isolados
- Contras: Mais trabalho na Fase 1

### Opção 2: Implementar junto com Sync Engine na Fase 2
- Prós: Just-in-time, menos upfront work
- Contras: Atrasa início do Sync Engine, dificulta testes

### Opção 3: Usar path.resolve do Node.js
- Prós: Sem código custom
- Contras: Menos controle, validações customizadas difíceis

## Decisão

**PathResolver implementado agora na Fase 1 (pré-requisito para Fase 2).**

Implementação em `shared/src/path-resolver.ts` com:

**API Principal**:
```typescript
class PathResolver {
  normalize(path: string): string;
  resolve(relativePath: string, base?: string): string;
  validate(path: string): boolean;
}
```

**Funcionalidades**:
- `normalize()`: Normalização de paths removendo redundâncias
- `resolve()`: Resolução relativo → absoluto usando `path.resolve` + validação
- `validate()`: Validação de existência e segurança combinadas

**Características Especiais**:
- Resolve symlinks para path real usando `fs.realpathSync()`
- Prevenção de path traversal attacks através de validação pós-resolução
- Transformação entre workspaces (método auxiliar)

## Consequências

### Positivas
- Disponível quando Sync Engine precisar
- Testável isoladamente
- Reutilizável em outros módulos

### Negativas
- Mais trabalho upfront na Fase 1
- Pode ser over-engineering se requisitos mudarem

## Implementação

- [ ] Criar `shared/src/path-resolver.ts`
- [ ] Implementar classe `PathResolver`
- [ ] Adicionar testes unitários
- [ ] Exportar em `shared/src/index.ts`
- [ ] Documentar API e casos de uso
