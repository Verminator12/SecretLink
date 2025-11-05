# SecretLink

SecretLink is a small React + TypeScript web app (Vite) for creating and revealing protected secrets through a collection of mini-games and challenge flows. It uses Supabase for backend services and Redux Toolkit for client state.

## Features

- Create secrets with multi-step protection options
- Reveal secrets through challenge games (Memory, Minesweeper, Password, Riddle, etc.)
- Supabase integration for persistence and authentication-ready APIs
- Built with Vite, React, TypeScript, Redux Toolkit and Sass

## Tech stack

- Vite + React + TypeScript
- Redux Toolkit for state management
- Supabase (via `@supabase/supabase-js`) for backend
- Sass for styling

## Quick start

Prerequisites
- Node.js (18+ recommended)
- npm (comes with Node) or a compatible package manager

1. Install dependencies

```bash
npm install
```

2. Add environment variables

This project expects the Supabase URL and anon key to be available at build/runtime via Vite env variables. Create a file named `.env.local` at the project root with the following values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace the placeholders above with your Supabase project's values.

3. Run the dev server

```bash
npm run dev
```

Open the address printed by Vite (usually http://localhost:5173).

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
- `npm run lint:fix` — run ESLint and attempt fixes
- `npm run test` — run unit tests with Vitest

## Supabase and database migrations

SQL migrations are stored in the `supabase/migrations` folder. If you're using the Supabase CLI, you can apply and manage migrations with the CLI. See the Supabase docs for instructions on installing and using the CLI: https://supabase.com/docs/guides/cli

## Notes for Windows/Git Bash users

If `node` or `npm` are not available in Git Bash after installing Node, make sure `C:\Program Files\nodejs` (and optionally `%APPDATA%\npm`) are on your PATH. You can add them to your `~/.bashrc` or `~/.bash_profile` for Git Bash:

```bash
echo 'export PATH="/c/Program Files/nodejs:/c/Users/$(whoami)/AppData/Roaming/npm:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## Contributing

Contributions welcome — please open issues or PRs. Keep changes small and focused; run lint and tests locally before submitting.

## License

This repository does not specify a license. If you plan to share or publish this project, add a `LICENSE` file.

---

Generated from the project files in this repository. If you'd like the README to include screenshots, a deployment guide, or a code overview (routes, key components), tell me what you want and I can extend it.