# DexieOS

DexieOS is a futuristic personal operating system and AI command center, built as a fast static GitHub Pages site. It brings projects, AI assistants, knowledge, a timeline, and local notes into one calm, focused interface.

## Features

- Responsive glassmorphism dashboard with live clock and simulated system widgets
- Dedicated Projects, AI Assistants, Knowledge Base, Timeline, Notes, and Settings views
- LocalStorage-powered notes: no account, server, or external database required
- Theme personalization: accent colours and motion preference are saved locally
- Lightweight modular HTML, CSS, and ES modules with no build step or framework

## Project structure

```text
├── assets/         # Reserved for images, icons, and other static media
├── components/     # Reusable page view templates
├── css/            # Base tokens/layout and UI component styles
├── js/             # Application router, state, and content data
└── index.html      # Static GitHub Pages entry point
```

## Run locally

Open `index.html` in a modern browser, or serve the directory with any static file server. No installation or build command is needed.

## Deployment

Push the project to the branch configured in GitHub Pages. Because DexieOS is fully static, GitHub Pages publishes it directly.

## Notes on data

Notes and display preferences use your browser's `localStorage`. They never leave the browser and may be cleared from the browser's site data controls.
