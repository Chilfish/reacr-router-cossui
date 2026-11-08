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
- `docs/ui-design/information-density.md`: one screen answers one question, four redundancy signals (repeated facts, caption footnotes, self-justifying navigation, field-driven blocks), a post-generation deletion checklist, and acceptance methods

### Changed
- `AGENTS.md` rewritten to 79 lines: keeps a one-line stack note, six entry points, mandatory rules (docs-first, verification-first, commit discipline, docs are facts), non-negotiable technical constraints, workflow, and maintenance rules; the directory tree and full anti-pattern table are dropped as duplicates of existing docs
- `CONTRIBUTING.md` links to `AGENTS.md`, adds coverage gate, verification honesty, and documentation conventions
- `docs/engineering/code-style.md` / `git-workflow.md` / `release-checklist.md` add verification-honesty rules and documentation consistency checks
- `docs/planning/architecture.md` records ADR-004 (single docs entry) and ADR-005 (verification must be able to fail), hosts the intent-to-file mapping moved out of `AGENTS.md`, and adds ADR-006 (root instruction file stays under 80 lines)
- `docs/ui-design/patterns.md` and `GENERAL.md`: record tables switch from `Table` to a stacked list below `md`; titles wrap instead of truncating; density checklist item added
- `docs/ui-design/research.md`: mechanism notes on why generated UIs over-fill pages and why footnotes proliferate; deletion test added to the review order
- `docs/ui-design/visual.md`, `README.md`, `docs/README.md`, `PULL_REQUEST_TEMPLATE.md`: link to `information-density.md` instead of restating the same redundancy list
