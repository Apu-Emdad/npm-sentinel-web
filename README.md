# npm-sentinel-web

The web dashboard for [npm-sentinel](https://github.com/Apu-Emdad/npm-sentinel-api): type an npm package name and get a risk score with the reasons.

Built with React, TypeScript, Vite and Mantine. The design is "Radar amber": dark slate with an amber accent, JetBrains Mono for all text, and both light and dark mode.

## Requirements

- Node 24 (`nvm use` reads `.nvmrc`)
- Yarn 4, through Corepack (`corepack enable`)
- The API running locally for pages that load data (see the API's README)

## Run for development

```bash
nvm use
corepack enable
yarn install
cp .env.example .env
yarn dev
```

The app runs at `http://localhost:5173`. That address must match `WEB_ORIGIN` in the API's `.env`.

## Run with Docker

```bash
cp .env.example .env
docker compose up --build
```

The app is built with `VITE_API_URL` from `.env` and served at `http://localhost:5173`. After changing `VITE_API_URL`, run `docker compose up --build` again.

## Environment

| Variable       | Default                 | Meaning                 |
| -------------- | ----------------------- | ----------------------- |
| `VITE_API_URL` | `http://localhost:6000` | Base URL of the API     |

## Scripts

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `yarn dev`          | Dev server with hot reload      |
| `yarn build`        | Production build into `dist/`   |
| `yarn preview`      | Serves `dist/` on port 4173     |
| `yarn lint`         | Oxlint                          |
| `yarn format`       | Prettier, writes changes        |
| `yarn format:check` | Prettier, only checks           |
| `yarn typecheck`    | TypeScript, no output           |
| `yarn test`         | Vitest with Testing Library     |

CI runs lint, format check, typecheck, tests and build on every pull request and every push to `main`.

## Folder layout

```
src/
  app/            App, router, providers, not-found page
  features/       One folder per feature (pages, components, api)
  shared/         Layout, shared UI, constants
  theme/          Mantine theme and global CSS
  test/           Test setup and helpers
```

## License

MIT
