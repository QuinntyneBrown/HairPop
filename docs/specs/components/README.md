# Component requirements documents

One CRD per reusable component in the shared components library. Each is a pair of files: `<component>.md` holds the requirements and Given/When/Then acceptance criteria, and `<component>.html` renders every variant, size and state in light and dark. Each criterion traces to an L2 requirement in [`../L2.md`](../L2.md). Write and check them with the `writing-component-requirements-documents` skill.

| Component | Selector | Status | L2 trace | Requirements | Rendering | Design system |
|---|---|---|---|---|---|---|
| Button | `button[hp-button]`, `a[hp-button]` | planned | L2-005, L2-007, L2-011, L2-022, L2-036, L2-041, L2-042 | [button.md](button.md) | [button.html](button.html) | [button](../../design-system/components/button.html) |
