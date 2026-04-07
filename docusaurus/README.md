# Agent Skills Manager - Technical Documentation

This is the **technical documentation** for developers working on the Agent Skills Manager VS Code extension.

Built with [Docusaurus 3](https://docusaurus.io/).

## Purpose

This documentation is for:

- ✅ Contributors and maintainers of the extension
- ✅ Developers understanding the internal architecture
- ✅ Technical implementation details and API references

This is **NOT** end-user documentation. For user-facing docs, see the extension README or marketplace listing.

## Development

### Installation

```bash
pnpm install
```

### Local Development Server

```bash
pnpm start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without needing to restart the server.

### Build Documentation Site

```bash
pnpm build
```

Generates static content into the `build` directory that can be served using any static content hosting service.

## Contributing to Docs

When adding new documentation:

1. Follow the existing structure and naming conventions
2. Use Mermaid diagrams for architecture/flows
3. Include code examples with TypeScript syntax
4. Keep technical accuracy as priority over brevity
5. Update sidebars.ts if adding new pages

