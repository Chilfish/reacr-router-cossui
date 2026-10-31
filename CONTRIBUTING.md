# Contributing

Welcome to react-router-cossui. This document covers development setup, code conventions, commit workflow, and quality gates.

> AI 编码助手请阅读根级 [AGENTS.md](./AGENTS.md)（导航 + 强制规范）。

## Prerequisites

- **[Bun](https://bun.sh/)**（推荐）或 Node.js 22+
- TypeScript 6.0+

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server (port 9080)
bun dev

# Build production
bun run build

# Typecheck
bun run typecheck

# Lint
bun run lint

# Test
bun run test
```

## Project Structure

```
app/
  components/ui/      # coss-ui component library (Base UI + cva)
  components/shared/  # scaffold global components (ThemeProvider, ProgressBar, ...)
  hooks/              # generic hooks
  lib/                # pure logic (cn, env.server, seo)
  routes/             # pages (declared in app/routes.ts)
  stores/             # Zustand stores
  app.css             # design tokens + Tailwind v4 entry
server/app.ts         # SSR entry
docs/                 # project documentation (see docs/README.md)
```

## Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `style`
**Scopes**: `ui`, `seo`, `theme`, `routes`, `docs`, `build`, `test`, ...

**Examples**:

```
feat(ui): add settings layout
fix(theme): persist system preference
docs: adopt documentation structure
```

Rules:

- Imperative English description, lowercase, ≤72 chars, no trailing period
- One commit per logical change (>10 files / >200 lines → split)

## Code Style

See [docs/engineering/code-style.md](./docs/engineering/code-style.md) for the full spec.

### TypeScript

- `strict: true`; no `any` (use `unknown` + narrowing)
- Explicit types on all params/returns
- Path alias `~/*` → `app/*`

### UI / CSS

- **CSS variables only**: `bg-background`, `text-muted-foreground`, `border-input`
- **No hardcoded colors**: no `#fff`, `rgb()`
- **Dark mode first-class**: every component must work in both themes (`.dark` class)
- Mobile-first; use `sm:`/`md:`/`lg:` to enhance
- Reuse `~/components/ui/` (coss-ui) before hand-writing markup
- Transitions 150-350ms

### Navigation (React Router)

| ✅ Use            | ❌ Avoid                     |
| ----------------- | ---------------------------- |
| `<Link to={...}>` | `<a href={...}>`             |
| `useSubmit()`     | `form.submit()`              |
| `navigate(url)`   | `window.location.href = url` |

Exception: native download of external resources may use `<a href>`.

### Data-fetching three states

Every data-fetching path must cover: `loading → Skeleton/Spinner`, `empty → Empty + description`, `error → message + retry`.

## Quality Gates

Every commit / PR must pass before merge (enforced by lefthook + CI):

```bash
bun run typecheck
bun run lint
bun run build
bun run test
bun run test:coverage
```

- Never use `--no-verify` to skip hooks; fix the root cause
- Coverage gate: `app/lib/**` ≥ 55% lines (see `vitest.config.ts`)
- Do not accept an existing red baseline; fix or remove the failing check
- Tests must be able to fail: break the behavior on purpose and confirm the test turns red
- Do not treat source scans (`toContain('literal')`) as behavior assertions
- No `skip` / `only` / empty runs presented as passing

## Testing

- Pure functions in `app/lib/` are independently testable (zero mock cost)
- Test files colocated with source: `*.spec.ts`
- Naming: `methodName_condition_expectedResult()`
- Structure: Given-When-Then
- See [docs/engineering/code-style.md §Testing](./docs/engineering/code-style.md)

## Documentation

The single entry point is [docs/README.md](./docs/README.md). Read it before a task and update it whenever a document is added, moved, or removed.

- Writing rules: [docs/writing-style.md](./docs/writing-style.md) (tone, wording, UI copy, examples)
- New feature/requirement change → update `docs/requirements/` and `docs/planning/backlog.md` before implementation
- Architecture changes → ADR in [docs/planning/architecture.md](./docs/planning/architecture.md)
- New bug patterns → postmortem using [docs/postmortem/TEMPLATE.md](./docs/postmortem/TEMPLATE.md)
- Code review → `docs/reviews/review-YYYY-MM-DD-<topic>.md`; log findings in the backlog
- Development log → `docs/development-log/YYYY-MM-DD.md`
- All PRs update `CHANGELOG.md` (Unreleased section)

Documentation rules:

- Docs are facts: paths, commands, routes, and field names must match the current code
- Do not present plans as current state; unfinished work belongs in the backlog or `todo-*.md`
- No dead links. Check relative links when removing or renaming files
- Empty states and error messages follow the same writing rules as docs
