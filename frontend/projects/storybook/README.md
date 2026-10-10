# Storybook

The HairPop component storybook. It lists every component in `@hairpop/components` and renders its stories, one titled canvas per variant or state, with a light, dark or system theme switch.

The storybook is a development tool and is never deployed to customers. It compiles the library and the examples from source, so edits to a component or its stories reload live.

```bash
cd frontend
npm start                 # ng serve storybook → http://localhost:4200
npm run build:storybook   # static build → dist/storybook/browser
```

## Layout

| Path                                                                   | Holds                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `projects/storybook/src/app/app.ts`                                    | The shell: searchable component list, theme switch, page heading.        |
| `projects/components-examples/src/<component>/<component>-examples.ts` | One examples page per component, made of `<hp-example>` stories.         |
| `projects/components-examples/src/shared/example.ts`                   | `<hp-example>`, the titled canvas every story uses.                      |
| `projects/components-examples/src/index.ts`                            | `COMPONENT_EXAMPLES`, the registry the storybook builds its routes from. |

## Add stories for a component

1. Create `projects/components-examples/src/<component>/<component>-examples.ts`, a standalone OnPush component named `<Component>Examples` with selector `hp-<component>-examples`.
2. Render one `<hp-example heading="…">` per variant, size and state in the component's CRD (`docs/specs/components/<component>.md`). Use cast and copy from `docs/mocks/README.md`.
3. Add an entry to `COMPONENT_EXAMPLES`. Its `id` is the component's folder name and becomes the route, for example `/button`.
