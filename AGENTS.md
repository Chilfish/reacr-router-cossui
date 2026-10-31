# AGENTS.md

本文件是 AI Agent 的协作指南。人类贡献者请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
完整文档索引见 [docs/README.md](./docs/README.md)，文档与界面文案规范见 [docs/writing-style.md](./docs/writing-style.md)。

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
| 文档索引    | `docs/README.md`                         | 任何任务开始前（唯一入口）          |
| 写作规范    | `docs/writing-style.md`                  | 写文档、文案、PR / issue 前         |
| 需求规格    | `docs/requirements/requirements-spec.md` | 新增功能、判断功能边界              |
| 用户故事    | `docs/requirements/user-stories.md`      | 理解用户需求、设计新特性            |
| 系统架构    | `docs/planning/architecture.md`          | 任何架构级变更前（ADR）             |
| 任务清单    | `docs/planning/backlog.md`               | 未决任务 + 排期                     |
| 审查记录    | `docs/reviews/`                          | 了解已知问题清单                    |
| Git 流程    | `docs/engineering/git-workflow.md`       | 每次 commit / PR                    |
| 代码规范    | `docs/engineering/code-style.md`         | 写代码前                            |
| 发布清单    | `docs/engineering/release-checklist.md`  | 里程碑发布前                        |
| 事后分析    | `docs/postmortem/README.md`              | 写代码前自查「高频雷区」，防复现    |
| 开发日志    | `docs/development-log/README.md`         | 了解历史决策                        |
| UI 设计规范 | `docs/ui-design/README.md`               | 涉及 UI 时（Token、排版、组件索引） |
| 组件规范    | `docs/ui-design/GENERAL.md`              | 使用 coss-ui 原子组件时             |

## 🔴 强制规范（必须遵循）

1. **文档先行**：每个任务第一步更新 `docs/planning/backlog.md` 或对应方案文档；实现过程中同步记录 `docs/development-log/YYYY-MM-DD.md`，不要事后补记。
2. **验证先行**：功能先写可验证的验收标准（FR 或 AC），再实现；新增纯逻辑必须有同目录 `*.spec.ts`。
3. **验证必须携带信号**：测试要能失败。故意改坏被测行为仍全绿，说明测试无效；不把源码扫描冒充行为断言，不提交空跑、全 `skip`、条件断言或 `only`。
4. **写码前读事后分析**：对照 `docs/postmortem/README.md` 的「模板基线雷区」与「高频雷区」自查；新 Bug 模式回写 postmortem。
5. **Commit 纪律**：先定 Conventional Commit message 再写代码；超过 10 个文件或 200 行主动拆分。
6. **文档即事实**：路径、命令、路由、字段名与代码一致；改代码时同步更新文档和 `docs/README.md` 索引，不留死链。
7. **文案遵循规范**：文档与界面文案按 `docs/writing-style.md` 执行。

## 核心约定（写 UI / 写代码前必读）

### 🎨 设计系统铁律（源自 `docs/ui-design/README.md`）

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

### ✍️ 文案与文档

- 界面文案、README、`docs/` 统一按 `docs/writing-style.md`
- 空状态说清：这里是什么、为什么空、下一步怎么做
- 错误提示给可执行动作（重试、检查配置、看日志）
- 数字带单位；不堆形容词和黑话；不把计划写成现状

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

1. **理解现状**：按 `docs/README.md` 的「按任务导航」读对应文档 → 读相关源码
2. **先更新文档**：在 `docs/planning/backlog.md` 登记任务；复杂功能先写需求与验收标准；实现过程中同步记录开发日志
3. **参考事后分析**：读 `docs/postmortem/README.md` 的「模板基线雷区」与「高频雷区」，防止复现已知问题
4. **修改代码**：遵循「核心约定」与 `docs/engineering/code-style.md`
5. **验证**（每次 commit 前，lefthook / CI 强制）：
   ```bash
   bun run typecheck    # 类型检查（含 typegen）
   bun run lint         # ESLint（--fix）
   bun run test         # Vitest
   bun run test:coverage # 覆盖率门禁（app/lib ≥ 55%）
   bun run build        # 生产构建
   ```
6. **Commit**：遵循 Conventional Commits（`<type>(<scope>): <description>`，英文祈使句）。先定 message 再写代码，超 200 行主动拆分
7. **复盘**：新 Bug 模式写 postmortem；审查问题登记进 `docs/planning/backlog.md`「审查承接区」

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
| 测试无断言 / 全 `skip` / 空跑报绿        | 每条 `it` 至少一条断言，故意改坏要变红           | 验证诚实         |
| 源码扫描冒充行为断言                     | 关键路径用行为测试，扫描只作辅助检查             | 验证诚实         |
| 文档路径、命令与代码不一致               | 文档即事实，改代码同步改文档                     | docs/README      |
| 把计划写成现状                           | 未完成放 backlog / `todo-*`                      | 写作规范         |
| 空态只写「暂无数据」                     | 说清是什么、为什么空、下一步                     | 写作规范         |
| 文档堆形容词、黑话、口号式对偶           | 写事实与做法                                     | 写作规范         |
