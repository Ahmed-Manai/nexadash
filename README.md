# NexaDash

Admin dashboard starter built with Angular 21 standalone components, Angular Material and Tailwind CSS.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-21-757575)

## Features

- **App shell layout**: fixed sidebar, top bar and a scrollable content area that hosts routed pages.
- **Lazy-loaded routes**: the shell and the dashboard page are loaded with `loadComponent`; unknown URLs redirect to the dashboard.
- **Light / dark theme toggle**: `ThemeService` stores the choice in `localStorage`, falls back to the OS `prefers-color-scheme` setting, and toggles the `dark` class on `<html>` for Tailwind's class-based dark mode.
- **Sidebar navigation** with Material icons, tooltips and active-link highlighting.
- **Top bar** with theme switch, notifications button and an account menu (Profile / Settings / Sign out placeholders).
- **Dashboard page** with a responsive grid of stat cards (currently static placeholder values).
- **Material 3 theming** via `mat.theme()` (violet primary, blue secondary, orange tertiary) combined with Tailwind utility classes.
- **Code quality tooling**: ESLint (angular-eslint + typescript-eslint), Prettier, and a Husky pre-commit hook running lint-staged.

## Tech stack

| Area                 | Tool                                            | Version           |
| -------------------- | ----------------------------------------------- | ----------------- |
| Framework            | Angular (standalone components, signals-ready)  | ^21.2             |
| UI components        | Angular Material / CDK                          | ^21.2             |
| Styling              | Tailwind CSS, PostCSS, Autoprefixer, SCSS       | ^3.4              |
| Language             | TypeScript                                      | ~5.9              |
| Reactive state       | RxJS                                            | ~7.8              |
| Build                | `@angular/build` (esbuild application builder)  | ^21.2             |
| Unit tests           | Vitest + jsdom (via `@angular/build:unit-test`) | ^4.0              |
| Linting / formatting | ESLint, angular-eslint, Prettier                | ^10 / 21.4 / ^3.8 |
| Git hooks            | Husky + lint-staged                             | ^9 / ^17          |

## Project structure

```text
src/
├── index.html                    # Loads Roboto and Material Icons fonts
├── main.ts                       # bootstrapApplication(App, appConfig)
├── styles.scss                   # Material theme, Tailwind layers, shared .card / .page-header
└── app/
    ├── app.ts / app.html         # Root component (router outlet)
    ├── app.config.ts             # Router providers
    ├── app.routes.ts             # Shell route with lazy-loaded children
    ├── core/
    │   └── services/
    │       └── theme-service.ts  # Light/dark theme state
    ├── layout/
    │   ├── shell/                # App shell (sidebar + topbar + <router-outlet>)
    │   ├── sidebar/              # Navigation
    │   └── topbar/               # Theme toggle, notifications, account menu
    └── features/
        └── dashboard/            # Dashboard page
```

The intended layering (core / shared / features / layout) is described in [Notes](#architecture-notes).

## Getting started

### Prerequisites

- Node.js 22 (or another version supported by Angular 21: `^20.19`, `^22.12` or `>=24`)
- npm 10+ (the project declares `npm@11.9.0` as its package manager)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm start            # ng serve, then open http://localhost:4200/
```

### Build

```bash
npm run build        # production build into dist/nexadash
npm run watch        # development build in watch mode
```

### Test and lint

```bash
npm test                     # ng test (Vitest, watch mode)
npm test -- --watch=false    # single run, as in CI
npm run lint                 # ng lint
```

GitHub Actions (`.github/workflows/ci.yml`) runs lint, unit tests and the production build on Node 22 for every push and pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## Roadmap / ideas

The sidebar already links to these pages; they are not implemented yet and currently fall back to the dashboard:

- Users management page
- Analytics page
- Settings page
- Replace the static stat cards with reusable components fed by a service
- Authentication (login page, route guards, HTTP interceptors)

## Notes

### Setup commands used to create the project

```bash
npm install -g git-cz                                  # commitizen CLI for conventional commits
npm install -g @angular/cli                            # Angular CLI
ng new nexadash --routing --style=scss                 # project with routing and SCSS
npx ng build --configuration=development               # verify that it compiles
ng serve                                               # start the app
```

ESLint, Prettier and Git hooks:

```bash
npx ng add @angular-eslint/schematics --skip-confirmation
npm install --save-dev prettier eslint-config-prettier
npm install --save-dev husky lint-staged
npx husky init
npx lint-staged                                        # run the staged-file checks manually
```

Angular Material and Tailwind CSS:

```bash
npx ng add @angular/material --skip-confirmation
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```

App shell scaffolding:

```bash
ng g s core/services/theme-service
ng g c layout/sidebar
ng g c layout/topbar
ng g c layout/shell
ng g c features/dashboard
```

### Commit convention

Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `docs:`, `chore:` ...). `git-cz` can be used to write them interactively. On every commit, Husky runs `lint-staged`, which applies `eslint --fix` and `prettier --write` to staged `*.ts` / `*.html` files and `prettier --write` to staged `*.scss`, `*.css`, `*.json` and `*.md` files.

### NgModule vs standalone components

```text
NgModule bootstrap flow (older approach):
  main.ts
    → platformBrowserDynamic().bootstrapModule(AppModule)
      → AppModule (@NgModule)
        → declarations: [AppComponent]  ← every component must be declared here
        → imports: [BrowserModule, AppRoutingModule]
        → AppRoutingModule (@NgModule)
          → imports: [RouterModule.forRoot(routes)]

Standalone bootstrap flow (used in this project):
  main.ts
    → bootstrapApplication(App, appConfig)
      → App (standalone, imports its own dependencies)
      → appConfig (providers: [provideRouter, ...])
```

### Architecture notes

Target folder layout as the project grows:

```text
src/app/
├── core/         ← singleton services, interceptors, guards (auth, theme, logger)
├── shared/       ← presentational components, directives, pipes, pure utilities
├── features/     ← lazy-loaded feature slices (dashboard, users, analytics, settings, auth)
├── layout/       ← app shell (sidebar, top bar)
└── store/        ← state management
```

- **core/**: services instantiated once for the app's lifetime: guards, interceptors, auth logic. Infrastructure only.
- **shared/**: UI building blocks without business logic; data in through inputs, events out through outputs.
- **features/**: each feature is a self-contained vertical slice with its own components, services, state and routes, loaded lazily on navigation.
- **layout/**: the persistent shell that wraps authenticated pages.

### Why Angular Material + Tailwind CSS

Angular Material provides accessible, keyboard-navigable components (dialogs, menus, tables, date pickers) with ARIA support, RTL and focus management built in. Tailwind CSS handles layout, spacing and custom styling with utility classes, and unused utilities are purged at build time. Using both is a common pattern: Material for complex interactive components, Tailwind for everything around them. Alternatives considered: PrimeNG (richer set, heavier bundle), Tailwind UI / DaisyUI (build components yourself), Clarity Design.
