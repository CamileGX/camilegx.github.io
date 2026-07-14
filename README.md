# DexieOS

DexieOS is a private, local-first personal operating system built as a static GitHub Pages application. It is designed to be a browser homepage: a focused command centre for links, work, notes, knowledge, local files, and personal integrations.

## What it includes

- A responsive dashboard with local clock, quick launch, system overview, projects, weather, and GitHub activity
- Editable browser-local shortcuts for Google, YouTube, ChatGPT, GitHub, Discord, Steam, Xbox, Reddit, Gmail, Drive, Calendar, Replit, and more
- Interactive projects with persistent notes and todo lists
- Five purpose-built assistant workspaces: Dexie, Coding, Research, Creative, and System
- Searchable Knowledge Base and Markdown-aware notes
- Local notes with autosave, folders, sorting, searching, rename, duplicate, and confirmed deletion
- A locally persisted timeline with addable milestones
- A real local file manager powered by the browser File System Access API: select a workspace, upload, drag-and-drop, rename, delete, search, filter, preview, and download/open files
- Settings for light/dark/dim themes, accents, reduced motion, compact mode, Google OAuth setup, GitHub username, and local data reset

## Architecture

DexieOS deliberately uses no framework, build tooling, server, or database. It is a small ES-module application which can run directly on GitHub Pages.

```text
├── assets/       Static media and future visual assets
├── components/   Reusable view templates
├── css/          Design tokens, responsive layout, and component styles
├── js/           Router, page controllers, and application data
├── modules/      Presentation utilities (for example Markdown rendering)
├── pages/        Page-layer documentation and module boundary
├── services/     Browser capabilities and external API adapters
├── storage/      Namespaced localStorage persistence layer
└── index.html    Application shell and accessible dialog primitives
```

### Local-first data

Notes, shortcuts, project details, settings, timeline milestones, and integration identifiers are stored under the `dexieos:` namespace in the current browser's `localStorage`. No personal content is sent to a DexieOS server because there is no DexieOS server.

The Files page intentionally does not simulate file management. In Chromium-based browsers served over HTTPS or localhost, choose `C:\Users\cisek\Documents\Dexi AGI` when prompted. The File System Access API grants access only after you explicitly select a folder, as required by browser security. The browser may retain that permission for the current origin, but DexieOS never receives unrestricted disk access.

### Integrations

- **Weather**: requests browser geolocation only when you choose “Use my location,” then fetches current conditions and city name from Open-Meteo.
- **GitHub**: accepts a username and uses GitHub’s public API for recently updated repositories. Authentication and private-repository support are deliberately not requested.
- **Google**: Settings contains a Google Identity Services foundation. Add your own OAuth web client ID to initialize Google sign-in. Drive, Calendar, and Gmail sync are intentionally not enabled yet; the service boundary exists so they can be added without coupling them to the UI.

## Local development

Open `index.html` in a modern browser for interface review. To use Google sign-in or the Files page, serve the folder over `localhost` or deploy it to GitHub Pages (secure context required). There are no packages to install and no build step.

## Roadmap

1. Encrypted optional export/import for local content
2. Authenticated GitHub dashboard with contribution history
3. Opt-in Google Drive, Calendar, and Gmail adapters
4. Richer Markdown preview and knowledge article authoring
5. Installable PWA shell for offline desktop-like use
