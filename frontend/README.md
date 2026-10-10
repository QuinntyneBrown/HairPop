# Frontend

Angular 21 workspace for HairPop's web applications. It currently holds one project:

| Project      | Path                  | Purpose                                                                                                                                   |
| ------------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `components` | `projects/components` | `@hairpop/components`, the shared components library built to the CRDs in [`docs/specs/components/`](../docs/specs/components/README.md). |

## Commands

Run from this folder:

```bash
npm install            # also installs the husky pre-commit hook
npm run build          # ng build components → dist/components
npm run lint           # angular-eslint
npm run format:check   # Prettier
npm run format         # Prettier, write
```

The pre-commit hook runs `lint-staged`, which applies `eslint --fix` and Prettier to staged frontend files.

## Using the components library

Applications import components from `@hairpop/components` and bind them in standalone component `imports`. Every component uses the `hp` prefix, for example `<button hp-button variant="primary">` or `<hp-empty-state>`.

Each application lists the library's global stylesheets in `angular.json` `styles`, in this order, before any page styles:

```json
"styles": [
  "dist/components/styles/tokens.css",
  "dist/components/styles/fonts.css",
  "dist/components/styles/foundation.css",
  "dist/components/styles/layout.css",
  "node_modules/@angular/cdk/overlay-prebuilt.css"
]
```

- `tokens.css`: design tokens, light and dark themes (`data-theme` or `prefers-color-scheme`).
- `fonts.css`: local Manrope and JetBrains Mono.
- `foundation.css`: base typography, the shared focus ring, `.visually-hidden`, `.icon` and shared keyframes.
- `layout.css`: `.container`, `.stack`, `.cluster`, grids and the app shell classes.

Applications that show toasts call `provideToasts()` in `app.config.ts`.
