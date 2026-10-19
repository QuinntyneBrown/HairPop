# Contributing to HairPop

Thank you for helping improve HairPop. This guide covers how to propose a change and prepare it for review.

## Before you start

Read the [project status](README.md#project-status), [requirements](docs/specs/L1.md), and [project conventions](AGENTS.md). Search [existing issues](https://github.com/QuinntyneBrown/HairPop/issues) before opening a new one. For a substantial feature or behavior change, describe the customer need and proposed scope in an issue first.

Do not post a security vulnerability in a public issue. Follow [SECURITY.md](SECURITY.md). Participation in project spaces is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Ways to contribute

- Clarify requirements or acceptance criteria in `docs/specs/`.
- Improve the feature designs, HTML mocks, or design system.
- Report a reproducible bug or documentation error.
- Implement a small, reviewed slice of an existing requirement.

## Development workflow

1. Fork the repository and create a focused branch.
2. For production behavior changes, update the requirement, detailed design, and mock **before** writing production code.
3. Follow the `implementing-incrementally` skill in [`.agents/skills/`](.agents/skills/): write Given-When-Then criteria, add an acceptance test, confirm it fails for the expected reason, then implement one slice and run the relevant regression checks.
4. Keep the requirements, design, mock, tests, and implementation aligned. Open a pull request that explains the user-facing change, links the relevant requirement, and records the checks you ran.

Documentation-only, design-system-only, mock-only, and test-only changes do not require the production behavior workflow unless they accompany a production change. See [AGENTS.md](AGENTS.md) for the full rules.

## Coding and testing

The current Angular prototype lives in [`src/WebApp/`](src/WebApp/README.md). Its documented scripts are in `src/WebApp/package.json`. For code that implements the redesign, use the conventions in [AGENTS.md](AGENTS.md), including single-file Angular components, API integration tests for backend behavior, and Chromium Playwright tests with page objects for frontend behavior.

Run the checks relevant to your change and include their results in the pull request. Update visual baselines only when the design change is intentional. Do not add tests that only assert repository structure or naming.

## Pull requests

Keep each pull request focused. Describe what changed, why it changed, and how you verified it. Note any remaining limitation. A maintainer reviews and merges contributions.

## License

HairPop does not currently include a license. Contribution or publication in this repository does not establish a license for reuse. Discuss licensing with the maintainer before submitting material that needs explicit redistribution terms.
