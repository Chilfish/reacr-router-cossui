# ProgressBar

> `~/components/shared/progress-bar`

## 概述

路由切换时的顶部进度条，类似 NProgress。已在 `root.tsx` 的 `<Layout>` 中全局挂载，无需手动使用。

## 特性

- **延迟显示**：600ms 后才出现（`spin-delay`），避免快速切换时闪烁
- **最小持续时间**：至少显示 400ms，避免"闪烁"感
- **智能宽度**：
  - `submitting` 状态：宽度 5/12（约 42%）
  - `loading` 状态：宽度 8/12（约 67%）
  - 完成后：动画过渡到 100% 并淡出
- **z-index**：`99999`，确保始终在最顶层

## 使用

已在 `root.tsx` 中挂载：

```tsx
// app/root.tsx — Layout
<body>
  <ProgressBar />
  {/* ... */}
</body>
```

## Props

| Prop          | 类型      | 默认值  | 说明                                     |
| ------------- | --------- | ------- | ---------------------------------------- |
| `showSpinner` | `boolean` | `false` | 是否在右上角同步显示一个小的加载 spinner |

## 依赖

- `useNavigation` from `react-router`
- `useSpinDelay` from `spin-delay`
- `Spinner` from `~/components/shared/spinner`
- `cn` from `~/lib/utils`
