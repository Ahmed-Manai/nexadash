# nexadash App

# commands

> npm install -g git-cz ### install git commitizen

> npm install -g @angular/cli ### Install angular globaly

> ng new nexadash --routing --style=scss ### Create Angular project with routing and SCSSshopt

> npx ng build --configuration=development ### verify compile

# ngModule vs Standalone Components

```text
NgModule Bootstrap Flow (old way):
  main.ts
    → platformBrowserDynamic().bootstrapModule(AppModule)
      → AppModule (@NgModule)
        → declarations: [AppComponent]  ← every component must be declared here
        → imports: [BrowserModule, AppRoutingModule]
        → AppRoutingModule (@NgModule)
          → imports: [RouterModule.forRoot(routes)]
```

```text
Standalone Bootstrap Flow (modern way):
  main.ts
    → bootstrapApplication(AppComponent, appConfig)
      → AppComponent (standalone: true, imports its own dependencies)
      → appConfig (providers: [provideRouter, provideHttpClient, ...])
```

# Set up ESLint (code check and analyzer)

> npx ng add @angular-eslint/schematics --skip-confirmation ### Add Angular ESLint schematics

> npm install --save-dev prettier eslint-config-prettier ### Install Prettier (automatic code formater) and prettier-eslint integration (bridge between ESLint and Prettier)

> npm install --save-dev husky lint-staged ### install Husky + lint-staged (run script automatically during Git action)

> npx husky init ### inti husky

> npx lint-staged ### check staged files manually

# Folder Structure

```text
src/app/
│
├── core/                         ← Singleton services, interceptors, guards (loaded once)
│   ├── auth/                     ← Authentication service, JWT handling
│   ├── interceptors/             ← HTTP interceptors (auth headers, error handling)
│   ├── guards/                   ← Route guards (auth, roles)
│   └── services/                 ← App-wide singleton services (logger, theme)
│
├── shared/                       ← Reusable components, directives, pipes, utilities
│   ├── components/               ← Dumb/presentational components (buttons, cards, etc.)
│   ├── directives/               ← Custom Angular directives
│   ├── pipes/                    ← Custom Angular pipes
│   └── utils/                    ← Pure utility functions (no Angular dependencies)
│
├── features/                     ← Feature modules (lazy loaded routes)
│   ├── dashboard/                ← Dashboard feature
│   ├── users/                    ← User management feature
│   ├── analytics/                ← Analytics feature
│   ├── settings/                 ← Settings feature
│   └── auth/                     ← Login/register pages
│
├── layout/                       ← App shell components (sidebar, navbar, footer)
│
├── store/                        ← NgRx state management (signals-based)
│
├── app.component.ts              ← Root shell
├── app.config.ts                 ← Root providers
└── app.routes.ts                 ← Root routes (lazy loads features)

Why this structure?
core/ — Services that should only be instantiated once for the app's lifetime. Guards, interceptors, auth logic. Nothing in core/ is shared between components — it's infrastructure.
shared/ — Components/directives/pipes with no business logic. Pure UI building blocks. They receive data via @Input() and emit events via @Output(). Completely reusable.
features/ — Each feature is a self-contained vertical slice: its own components, services, state, and routes. Features are lazy loaded — they don't load until the user navigates to them. This is how enterprise apps stay fast.
layout/ — The persistent app shell (sidebar, top bar) that wraps all authenticated pages.
```
