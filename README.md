<p align="center">
  <img src="assets/logo.png" alt="HairPop logo" width="300">
</p>

# HairPop

HairPop connects customers with professional hair braiders. Customers can explore hairstyles, find braiders who offer them, and read reviews to choose a braider with confidence.

The customer journey also covers appointment requests, updates, and care after a visit. The [requirements](docs/specs/L1.md) define the planned product; the [HTML mocks](docs/mocks/README.md) show its intended experience.

## Project status

The [end-to-end completion audit](docs/audits/2026-10-13-end-to-end-completion-audit.md) scores what is complete and lays out the roadmap to finish the product.

HairPop is being redesigned. The requirements, detailed designs, and customer journey mocks are in the repository. The existing Angular workspace is an earlier prototype and does not yet implement the full redesigned journey. The Node.js / Next.js backend described in [AGENTS.md](AGENTS.md) has not landed.

| Area | Location | Status |
| --- | --- | --- |
| Product requirements | [L1](docs/specs/L1.md) and [L2](docs/specs/L2.md) | Customer platform and supporting braider capabilities |
| Feature designs | [`docs/detailed-designs/`](docs/detailed-designs/) | In progress |
| Screen and state mocks | [`docs/mocks/`](docs/mocks/README.md) | Available for review |
| Design tokens | [`docs/design-system/`](docs/design-system/) | In progress |
| Angular applications | [`src/WebApp/`](src/WebApp/README.md) | Earlier prototype |
| Next.js API and Playwright suite for the redesign | Planned | Not yet available |

## Explore the project

- Browse the [mock gallery](docs/mocks/index.html) to review customer screens, dialogs, and states. The mocks are static HTML and can be opened locally in a browser.
- Read the [high-level requirements](docs/specs/L1.md) and [detailed acceptance criteria](docs/specs/L2.md).
- Review [feature designs](docs/detailed-designs/) and [design tokens](docs/design-system/tokens/).

The mock names, prices, dates, availability, and legal text are illustrative. See the [mock guide](docs/mocks/README.md) for scope and open questions.

## Run the existing web prototype

You need [Node.js](https://nodejs.org/) and npm. From the repository root:

```sh
cd src/WebApp
npm ci
npm start
```

Open <http://localhost:4200/>. To run the admin prototype instead, use `npm run start:admin`. The Angular workspace has its own [setup and command guide](src/WebApp/README.md).

## Target architecture

The intended platform uses Angular web applications and a Node.js 22 / Next.js 15 API backed by PostgreSQL through Prisma. The API owns persistence, authentication, and business workflows. Playwright covers customer behavior and visual parity with the mocks in Chromium. Its API responses are mocked, so browser tests do not depend on the API, a database, or Docker. Backend behavior is covered by API integration tests. The [feature designs](docs/detailed-designs/) describe the planned behavior in more detail.

## Repository layout

```text
.
├── assets/                  Logo and shared assets
├── docs/
│   ├── specs/               Product and component requirements
│   ├── detailed-designs/    Feature designs
│   ├── mocks/               Static customer journey references
│   ├── design-system/       Tokens, foundations, components, and patterns
│   └── adr/                 Architecture decisions, added as needed
├── src/WebApp/              Existing Angular prototype
├── .agents/skills/          Repository workflows for agents
├── .claude/skills/          Repository workflows for Claude
└── AGENTS.md                Project conventions and workflow
```

## Implementation workflow

Every production behavior change starts with [L1 and L2 requirements](docs/specs/), a [detailed design](docs/detailed-designs/), and a [mock](docs/mocks/README.md). Reusable Angular components also need a component requirements document in `docs/specs/components/` before implementation. Keep those artifacts aligned when behavior changes.

Implementation proceeds in small acceptance test driven slices: write Given/When/Then criteria, add an acceptance test and confirm it fails for the expected reason, implement that slice, then run its regression checks. Backend acceptance tests exercise the API. Frontend acceptance tests use Playwright page objects and mocked API fixtures. Mocks and design-system artifacts are design work and do not require acceptance tests.

Angular components are single-file `.ts` components. Reusable components belong in the shared library, API services in the API library, and pages use dialogs or dedicated screens for editing. Components use the design system's role-based CSS tokens and preserve the mocks' accessible states and class structure. The full coding, test, and component performance rules are in [AGENTS.md](AGENTS.md).

## Contributing

Contributions to requirements, designs, mocks, documentation, and implementation are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change and [AGENTS.md](AGENTS.md) for the complete development workflow.

## Community and support

- Follow the [code of conduct](CODE_OF_CONDUCT.md) in project spaces.
- Use [SUPPORT.md](SUPPORT.md) for questions and bug reports.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

No license has been published for this repository. Until one is added, the repository should not be treated as granting permission to reuse or redistribute its contents.
