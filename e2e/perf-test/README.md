# Component perf test

Measures what each reusable component costs to render. The scenario app in
`frontend/projects/perf-test` renders one scenario many times in Chromium; this runner loads it
with the V8 CPU profiler running, records the render time and compares the branch with its base
branch. The rules are in `AGENTS.md`, "Component perf tests — mandatory".

## Run it locally

```bash
cd frontend
npx ng build components
NG_BUILD_MANGLE=0 npx ng build perf-test
cd ../e2e
npm run perf-test -- --baseline <base-branch dist> --fail-on-regression   # --scenarios Button,TopBar to narrow
```

To get a base-branch dist, build `perf-test` the same way in a worktree of the base branch
(`git worktree add ../base origin/<base-branch>`) and pass its `frontend/dist/perf-test/browser`.
Without `--baseline` the runner measures the branch only, which is how iterations are calibrated.

| Option                 | Default                              | Meaning                                                                         |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| `--dist <dir>`         | `../frontend/dist/perf-test/browser` | Branch build                                                                    |
| `--baseline <dir>`     | none                                 | Base-branch build to compare against                                            |
| `--scenarios A,B`      | all                                  | Only these scenarios                                                            |
| `--runs <n>`           | `5`                                  | Runs per scenario and build                                                     |
| `--fail-on-regression` | off                                  | Exit non-zero on a Possible regression or failed scenario                       |
| `--out <dir>`          | `perf-results`                       | Profiles (`<label>/<Scenario>-run<k>.cpuprofile`), `summary.md`, `results.json` |

A **Possible regression** is a branch median more than 10% and at least 1 ms slower than the base,
with no overlap between runs (the branch's fastest run is slower than the base's slowest). A
scenario that throws or does not render always fails the run. A scenario missing from the base is
reported as `new`.

Open a `.cpuprofile` in Chrome DevTools (Performance panel, "Load profile") to find the cost.

## Scenarios and iterations

Each scenario is `frontend/projects/perf-test/src/scenarios/<Name>.ts`, exported from
`src/scenarios/index.ts`. `config/scenario-iterations.mjs` sets how many instances each renders;
calibrate it so a render takes roughly 100–300 ms. Never delete, exclude or shrink a scenario,
lower its iterations or loosen a threshold to clear a flag.
