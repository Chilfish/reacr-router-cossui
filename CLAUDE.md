# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> AI Agent 协作指南。人类贡献者请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
> 完整文档索引见 [docs/README.md](./docs/README.md)。

## 意图 → 文件映射

| 任务意图            | 关键文件                                                          | 操作类型                                                      |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| 新增/修改页面路由   | `app/routes.ts` → `app/routes/<name>.tsx`                         | 配置 + 页面（跑 typegen 刷新类型）                            |
| 新增 coss 组件      | `~/components/ui/`（coss skill）                                  | `npx shadcn@latest add @coss/<component>` 或手写 Base UI 组件 |
| 添加脚手架共享组件  | `app/components/shared/`                                          | 遵循 `cn()` + Token 约定                                      |
| 修改主题配置        | `app/stores/appConfig.ts` + `components/shared/ThemeProvider.tsx` | 单一数据流                                                    |
| 修改样式/设计 Token | `app/app.css`                                                     | CSS 变量（`--background` 等）                                 |
| 写 SEO / meta       | `app/lib/seo.ts` + 各路由 `meta` 导出                             | `generateSEOMeta()`                                           |
| 服务端环境变量      | `app/lib/env.server.ts`（zod 校验，仅服务端）                     | 加 `serverEnvSchema` 字段                                     |
| 写纯逻辑工具        | `app/lib/`                                                        | 函数 + 同目录 `*.spec.ts`                                     |

## 文档索引

| 文档        | 路径                                     | 何时阅读                            |
| ----------- | ---------------------------------------- | ----------------------------------- |
| 需求规格    | `docs/requirements/requirements-spec.md` | 新增功能、判断功能边界              |
| 系统架构    | `docs/planning/architecture.md`          | 任何架构级变更前（ADR）             |
| 任务清单    | `docs/planning/backlog.md`               | 未决任务 + 排期                     |
| 审查记录    | `docs/reviews/`                          | 了解已知问题清单                    |
| Git 流程    | `docs/engineering/git-workflow.md`       | 每次 commit / PR                    |
| 代码规范    | `docs/engineering/code-style.md`         | 写代码前                            |
| 发布清单    | `docs/engineering/release-checklist.md`  | 里程碑发布前                        |
| 事后分析    | `docs/postmortem/README.md`              | 写代码前自查「高频雷区」，防复现    |
| 开发日志    | `docs/development-log/README.md`         | 了解历史决策                        |
| UI 设计规范 | `docs/ui-design/OVERVIEW.md`             | 涉及 UI 时（Token、排版、组件索引） |
| 组件规范    | `docs/ui-design/components/GENERAL.md`   | 使用 coss-ui 原子组件时             |

## 核心约定（写 UI / 写代码前必读）

### 🎨 设计系统铁律（源自 `docs/ui-design/OVERVIEW.md`）

```
✅ bg-background, text-muted-foreground, border-input
❌ #ffffff, rgb(0,0,0), bg-[#xxx]          （禁止硬编码颜色）
✅ 浅色/深色同时兼容（.dark 类，变量自动切换）
❌ 用 dark: 前缀覆盖颜色
```

- **组件优先**：优先复用 `~/components/ui/` 现有组件，不手写 div 模拟
- **移动端优先**：先写移动端，再用 `sm:`/`md:`/`lg:` 增强；交互过渡 150–350ms
- **类名合并**：用 `cn()`（`~/lib/utils`）

### 🚨 三态覆盖

所有数据获取路径必须覆盖：

```
loading → Skeleton/Spinner
empty   → Empty + 描述
error   → 消息 + 重试
```

### 导航（React Router v8）

```
✅ <Link to={url}>           ❌ <a href={url}>
✅ useSubmit()               ❌ form.submit()
✅ navigate(url)             ❌ window.location.href = url
```

> 唯一例外：外部资源下载（如 `/api/.../download` 需浏览器原生触发）用 `<a href>`。

### 无障碍

- 交互元素必须有可见 focus 环（`focus-visible:ring-2`）
- 图标按钮有可访问名称（`aria-label` 或显式文本）

## 架构速览

```
app/
  components/
    ui/         ← coss-ui 组件库（Base UI + cva + cn()）
    shared/     ← 脚手架全局组件（ThemeProvider、ProgressBar、Spinner 等）
  hooks/        ← useHydrated、useMediaQuery、useNonce、useIsPending
  lib/          ← 纯逻辑层（cn、env.server、seo）+ 同目录 *.spec.ts
  routes/       ← 页面（在 app/routes.ts 集中声明）
  stores/       ← zustand store（appConfig 主题，persist 到 localStorage）
  app.css       ← 设计 Token + Tailwind v4 入口
  root.tsx      ← Layout / ErrorBoundary / HydrateFallback
server/app.ts   ← SSR 入口
```

### 关键点

- **路径别名**：`~/*` → `app/*`（tsconfig + vite + vitest 三处同步）
- **路由类型**：`app/routes.ts` 改动后跑 `bun run typecheck`（内部 `react-router typegen`）刷新 `.react-router/types`；路由文件用 `import type { Route } from './+types/<name>'`
- **coss 组件**：`~/.claude/skills/coss` 符号链接到 `.agents/skills/coss`。编写/调试 coss 组件前**先调用 coss skill**，按其 references 走（component-registry / primitives / rules）。实现模式 = Base UI `useRender` + `mergeProps` + cva 变体
- **状态管理**：客户端局部状态用 `useState`；跨页共享才用 Zustand
- **SSR 敏感**：`window`/`document` 只在 effect / 客户端钩子中读取

## 开发工作流

1. **理解现状**：按上方「意图 → 文件映射」读对应文档 → 读相关源码
2. **参考事后分析**：读 `docs/postmortem/README.md`「高频雷区」防止复现已知问题
3. **修改代码**：遵循「核心约定」与 `docs/engineering/code-style.md`
4. **验证**（每次 commit 前，lefthook 强制）：
   ```bash
   bun run typecheck    # 类型检查（含 typegen）
   bun run lint         # ESLint（--fix）
   bun run test         # Vitest
   bun run build        # 生产构建
   ```
5. **Commit**：遵循 Conventional Commits（`<type>(<scope>): <description>`，英文祈使句）。先定 message 再写代码，超 200 行主动拆分
6. **复盘**：新 Bug 模式写 postmortem；发现的问题登记进 `docs/planning/backlog.md`「审查承接区」

## 常见反模式（禁止）

| 反模式                                   | 正确做法                                         | 来源             |
| ---------------------------------------- | ------------------------------------------------ | ---------------- |
| `<a href="/...">` 内部导航               | `<Link to="/...">`                               | 导航约定         |
| `form.submit()` / `window.location.href` | `useSubmit()` / `navigate()`                     | 导航约定         |
| 硬编码颜色（`#fff`）                     | CSS 变量（`bg-background`）                      | 设计规范         |
| 无 loading/error 状态                    | 三态覆盖                                         | 三态约定         |
| 手写弹层/下拉模拟                        | 复用 `~/components/ui/`（Dialog/Menu/Select 等） | 组件优先         |
| `any`                                    | `unknown` + 收窄                                 | code-style       |
| 无测试的纯逻辑函数                       | 同目录 `*.spec.ts`                               | code-style §测试 |
| 新库 API 不验证直接用                    | 先写 5 行 spike 实测                             | 工程纪律         |
