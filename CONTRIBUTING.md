# Contributing

Thanks for your interest in NexaDash.

## Development setup

1. Use Node.js 22 (or another version supported by Angular 21).
2. Install dependencies with `npm ci`.
3. Start the dev server with `npm start` and open http://localhost:4200/.

## Before opening a pull request

```bash
npm run lint
npm test -- --watch=false
npm run build
```

A Husky pre-commit hook runs `lint-staged`, which applies ESLint and Prettier to staged files.

## Code style

- Standalone components only; use `inject()` for dependency injection.
- Put new pages under `src/app/features/<name>` and register them as lazy-loaded routes in `app.routes.ts`.
- App-wide singletons go in `src/app/core`, reusable presentational pieces in `src/app/shared`.
- Use Angular Material for interactive components and Tailwind utilities for layout and spacing.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add users page
fix: keep theme preference after reload
docs: update setup instructions
```

`git-cz` can be used to write commit messages interactively.

## Branches and pull requests

- Create a branch from `main` (for example `feat/users-page`).
- Keep pull requests focused on one change and fill in the pull request template.
