# Architecture & Decisions

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Desktop shell | Electron | 33.x |
| UI framework | React + TypeScript | 18.x |
| Build tool | electron-vite | 5.x |
| State management | Zustand | 5.x |
| Styling | Tailwind CSS | 3.x |
| Package manager | pnpm (hoisted) | 10.x |
| Testing | Vitest + Playwright | 3.x |

## Key Decisions

### 2026-02-20: pnpm hoisted layout
**Decision:** Use `node-linker=hoisted` in `.npmrc`
**Reason:** pnpm's default strict layout breaks Electron's built-in module resolution. With strict layout, `require('electron')` resolves to the npm package (which exports a path string) instead of Electron's built-in module.

### 2026-02-20: Custom dev launcher script
**Decision:** Use `scripts/dev.js` wrapper instead of calling `electron-vite` directly
**Reason:** VSCode/Claude Code sets `ELECTRON_RUN_AS_NODE=1`, which forces Electron to run as plain Node.js. The wrapper deletes this env var before launching electron-vite.

### 2026-02-20: electron-vite v5 + SWC
**Decision:** Use electron-vite v5 with swcPlugin instead of v3 with esbuild
**Reason:** v5 uses SWC for TypeScript transformation in main/preload processes, producing cleaner CJS output with better module interop.

### 2026-02-20: No @electron-toolkit dependencies
**Decision:** Don't use @electron-toolkit/utils or @electron-toolkit/preload
**Reason:** v4 had compatibility issues with Electron v33 module loading. The functionality we need (isDev check, preload API) is simple enough to implement directly.

## Architecture Overview

### Process Model
- **Main process** (`src/main/`): Node.js runtime — file system, IPC, dialogs, window management
- **Preload** (`src/preload/`): Bridge between main and renderer — exposes typed API via contextBridge
- **Renderer** (`src/renderer/`): React app running in Chromium — UI, state, user interaction

### Data Flow
```
Renderer (React/Zustand) → IPC invoke → Main (handlers) → File system
                         ← IPC response ←
```

### Project Storage
Each project is a folder on disk:
```
ProjectName/
├── project.json    (ProjectFile: version + Project data)
├── assets/         (bundled images, audio, etc.)
└── .thumbnails/    (auto-generated)
```
