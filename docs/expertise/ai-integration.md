# AI Integration Expertise

## Project Context
Adapter layer for local AI endpoints. Supports OpenAI-compatible APIs (LM Studio, Ollama for DeepSeek R1, Qwen, LLaMA 3.1) and ComfyUI (Flux, Qwen image, LTX2 for image generation). Runs in the main process.

## Patterns & Conventions
- Adapters in `src/main/ai/{adapter-name}.ts`
- Base adapter interface in `src/main/ai/adapter.ts`
- Job queue in `src/main/ai/job-queue.ts`
- IPC handlers in `src/main/ipc/generation.ts`
- Generation state in `src/renderer/src/stores/generation-store.ts`

## Do's
- Always implement timeout and cancellation for API calls
- Store prompt + parameters + output as GenerationRun in scene data
- Provide progress updates via IPC for long-running generations
- Test endpoint connectivity before first generation (health check)

## Don'ts
- Don't make network calls from the renderer — all API calls go through main process
- Don't hardcode model names or endpoints — make them configurable
- Don't block the main process during generation — use async queues

## Gotchas
- User's local setup: DeepSeek R1, Qwen (coding), LLaMA 3.1 for text; ComfyUI with Flux, Qwen image, LTX2 for images
- ComfyUI uses a workflow-based API (POST workflow JSON, poll for results) — very different from OpenAI chat completions
- Local models can be slow — generation queue with cancel/retry is essential
- LM Studio and Ollama both expose OpenAI-compatible endpoints (usually localhost:1234 or localhost:11434)

## Recent Changes
- 2026-02-20: Defined GenerationRun type in shared types (not yet implemented)

## Open Issues
- Need to inspect user's ComfyUI workflow JSON to build the adapter
- Need to determine which OpenAI-compatible server the user runs (LM Studio vs Ollama)
- Video generation (LTX2) deferred to v1.1
