# Changelog

All notable changes to this project are documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/).

## Unreleased

### Added
- Documentation structure aligned with chill-s3/Float conventions (`docs/requirements`, `docs/planning`, `docs/reviews`, `docs/engineering`, `docs/postmortem`, `docs/development-log`, `docs/archive`)
- `CONTRIBUTING.md` for human contributors
- Testing infrastructure: `vitest.config.ts` (with coverage gate), `test` / `test:coverage` scripts, first unit tests for `app/lib/seo.ts`
- Storybook tooling: `storybook` / `build-storybook` scripts; installed `@storybook/react-vite` + addons (a11y, docs, vitest, chromatic); removed dead stories referencing the deleted `image-previewer` component
- CI pipeline: `.github/workflows/ci.yml` (typecheck → lint → build → test → coverage)
- Lefthook pre-push test hook; `/coverage/` gitignored
- Dependency: `@vitest/coverage-v8`

### Changed
- `CLAUDE.md` rewritten as an AI navigation guide (intent → file mapping, doc index, core conventions, architecture overview)
