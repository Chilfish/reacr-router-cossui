# React Router v8 + coss-ui 脚手架

基于 Vite + React 19 + React Router v8 + Tailwind CSS v4 + Base UI 的开箱即用脚手架。

## 技术栈

- **框架**: React 19 + React Router v8 (SSR)
- **样式**: Tailwind CSS v4 + CSS 变量主题系统
- **组件库**: coss-ui (基于 Base UI 的无障碍组件，shadcn 风格)
- **状态管理**: Zustand + localStorage 持久化
- **图标**: lucide-react
- **构建**: Vite 8

## 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器 (端口 9080)
bun dev

# 构建生产版本
bun run build
```

## 项目结构

```
app/
  components/
    ui/         ← coss-ui 组件库（58+ 组件）
    shared/     ← 脚手架自有组件（ThemeProvider、ProgressBar、Spinner 等）
  hooks/        ← 通用 hooks（useMediaQuery、useHydrated、useNonce 等）
  lib/          ← 工具函数（cn、env）
  routes/       ← 路由页面
  stores/       ← Zustand stores
  app.css       ← 全局样式 + 设计 Token
  root.tsx      ← 根布局
docs/
  ui-design/    ← UI 设计规范文档
  shared-components/ ← 共享组件文档
```

## 特性

- **原生感设计系统** — macOS/iOS 原生美学，完整的浅色/深色主题
- **无障碍优先** — 基于 Base UI，所有组件内置 WAI-ARIA 支持
- **移动端适配** — 移动端优先的响应式设计，手势操作支持
- **SSR 就绪** — React Router v8 SSR + Vercel 部署配置
- **TypeScript 严格模式** — 全量类型覆盖

## 文档

- [UI 设计规范](docs/ui-design/OVERVIEW.md) — 颜色系统、排版、间距、交互规范
- [通用组件规范](docs/ui-design/components/GENERAL.md) — Button、Input、Card 等原子组件
- [设置页面模式](docs/ui-design/components/SETTINGS.md) — 设置页面的强制布局规范
- [共享组件](docs/shared-components/README.md) — 脚手架自带组件的文档

## 使用说明

这是一个脚手架模板，**不是**一个完整的应用。clone 后按需：

1. 删除 `app/routes/home.tsx` 中的示例内容
2. 删除不需要的 `app/components/ui/` 组件（按需保留）
3. 在 `app/routes.ts` 中添加你的路由
4. 参考 `docs/` 中的规范编写组件
