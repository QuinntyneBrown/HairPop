# HairPop WebApp

Angular workspace for HairPop, containing:

- `app` - customer-facing application
- `app-admin` - admin application

## Prerequisites

- Node.js (LTS recommended)

## Install

```bash
npm install
```

## Run (dev)

```bash
# Customer app
npm start

# Admin app
npm run start:admin
```

By default Angular serves at `http://localhost:4200/` (and will prompt for an alternate port if it is taken).

## Build

```bash
npm run build        # app
npm run build:admin  # app-admin
npm run build:all
```

## Unit tests (Jest)

```bash
npm test
npm run test:admin
npm run test:all
```

## E2E tests (Playwright)

```bash
npm run e2e
npm run e2e:admin
npm run e2e:all
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

## Notes

- This repo uses Angular 21 and `@angular-builders/jest` for unit tests.
- For project configuration, see `angular.json` and `playwright.config.ts`.
