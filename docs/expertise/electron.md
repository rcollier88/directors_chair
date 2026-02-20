# Electron Expertise

## Project Context
Electron main process handling window management, IPC, file system operations, and native dialogs. Built with electron-vite v5 + SWC.

## Patterns & Conventions
- IPC handlers registered in `src/main/ipc/{feature}.ts`
- Business logic in `src/main/services/{feature}.ts`
- IPC channel names defined in `src/shared/constants.ts`
- All IPC uses `ipcMain.handle`/`ipcRenderer.invoke` pattern (async, typed)
- Preload exposes API via `contextBridge.exposeInMainWorld`

## Do's
- Use `dialog.showOpenDialog`/`dialog.showSaveDialog` for file operations
- Always use `join()` from `path` for file paths
- Return structured results from IPC handlers (not just raw data)
- Store app-level settings in `app.getPath('userData')`

## Don'ts
- Don't access renderer DOM from main process
- Don't disable `sandbox` without good reason (currently disabled for preload access)
- Don't use `remote` module (deprecated)
- Don't hardcode paths — use `app.getPath()` and `__dirname`

## Gotchas
- **CRITICAL:** `ELECTRON_RUN_AS_NODE=1` is set by VSCode/Claude Code. This makes Electron run as plain Node.js. Our `scripts/dev.js` wrapper deletes this before launching. Always use `pnpm dev`, never call `electron-vite` directly from this terminal.
- **CRITICAL:** pnpm must use `node-linker=hoisted` (in `.npmrc`) for Electron compatibility. Without this, `require('electron')` resolves to the npm package path string instead of Electron's built-in module.
- `BrowserWindow.getFocusedWindow()` can return null — always check
- File paths on Windows use backslashes but the app should handle both
- `app.isPackaged` returns false in dev, true in production builds

## Recent Changes
- 2026-02-20: Created main process with window creation, IPC registration
- 2026-02-20: Created project IPC handlers (create, open, save, save-as, recent)
- 2026-02-20: Created project-manager service for file system operations

## Open Issues
- No menu bar configured yet
- No autosave implementation
- `sandbox: false` in BrowserWindow — evaluate if we can re-enable
