# 交互：键盘、导航、状态与 SSR

> 本页定义本脚手架的交互约定。组件行为交给 coss / Base UI 原语；这里只写页面层需要统一的部分。

## 1. 键盘

- `Tab` 顺序与视觉顺序一致；不从 `display: none` 的元素进入焦点。
- `Enter` / `Space` 激活当前按钮或链接；菜单、选择器、Tabs、Dialog 的方向键与 `Esc` 由 Base UI 原语处理，不重复实现。
- `Esc` 关闭最上层浮层，焦点回到触发元素。
- 图标按钮必须有可访问名称；快捷键提示使用 `Kbd` + `Tooltip`。
- 全局快捷键只在确有高频操作时添加，并在帮助或设置里列出。
- 自定义快捷键不得覆盖浏览器与输入法的常用组合；输入框聚焦时忽略单字母快捷键。
- 列表需要键盘移动时，优先使用原语的 roving tabindex 或 `aria-activedescendant`，不要手写焦点循环。

## 2. 导航

```tsx
// 内部跳转
<Link to="/settings">设置</Link>

// 提交
const submit = useSubmit()
submit(data, { method: 'post' })

// 编程式跳转
const navigate = useNavigate()
navigate('/settings')
```

- 内部导航使用 `<Link>`、`useSubmit()`、`navigate()`；不使用 `<a href="/...">`、`form.submit()`、`window.location.href`。
- 外部资源下载需要浏览器原生触发时才使用 `<a href>`。
- 路由切换的全局进度由 `root.tsx` 的 `ProgressBar` 提供；按钮级提交状态使用 `useIsPending()`。
- 路由级错误由路由模块导出的 `ErrorBoundary` 处理；不要在每个组件里重复捕获同一错误。
- 滚动位置由 `root.tsx` 的 `ScrollRestoration` 恢复；页面内独立滚动区自行保存位置。

## 3. URL 与状态

| 状态                     | 位置                             | 示例                        |
| ------------------------ | -------------------------------- | --------------------------- |
| 筛选、搜索、排序、分页   | URL search params                | `?q=design&sort=new&page=2` |
| 当前记录、选中项         | URL path 或 search param         | `/items/42`、`?id=42`       |
| 主题                     | `appConfig` store + localStorage | `light` / `dark` / `system` |
| 侧栏开合、视图模式、密度 | store 或组件状态                 | 刷新后保留                  |
| 表单草稿                 | 组件状态；需要跨刷新时再持久化   | 不默认写入 URL              |

- 会改变结果集的筛选写入 URL，后退能回到上一次查询。
- 纯展示偏好不写 URL，避免链接分享时带入他人的视图习惯。
- 切换筛选时清空与旧结果绑定的选择。
- 读写 search params 使用 `useSearchParams`；更新时保留无关参数。
- 持久化 store 改动 schema 时升 `version` 并写迁移；首屏渲染前用 `useHydrated()` 判断客户端是否就绪。

## 4. 浮层与焦点

- 同一任务只开一层浮层；需要二段确认时用 `AlertDialog`。
- 浮层关闭后焦点回到触发元素；Base UI 已处理，不要手动抢焦点。
- 嵌套浮层保持一层视觉层级；不在 Dialog 里再开 Dialog。
- 浮层打开时背景保留可辨认的上下文；不要用不透明遮罩完全盖住页面。
- 破坏性操作需要确认；普通保存不需要二次确认。
- 长任务使用 Sheet 或独立区域展示进度；关闭后是否继续由业务状态决定。

## 5. SSR 与 hydration

- 渲染期间不读取 `window`、`document`、`localStorage`、`matchMedia`；放到 `useEffect` 或客户端钩子。
- 需要判断是否已 hydration 时使用 `useHydrated()`。
- 主题由 `ThemeProvider` 在客户端应用 `.dark` 类；`<html>` 上的 `suppressHydrationWarning` 只用于这一处。
- 服务端专用逻辑放 `app/lib/*.server.ts`，由 `loader` / `action` 调用，不被客户端模块 import。
- 首屏不渲染 `Date.now()`、随机数、浏览器时区相关文本；需要时改为客户端渲染或固定时区。
- 图标、字体等资源在 `root.tsx` 的 `links` 中声明；页面级资源放路由的 `links` 导出。

## 6. 响应式与触摸

- 移动端优先：先写基础布局，再用 `sm:` / `md:` / `lg:` 增强。
- 断点以 Tailwind 为准；从 `~/hooks/use-media-query` 导入时，`useMediaQuery('max-md')` 与 `useIsMobile()` 都按 `<800px` 计算。
- 交互元素在触屏上提供 `active` 反馈；hover 只作为指针设备的增强，不承载唯一信息。
- 触控目标不小于 44×44px；按钮组件已通过 `pointer-coarse` 样式保证。
- 使用 `dvh` 处理移动端浏览器地址栏变化；不要用固定 `100vh` 撑满全屏。
- 固定底栏与安全区留白使用 `env(safe-area-inset-bottom)`。
- 横向溢出用 `overflow-x-hidden` 兜底，但先修布局，不用 `overflow` 掩盖问题。

## 7. 动效与偏好

- 过渡 150–350ms；进入淡入 + 轻微位移，退出反向。
- `prefers-reduced-motion: reduce` 时保留淡入，去掉位移、缩放与循环装饰动画。
- 加载中的骨架与 Spinner 不受减少动态影响，但避免闪烁。
- 浮层动画不做弹跳；弹性只用于抽屉与分段指示器。

## 8. 状态恢复

- 主题：`appConfig` store 持久化，`ThemeProvider` 应用。
- 路由滚动：`ScrollRestoration` 按 pathname 恢复。
- 筛选与分页：URL。
- 侧栏、视图模式：store 或组件状态。
- 不把同一状态同时写进 URL、store 和组件状态；选一个来源，其余派生。
