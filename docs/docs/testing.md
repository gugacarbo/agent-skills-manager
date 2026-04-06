---
title: Testes
sidebar_position: 4
slug: testing
---

# Testes

## Estratégia de Testes

| Tipo       | Ferramenta              | Cobertura Alvo         |
| ---------- | ----------------------- | ---------------------- |
| Unitários  | Vitest                  | > 80% nos módulos core |
| Integração | `@vscode/test-electron` | Fluxos principais      |
| Manuais    | Checklist               | Features críticas      |

## Testes Unitários

### SkillRegistry

```typescript
describe('SkillRegistry', () => {
  it('deve indexar skills a partir do source path', async () => {
    const registry = new SkillRegistry(mockSourcePath);
    await registry.refresh();
    const skills = registry.getAllSkills();
    expect(skills.length).toBe(3);
  });

  it('deve buscar skill por nome', () => {
    const skill = registry.getSkillByName('context7-mcp');
    expect(skill?.name).toBe('context7-mcp');
  });

  it('deve filtrar skills por query', () => {
    const results = registry.searchSkills('context');
    expect(results.every(s => s.description.includes('context'))).toBe(true);
  });

  it('deve emitir onDidChange ao atualizar', async () => {
    const listener = jest.fn();
    registry.onDidChange(listener);
    await registry.refresh();
    expect(listener).toHaveBeenCalled();
  });
});
```

### ValidationEngine

```typescript
describe('ValidationEngine', () => {
  it('deve validar skill com frontmatter correto', async () => {
    const result = await engine.validateSkill(validSkillPath);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('deve rejeitar skill sem campo name', async () => {
    const result = await engine.validateSkill(missingNamePath);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'name', code: 'MISSING_REQUIRED' })
    );
  });

  it('deve rejeitar name que não bate com pasta', async () => {
    const result = await engine.validateSkill(nameMismatchPath);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'name', code: 'NAME_MISMATCH' })
    );
  });

  it('deve validar regex de kebab-case no name', async () => {
    const result = await engine.validateSkill(invalidNamePath);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'name', code: 'INVALID_FORMAT' })
    );
  });
});
```

### SyncEngine

```typescript
describe('SyncEngine', () => {
  it('deve copiar skill para destino', async () => {
    const results = await engine.syncSkill(mockSkill, [mockDestination]);
    expect(results[0].success).toBe(true);
    expect(fs.existsSync(resolvedPath)).toBe(true);
  });

  it('deve adicionar header gerenciado', async () => {
    await engine.syncSkill(mockSkill, [mockDestination]);
    const content = fs.readFileSync(resolvedPath, 'utf-8');
    expect(content).toContain('Managed by Agent Skills Manager');
  });

  it('deve detectar conflito com arquivo não-gerenciado', async () => {
    fs.writeFileSync(resolvedPath, 'manual content');
    const conflict = await destManager.detectConflicts(mockDestination, mockSkill);
    expect(conflict).not.toBeNull();
  });

  it('deve remover skill ao desativar', async () => {
    await engine.syncSkill(mockSkill, [mockDestination]);
    await engine.unsyncSkill(mockSkill, [mockDestination]);
    expect(fs.existsSync(resolvedPath)).toBe(false);
  });
});
```

## Teste de Integração

```typescript
describe('Fluxo completo', () => {
  it('deve ativar skill e sincronizar', async () => {
    // 1. Carregar registry
    await registry.refresh();
    // 2. Ativar skill
    await configManager.activateSkill('context7-mcp');
    // 3. Verificar sync
    const results = await syncEngine.syncAll(
      registry.getAllSkills().filter(s => configManager.isActive(s.name)),
      destinations
    );
    expect(results.every(r => r.success)).toBe(true);
    // 4. Verificar arquivo no destino
    expect(fs.existsSync(destPath)).toBe(true);
  });
});
```

## Checklist de Testes Manuais

### Setup Inicial
- [ ] Extensão carrega sem erros
- [ ] Source path vazio exibe welcome view
- [ ] Source path sem configuração exibe welcome view

### TreeView
- [ ] Skills são listadas corretamente
- [ ] Rules são listadas separadamente
- [ ] Ícone de ativação está correto
- [ ] Clique em skill abre o arquivo
- [ ] Toggle ativa/desativa funciona
- [ ] Refresh recarrega a lista

### Sync
- [ ] Ativar skill copia para destinos
- [ ] Desativar remove dos destinos
- [ ] Editar skill salva e sync-on-save funciona
- [ ] Edição externa dispara re-sync via watch
- [ ] Conflito com arquivo manual gera aviso
- [ ] Arquivo gerenciado é identificado corretamente

### Editor
- [ ] IntelliSense funciona em frontmatter
- [ ] Diagnostics aparecem no Problems panel
- [ ] Erros de validação são claros e acionáveis
- [ ] Criar skill via wizard funciona
- [ ] Wizard valida campos obrigatórios

### Comandos
- [ ] Todos os 15 comandos funcionam via Command Palette
- [ ] Context menus na TreeView funcionam
- [ ] Context menu no editor funciona
