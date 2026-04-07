# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and Biome-based lint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev and build performance.

## Biome Configuration

Linting for this package is handled by the repository-level Biome config in [../biome.json](../biome.json).

To run the local check for this package, use:

```bash
pnpm lint
```
