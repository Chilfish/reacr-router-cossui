# Changelog

All notable changes to this project are documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/).

## Unreleased

### Added
- `docs/engineering/performance.md`: first-screen budget, the three sources of SSR HTML weight, long-list and font trade-offs, image/LCP rules, cache headers
- `docs/engineering/security.md`: server/client data boundary, JSON-LD injection surface, response headers, CSP, URL input handling, post-deploy verification
- `docs/engineering/seo.md`: single meta entry point, title length limit, share cards, structured data entities, site files
- `app/lib/seo.ts`: `truncateTitle()` and `TITLE_MAX_LENGTH`; `generateTitle()` now keeps titles within 60 characters
- `app/lib/seo.spec.ts`: coverage for title truncation (boundary break, hard truncation, long titles)
- `docs/planning/architecture.md`: ADR-007 (engineering docs organized by quality dimension, not by document source)
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
- `AGENTS.md` rewritten to 57 lines: keeps the stack note, verification commands, six entry points, mandatory rules, non-negotiable technical constraints, and maintenance rules; the intent-to-file table, directory tree, and full anti-pattern table are dropped as duplicates of existing docs (ADR-006)
- `app/app.css`: font stacks move to `--font-sans-stack` / `--font-mono-stack` using the actual family names (`Inter Variable`, `Geist Mono Variable`); CJK falls back to system fonts; `html` no longer applies `font-sans font-mono` together; `body` gets `position: relative` for iOS Safari overlay viewports
- `app/root.tsx`: drops the Google Fonts `preconnect` / stylesheet links (fonts are self-hosted); wraps the app in an `isolate` stacking context so portaled overlays render above page content
- `README.md`, `docs/README.md`, `docs/engineering/README.md`: index the three new engineering docs and record the `siteConfig` / `robots.txt` / `manifest` step in the fork checklist
- `docs/ui-design/GENERAL.md`, `feedback.md`, `patterns.md`, `research.md`, `visual.md`: `dropdown-menu.tsx` references point at `menu.tsx` (coss names the primitive `Menu`); stale `media.tsx` and duplicate `use-mobile.ts` notes removed
- `AGENTS.md` no longer contains emoji section markers; status and examples are written as text
- `CONTRIBUTING.md` links to `AGENTS.md`, adds coverage gate, verification honesty, and documentation conventions
- `docs/engineering/code-style.md` / `git-workflow.md` / `release-checklist.md` add verification-honesty rules and documentation consistency checks
- `docs/planning/architecture.md` records ADR-004 (single docs entry) and ADR-005 (verification must be able to fail), hosts the intent-to-file mapping moved out of `AGENTS.md`, and adds ADR-006 (root instruction file stays under 80 lines)
- `docs/ui-design/patterns.md` and `GENERAL.md`: record tables switch from `Table` to a stacked list below `md`; titles wrap instead of truncating; density checklist item added
- `docs/ui-design/research.md`: mechanism notes on why generated UIs over-fill pages and why footnotes proliferate; deletion test added to the review order
- `docs/ui-design/visual.md`, `README.md`, `docs/README.md`, `PULL_REQUEST_TEMPLATE.md`: link to `information-density.md` instead of restating the same redundancy list
