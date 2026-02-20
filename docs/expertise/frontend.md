# Frontend Expertise

## Project Context
React 18 + TypeScript renderer running inside Electron. Handles all UI — storyboard grid, scene editor, generation UI, audio timeline, settings, and export dialogs. Uses Zustand for state, Tailwind CSS for styling.

## Patterns & Conventions
- Components go in `src/renderer/src/components/{feature}/`
- One component per file, named export matching filename
- Stores in `src/renderer/src/stores/` using Zustand `create()`
- Hooks in `src/renderer/src/hooks/` prefixed with `use`
- All IPC calls go through `window.api` (typed in preload)
- JSX.Element return type for components

## Do's
- Use Tailwind utility classes directly in JSX
- Keep components focused — extract when a component exceeds ~100 lines
- Use Zustand selectors to avoid unnecessary re-renders
- Handle loading and error states in every async operation

## Don'ts
- Don't import `electron` or `fs` in renderer code — all system access goes through IPC
- Don't use inline styles when Tailwind classes exist
- Don't create context providers when Zustand stores suffice

## Gotchas
- `window.api` is only available after preload script runs — no top-level calls
- Tailwind classes must be in files matched by `tailwind.config.ts` content array

## Recent Changes
- 2026-02-20: Created app shell (App, Sidebar, MainContent, WelcomeScreen)
- 2026-02-20: Created project-store with create/open/save/close operations

## Open Issues
- Sidebar navigation items are placeholder buttons — need routing/view switching
- No keyboard shortcut handling yet
