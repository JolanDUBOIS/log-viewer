# Log Viewer

This is a lightweight and responsive log viewer application built with **Svelte** and **Vite**.

## Status

This project is currently in **active development**.

## Goal

The goal is to create a **simple web-based log viewer** for JSON logs. It aims to offer:

- Real-time and fast rendering, even for large logs (10MB+)
- Efficient filtering on:
  - Log level (multi-select)
  - Timestamp (range and recent)
  - Fields like filename, function name, message content (include/exclude)
- Clean and intuitive user interface with:
  - Infinite scrolling
  - Color-coded log levels
  - Dynamic column visibility, order, and layout
  - Copy/paste and filtering via text highlight
  - Dark mode

## Tech Stack

- [Svelte](https://svelte.dev/)
- [Vite](https://vitejs.dev/)
- Plain HTML/JS for fast prototyping

## Project Structure

- `src/` – Svelte components and main logic
- `public/` – Static assets (e.g. sample log files like `log.json`)
- `.gitignore` – Includes `node_modules/`, SvelteKit artifacts, and optionally large logs

## Notes

- Current implementation uses a local JSON log file (`public/log.json`)
- Real-time log tailing and multi-file support planned for future updates

## Local Development

```bash
npm install
npm run dev
```