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
