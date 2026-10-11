# ADR 0001: A component storybook built as an Angular application

- Status: Accepted
- Date: 2026-10-10

## Context

The shared components library (`frontend/projects/components`) has 40 components and no application that renders them. Developers and reviewers need to see each component in every variant and state, in light and dark, while they build or change it. The design system pages in `docs/design-system/` are static HTML references, not the Angular components.

Tessera, a sibling repository, solves the same problem without the Storybook package: example components live in `src/components-examples/`, and a small Angular application renders them.

## Decision

Follow Tessera's approach, with one application instead of Tessera's `dev-app` and `e2e-app`:

- `frontend/projects/components-examples/src/<component>/<component>-examples.ts` holds one examples page per component. Each story is an `<hp-example>` canvas. `COMPONENT_EXAMPLES` in `src/index.ts` registers every page.
- `frontend/projects/storybook` is the only application. It builds a route per registry entry, lazy-loads each page, and adds a searchable component list and a theme switch. It compiles the library from source through a `paths` override, so changes reload without rebuilding `dist/components`.
- HairPop has no general-purpose playground app. The storybook renders only the examples.

We did not adopt the Storybook package (`@storybook/angular`). It adds a large dependency tree and its own builder and configuration, and stories written as plain Angular components do the same job.

## Consequences

- Every component in the library has an examples page, and changes to a component keep its page current (AGENTS.md, Frontend conventions).
- The storybook is a development tool. It is not deployed and is not production behavior, so it needs no requirement, mock or acceptance test of its own.
- Examples are ordinary Angular code, so the compiler, lint and Prettier check them.
