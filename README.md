# Director's Chair

A Windows desktop storyboard tool with local AI integration. Plan scenes visually, generate concept art from locally hosted AI models, and export shareable storyboards — all without sending data to third-party services.

## Features (In Development)

- **Storyboard management** — Create scenes with titles, descriptions, camera notes, dialogue, tags, and status tracking
- **Drag-and-drop reordering** — Arrange scenes visually on a grid
- **Asset management** — Import and attach reference images to scenes, with automatic thumbnailing
- **Local AI generation** — Generate images and text from your own locally running models
- **Audio timeline** — Import audio tracks, place scene markers, and scrub through your storyboard synced to audio
- **Export** — PDF storyboards, image contact sheets, JSON data, and FCPXML for Premiere Pro import

## AI Model Support

Director's Chair connects to AI models running on your own machine. It does **not** host or bundle any models — you bring your own.

### Supported Endpoints

**Text generation** (scene descriptions, shot suggestions):
- Any OpenAI-compatible API — works with [LM Studio](https://lmstudio.ai/), [Ollama](https://ollama.com/), [vLLM](https://github.com/vllm-project/vllm), or similar
- Tested with: DeepSeek R1, Qwen, LLaMA 3.1

**Image generation** (concept art, storyboard frames):
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) workflow API
- Tested with: Flux, Qwen image models

**Using closed-source / cloud models:**
Director's Chair works with any service that exposes an OpenAI-compatible API. If you want to use GPT-4, Claude, or other cloud models, simply point the Model Manager to their API endpoint and provide your API key. The app treats all endpoints the same — it just sends requests to whatever URL you configure.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+ (LTS recommended)
- [pnpm](https://pnpm.io/) v10+

### Install & Run

```bash
git clone https://github.com/rcollier88/directors_chair.git
cd directors_chair
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron |
| UI | React 18 + TypeScript |
| Build | electron-vite + SWC |
| State | Zustand |
| Styling | Tailwind CSS |
| Testing | Vitest + Playwright |

## Project Structure

```
src/
  main/           # Electron main process (file system, IPC, AI adapters)
  preload/        # Bridge between main and renderer
  renderer/       # React app (UI, stores, components)
  shared/         # Types and constants shared across processes
docs/
  project-status.md    # Development progress tracking
  backlog.md           # Known issues and deferred features
  architecture.md      # Technical decisions
  expertise/           # Sub-agent knowledge files
```

## Development Status

This project is under active development. See [docs/project-status.md](docs/project-status.md) for current progress.

**Current phase:** Phase 1 (Foundation) complete, Phase 2 (Storyboard Core) up next.

## Contributing

Contributions are welcome. The project uses a docs-driven development approach — check [docs/project-status.md](docs/project-status.md) for what's in progress and [docs/backlog.md](docs/backlog.md) for open items.

## License

[MIT](LICENSE) — use it however you want.
