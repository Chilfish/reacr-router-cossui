# 共享组件（Shared Components）

> 目录：`app/components/shared/`
>
> 这些是脚手架自带的、与具体业务无关的全局组件和工具。与 `ui/`（coss-ui 组件库）不同，shared/ 中的组件是项目级别的定制封装。

## 组件列表

| 组件          | 文件                 | 用途                                     |
| ------------- | -------------------- | ---------------------------------------- |
| ThemeProvider | `ThemeProvider.tsx`  | 浅色/深色/系统主题切换，响应系统偏好变化 |
| ProgressBar   | `progress-bar.tsx`   | 路由切换时的顶部进度条（NProgress 风格） |
| Spinner       | `spinner.tsx`        | 简单的 SVG 加载动画                      |
| ErrorDisplay  | `error-boundary.tsx` | 错误页面展示组件（404、异常等）          |
| Icons         | `icons.tsx`          | 项目常用的第三方 SVG 图标                |

## 工具

| 工具 | 文件 | 用途 |
|------|------|------|
| SEO    | `~/lib/seo.ts` | 生成标准 SEO meta 标签、OG、Twitter Card、JSON-LD |

更多 SEO 用法参考 **[seo.md](./seo.md)**。

## 使用方式

```tsx
// ThemeProvider — 已在 root.tsx 中全局挂载，无需手动使用
import { ThemeProvider } from '~/components/shared/ThemeProvider'

// ProgressBar — 已在 root.tsx Layout 中挂载，无需手动使用
import { ProgressBar } from '~/components/shared/progress-bar'

// Spinner — 可用在任何需要加载指示器的地方
import { Spinner } from '~/components/shared/spinner'

// ErrorDisplay — 用于错误页面/错误边界
import { ErrorDisplay } from '~/components/shared/error-boundary'

// Icons — 第三方品牌图标
import { GithubIcon, GoogleIcon, ReactRouterIcon } from '~/components/shared/icons'
```

## 设计原则

- **无业务耦合** — 所有组件与具体业务逻辑无关，可跨项目复用
- **最小依赖** — 仅依赖 `~/lib/utils`（cn 工具函数）
- **不重复造轮子** — 能用 coss-ui 的地方不用手写组件
