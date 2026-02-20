# Testing Expertise

## Project Context
Testing infrastructure for the Director's Chair app. Uses Vitest for unit/integration tests and Playwright for E2E tests. The user serves as manual tester for UX validation.

## Patterns & Conventions
- Unit tests in `tests/unit/` mirroring source structure
- Integration tests in `tests/integration/`
- E2E tests in `tests/e2e/`
- Test files named `{feature}.test.ts` or `{feature}.spec.ts`
- Use `describe`/`it` blocks with clear descriptions
- Mock IPC calls in renderer tests, mock file system in main process tests

## Do's
- Test business logic in services (project-manager, adapters, job-queue)
- Test Zustand stores with direct API calls (not through components)
- Test IPC handlers with mocked Electron APIs
- Run `pnpm test` before every commit

## Don'ts
- Don't test implementation details — test behavior
- Don't create flaky tests that depend on timing
- Don't test trivial getters/setters

## Gotchas
- Vitest runs in Node.js, not Electron — `window.api` won't be available in unit tests
- Need to mock `electron` module for main process tests
- Playwright E2E tests launch the actual Electron app — need `ELECTRON_RUN_AS_NODE` unset

## Recent Changes
- 2026-02-20: Vitest configured in package.json (no tests written yet)

## Open Issues
- No test configuration file (vitest.config.ts) yet
- No Playwright configuration yet
- No tests written — testing will start alongside Phase 2
