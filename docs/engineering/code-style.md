# 代码规范

**项目**: react-router-cossui | **最后更新**: 2026-08-09

## TypeScript / React 风格

### 命名约定

| 类型        | 风格                               | 示例                                      |
| ----------- | ---------------------------------- | ----------------------------------------- |
| 组件 / 类   | PascalCase                         | `SettingsLayout`、`ThemeProvider`         |
| 组件文件    | kebab-case                         | `settings-layout.tsx`、`progress-bar.tsx` |
| hooks       | `use` + camelCase                  | `useHydrated`、`useMediaQuery`            |
| 函数 / 方法 | camelCase                          | `generateSEOMeta`、`cn`                   |
| 常量        | UPPER_SNAKE_CASE                   | `SITE_CONFIG`                             |
| 变量 / 参数 | camelCase                          | `isDark`、`selectedItems`                 |
| 类型 / 接口 | PascalCase                         | `ButtonProps`、`AppConfigs`               |
| 泛型参数    | 单个大写字母                       | `T`、`K`（约束：`T extends ...`）         |
| 包 / 目录   | 全小写 + 连字符                    | `app/components/ui/`、`app/lib/`          |
| 路由文件    | kebab-case（React Router v8 约定） | `not-found.tsx`、`api.auth.ts`            |

### 文件组织

```ts
// 1. import：外部依赖 → 路径别名（~/）→ 相对路径
import type * as React from 'react'
import { useNavigation } from 'react-router'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { Route } from './+types/home'

// 2. 类型 / 常量
// 3. 组件 / 函数定义
// 4. private helpers（放文件底部）
```

### React 约定

- 每个组件签名明确 Props 类型；props 全部显式标注
- **状态提升到最小合理层级**；跨页共享的状态才用 Zustand
- 客户端状态用 `useState`；`useEffect` 依赖数组完整；Strict Mode 下行为可预期
- 数据获取路径实现**三态**（loading skeleton / empty 组件 / error + 重试）
- 导航用 React Router API：客户端路由 → `<Link>` / `useSubmit()` / `navigate()`；外部资源下载可用 `<a href>`
- coss-ui 组件基于 Base UI 的 `useRender` + `mergeProps` + cva 变体；新增 UI 组件遵循 `~/components/ui/` 现有模式
- 事件回调命名 `onXxx`：`onSelect`、`onDelete`

### 禁止事项

| 禁止                                                | 替代方案                                                      |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `any`（含隐式）                                     | 明确类型 / `unknown` + 收窄                                   |
| 组件内 `window.location.href` / `location.reload()` | `useLocation()` / `useRevalidator()`                          |
| 硬编码颜色                                          | CSS 变量 Token（`bg-background`、`text-muted-foreground` 等） |
| `window` / `document` 在渲染期间读取                | 仅在 effect / 客户端钩子中读取                                |
| wildcard import                                     | 显式 import                                                   |
| `console.log` 遗留                                  | 移除或用 lint 拦截                                            |

## Tailwind / UI 约定

- 所有颜色使用 CSS 变量 Token，禁止硬编码 hex（见 [docs/ui-design/OVERVIEW.md](../ui-design/OVERVIEW.md)）
- Dark Mode 是一等公民，所有组件必须兼容
- 优先复用 `~/components/ui/` 下已有组件（coss-ui）
- 移动端优先，再用 `sm:` / `md:` / `lg:` 增强
- 交互过渡动画 150-350ms

## 测试规范

对标「测试先行 + 覆盖率门禁」：

### 命名

`methodName_condition_expectedResult()`

```ts
describe('generateSEOMeta', () => {
  it('withTitle_overridesPageTitle', () => { /* ... */ })
})
```

### 结构

Given-When-Then：

```ts
it('generateTitle_withPageTitle_appendsSiteName', () => {
  // Given
  const pageTitle = '首页'
  // When
  const result = generateTitle(pageTitle)
  // Then
  expect(result).toBe(`首页 — ${siteConfig.name}`)
})
```

### 规则

- **纯函数优先**：`app/lib/` 的纯函数（seo、utils、env 等）独立可测，零 mock 成本
- **Fakes over Mocks**：数据层测试用真实实现 / 轻量 fake，避免 mock 语义漂移
- 测试文件与源码同目录：`*.spec.ts`（配置见 `vitest.config.ts`）

### 门禁

```bash
bun run test          # Vitest
bun run test:coverage # 覆盖率报告（阈值见 vitest.config.ts）
```

覆盖率门禁范围 = 纯逻辑层（`app/lib/`）；UI 组件与路由不计入（文件级覆盖率统计文件而非函数，混入 UI 会失真）。

## Lint / 类型检查

```bash
bun run lint          # ESLint（@antfu/eslint-config，含 --fix）
bun run typecheck     # react-router typegen && tsc
```

- 禁止 `--no-verify` 跳过 lefthook 钩子
- 无 `TODO()` 遗留（用 `FIXME` + 建 Issue）
