# Changelog

All notable changes to this project are documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/).

## Unreleased

### Added
- Documentation structure aligned with chill-s3/Float conventions (`docs/requirements`, `docs/planning`, `docs/reviews`, `docs/engineering`, `docs/postmortem`, `docs/development-log`, `docs/archive`)
- `CONTRIBUTING.md` for human contributors
- `docs/writing-style.md`: tone, wording, UI copy, terminology, factuality, and pre-commit checks
- `docs/README.md` rewritten as the single entry point with task-based navigation and document lifecycle
- `docs/postmortem/README.md`: severity levels, status definitions, and a template-specific baseline checklist
- `.github/PULL_REQUEST_TEMPLATE.md`: quality gates, verification honesty, documentation sync
- Testing infrastructure: `vitest.config.ts` (with coverage gate), `test` / `test:coverage` scripts, first unit tests for `app/lib/seo.ts`
- Storybook tooling: `storybook` / `build-storybook` scripts; installed `@storybook/react-vite` + addons (a11y, docs, vitest, chromatic); removed dead stories referencing the deleted `image-previewer` component
- CI pipeline: `.github/workflows/ci.yml` (typecheck → lint → build → test → coverage)
- Lefthook pre-push test hook; `/coverage/` gitignored
- Dependency: `@vitest/coverage-v8`

### Changed
- `AGENTS.md` adds mandatory rules (docs-first, verification-first, commit discipline, docs are facts) and fixes stale documentation paths
- `CONTRIBUTING.md` links to `AGENTS.md`, adds coverage gate, verification honesty, and documentation conventions
- `docs/engineering/code-style.md` / `git-workflow.md` / `release-checklist.md` add verification-honesty rules and documentation consistency checks
- `docs/planning/architecture.md` records ADR-004 (single docs entry) and ADR-005 (verification must be able to fail)
