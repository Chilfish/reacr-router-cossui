# ThemeProvider

> `~/components/shared/ThemeProvider`

## 概述

全局主题提供者，管理应用的浅色（light）/ 深色（dark）/ 跟随系统（system）三种主题模式。

## 依赖

- `~/stores/appConfig` — Zustand + localStorage 持久化的主题状态
- 通过 `<html>` 元素的 `.dark` / `.light` 类切换主题

## 工作原理

1. 从 `useAppConfigStore` 读取当前 `theme` 设置
2. 将对应的类名（`light` / `dark`）添加到 `document.documentElement`
3. 当 `theme === 'system'` 时，监听 `prefers-color-scheme: dark` 媒体查询变化，自动切换

## 使用

已在 `root.tsx` 中全局挂载：

```tsx
// app/root.tsx
export default function App() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}
```

## 切换主题

通过 Zustand store 切换：

```tsx
import { useAppConfigStore } from '~/stores/appConfig'

function ThemeSwitcher() {
  const { theme, setTheme } = useAppConfigStore()
  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="light">浅色</option>
      <option value="dark">深色</option>
      <option value="system">跟随系统</option>
    </select>
  )
}
```

## CSS 变量

主题颜色定义在 `app/app.css` 的 `:root` 和 `.dark` 块中。所有 UI 组件通过 `bg-background`、`text-foreground` 等 Tailwind Token 自动适配。
