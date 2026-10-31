# 系统架构

> 本文档记录 react-router-cossui 的系统架构总览与关键架构决策（ADR）。
> fork 本脚手架后，随着真实业务落地逐步补充。

## 技术栈

- **框架**：React 19 + React Router v8（框架模式，SSR）
- **样式**：Tailwind CSS v4 + CSS 变量主题系统（`app/app.css`）
- **组件库**：coss-ui（基于 Base UI 的无障碍组件，shadcn 风格，`app/components/ui/`）
- **状态管理**：Zustand + localStorage 持久化（`app/stores/`）
- **构建**：Vite 8；**部署**：Vercel（`react-router.config.ts` 的 `vercelPreset`）
- **包管理器**：Bun

## 目录结构

```
app/
  components/
    ui/         ← coss-ui 组件库（Base UI + cva + cn()）
    shared/     ← 脚手架自带全局组件（ThemeProvider、ProgressBar、Spinner 等）
  hooks/        ← 通用 hooks（useHydrated、useMediaQuery、useNonce 等）
  lib/          ← 纯逻辑层（cn、env.server、seo）
  routes/       ← 路由页面（在 app/routes.ts 集中声明）
  stores/       ← Zustand stores（appConfig 主题）
  app.css       ← 全局样式 + 设计 Token
  root.tsx      ← 根布局（Layout / ErrorBoundary / HydrateFallback）
server/app.ts   ← SSR 入口
```

## 数据流

（脚手架阶段为空。业务落地后在此描述「Loader/Action → 序列化 → UI」数据流，以及 `~/*` 路径别名约定。）

## 关键设计决策

### ADR-001：设计 Token 与暗色模式

- **决策**：所有颜色通过 `app/app.css` 的 CSS 变量定义（`--background` 等），经 Tailwind v4 `@theme inline` 映射为 `bg-background` / `text-muted-foreground` 等 Token；暗色模式通过 `<html>` 上的 `.dark` 类切换变量值。
- **理由**：Token 化避免硬编码色值，`.dark` 变量覆盖实现「暗色一等公民」而无需在每个组件写 `dark:` 前缀。
- **后果**：禁止硬编码 `bg-[#xxx]`；新增颜色需在 `app/app.css` 的 `:root` 与 `.dark` 两处定义。

### ADR-002：集中式路由配置

- **决策**：路由在 `app/routes.ts` 集中声明（`index` / `route` / `route('*', ...)`），而非文件系统路由。
- **理由**：脚手架模板面向 fork 后按需增删路由，集中配置比文件约定更显式、可枚举。
- **后果**：新增路由需同时改 `app/routes.ts` 并跑 `react-router typegen` 刷新 `+types/*`。

### ADR-003：路径别名 `~/*`

- **决策**：`tsconfig.json` `paths` + Vite `resolve.tsconfigPaths` 将 `~/*` 映射到 `app/*`。
- **理由**：统一导入路径（`~/components/ui/<name>`），避免深层相对路径。
- **后果**：新目录一律通过 `~` 别名引用；vitest 配置需镜像该别名（见 `vitest.config.ts`）。

### ADR-004：文档单一入口与生命周期

- **决策**：`docs/README.md` 作为唯一入口，按任务导航；文档按「需求 → 工程 → 反馈 → 存档」分层；`docs/writing-style.md` 统一文档与界面文案规范。
- **理由**：模板 fork 后文档容易分叉。单一入口让新增文档有位置、过期文档能归档，避免索引与目录不一致。
- **后果**：新增、移动、删除文档必须同步索引；正文只写已成立的事实，未完成项放 backlog / `todo-*`；文案评审引用 `writing-style.md`。

### ADR-005：验证必须可失败

- **决策**：测试与门禁以「故意改坏被测行为会变红」为验收标准；禁止空跑、全 `skip`、条件断言和源码扫描冒充行为断言。
- **理由**：全绿只说明没有断言失败，不说明功能被验证。假绿会让后续改动失去信号。
- **后果**：新功能先写验收标准再实现；审查清单检查测试可失败；覆盖率只统计纯逻辑层 `app/lib/**`。

---

## ADR 模板

新增决策时复制以下结构追加：

```markdown
### ADR-00N：{标题}

- **决策**：（做了什么选择）
- **理由**：（为什么，包含被否决的替代方案）
- **后果**：（正面与反面影响，需跟进的事项）
```
