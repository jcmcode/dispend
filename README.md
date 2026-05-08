# dispend

A privacy-first personal finance app that runs locally. All your financial data stays on your machine in a local SQLite database — no cloud sync, no third-party servers. Import transactions from CSVs and PDFs, organize them with categories, set budgets, and review spending through reports and insights.

## Tech stack

React 19 + Vite + Express + SQLite/Drizzle + Tailwind v4 + shadcn

## Getting started

Install dependencies:

```bash
npm install
```

Generate and run the database migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the dev server (runs the Express API and Vite client concurrently):

```bash
npm run dev
```

## Other scripts

- `npm run build` — build the client bundle and compile the server
- `npm start` — run the compiled server
- `npm run lint` — lint `src/`
- `npm test` — run the Vitest suite

## Project layout

- `src/renderer` — React/Vite frontend (pages, components, stores, hooks)
- `src/server` — Express API and route handlers (accounts, transactions, categories, budgets, imports, reports, insights, investments)
- `src/main/db` — Drizzle schema and migrations
- `src/main/parsers` — CSV/PDF transaction parsers
- `src/shared` — code shared between client and server

## License

MIT
