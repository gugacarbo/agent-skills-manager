# agent-skills-manager

Gerencie, sincronize e valide skills de agentes de IA a partir de um repositório git central.

## Visão Geral

O Agent Skills Manager é uma extensão VS Code para gerenciar arquivos utilizados por agentes de IA provenientes de um repositório Git configurado pelo usuário, incluindo skills, rules, agents.md, prompts.md e outros tipos de arquivos personalizados. Ele oferece recursos como:

- Descoberta automática de arquivos de agentes de IA a partir de um clone local de repositório Git
- Habilitação de itens individualmente no escopo **global** (`~/.agents/`) ou por **workspace**
- Sincronização do conteúdo habilitado para os destinos correspondentes (global ou workspace)
- Seleção de quais padrões de nomenclatura e formato utilizar para salvar os arquivos (como Claude, Copilot, etc.), podendo aplicar diferentes combinações de padrões tanto no escopo global quanto por workspace individual
- Validação automática de formato de arquivos
- Sincronização automática ao salvar e ao ativar a extensão

## Documentação

Consulte a documentação completa em [Pages](https://gugacarbo.github.io/agent-skills-manager)

## Recursos Principais

- **Fonte Centralizada**: Skills, rules, agents.md, prompts.md e outros arquivos de agentes de IA vindos de um repositório Git, versionados e compartilháveis
- **Escopo Flexível**: Habilite cada item como global ou por workspace
- **Sincronização Inteligente**: Copia o conteúdo habilitado para os destinos corretos
- **Interface Intuitiva**: Painel de controle integrado ao VS Code
- **Configuração Flexível**: Personalize destinos e políticas conforme sua necessidade

Para detalhes sobre as decisões de arquitetura e roadmap, consulte a documentação do projeto.
