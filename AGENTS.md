# AGENTS.md - SuisoruIX Codebase Guide

## Build & Development Commands

- `pnpm dev` - Start Vite dev server with host flag
- `pnpm build` - Production build with Vite
- `pnpm preview` - Preview built project locally
- `pnpm lint` - Run ESLint with auto-fix on .js, .jsx, .ts, .tsx, .vue files
- `pnpm format` - Format code with Prettier

## Architecture & Structure

**Type:** Vue 3 + Vite single-page application (startpage/dashboard)

**Key Directories:**
- `src/components/` - Vue 3 components (.vue files)
- `src/stores/` - Pinia state management stores
- `src/api/` - API request handlers
- `src/utils/` - Utility functions (debounce, time, DOM tools, etc.)
- `src/style/` - SCSS stylesheets
- `src/assets/` - Static assets and images
- `src/plugins/` - Vue plugins and global configurations

**Tech Stack:**
- Vue 3.3.4 + Naive UI for components
- Pinia 2.1 + persistedstate plugin for state
- Vite 4.4 for bundling
- SASS for styling
- Axios + fetch-jsonp for API calls

## Code Style & Conventions

**Formatting:**
- Use Prettier with double quotes, trailing commas, 2-space tabs, 100-char line width
- ESLint config: Vue 3 essential rules + vue plugin
- Multi-word component names allowed (rule disabled)

**Imports & Modules:**
- ES modules only (`type: "module"`)
- Import order: standard/third-party → local utilities → components → styles

**Naming Conventions:**
- Components: PascalCase (.vue files)
- Functions/variables: camelCase
- Stores: descriptive names in lowercase with Store suffix

**Error Handling:**
- Use Naive UI global notifications: `$message`, `$dialog`, `$notification`, `$loadingBar`
- Prefer async/await over promises
- Handle API errors with appropriate user feedback
