<p align="center">
  <img src="assets/logo.png" alt="HairPop logo" width="300">
</p>

# HairPop

HairPop helps customers discover hairstyles, find professional braiders who offer them, and choose with confidence through service details, portfolios, and reviews.

The customer journey also covers appointment requests, updates, and care after a visit. The [requirements](docs/specs/L1.md) define the planned product; the [HTML mocks](docs/mocks/README.md) show its intended experience.

## Project status

HairPop is being redesigned. The requirements, detailed designs, and customer journey mocks are in the repository. The existing Angular workspace is an earlier prototype and does not yet implement the full redesigned journey. The Laravel backend described in [AGENTS.md](AGENTS.md) has not landed.

| Area | Location | Status |
| --- | --- | --- |
| Product requirements | [L1](docs/specs/L1.md) and [L2](docs/specs/L2.md) | Written for the customer journey |
| Feature designs | [`docs/detailed-designs/`](docs/detailed-designs/) | In progress |
| Screen and state mocks | [`docs/mocks/`](docs/mocks/README.md) | Available for review |
| Design tokens | [`docs/design-system/`](docs/design-system/) | In progress |
| Angular applications | [`src/WebApp/`](src/WebApp/README.md) | Earlier prototype |
| Laravel API and Playwright suite for the redesign | Planned | Not yet available |

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

## Architecture and repository layout

The intended platform uses an Angular frontend and a PHP 8.3 / Laravel 11 backend. Laravel owns persistence, authentication, and business workflows. Playwright covers the browser journey. The [feature designs](docs/detailed-designs/) describe the planned behavior in more detail.

```text
.
├── assets/                  Logo and shared assets
├── docs/
│   ├── specs/               Product and component requirements
│   ├── detailed-designs/    Feature designs
│   ├── mocks/               Static customer journey references
│   └── design-system/       Design tokens and foundations
├── src/WebApp/              Existing Angular prototype
└── AGENTS.md                Project conventions and workflow
```

## Contributing

Contributions to requirements, designs, mocks, documentation, and implementation are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Production behavior changes require a requirement, detailed design, mock, and acceptance tests before implementation; [AGENTS.md](AGENTS.md) has the full workflow.

## Community and support

- Follow the [code of conduct](CODE_OF_CONDUCT.md) in project spaces.
- Use [SUPPORT.md](SUPPORT.md) for questions and bug reports.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

No license has been published for this repository. Until one is added, the repository should not be treated as granting permission to reuse or redistribute its contents.
