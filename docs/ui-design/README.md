# UI 设计系统

> 本目录是界面规范的入口：设计 Token、页面结构、三态反馈、交互规则与取舍依据。
> 适用范围：`app/` 下的页面、组件与样式。新增页面或组件前先读本页，再按下表进入对应文档。

## 1. 文档地图

| 文档                                               | 内容                                                                   | 何时读                          |
| -------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------- |
| [visual.md](./visual.md)                           | 颜色、字体、间距、圆角、动效、组件映射                                 | 写样式、定 Token、评审视觉      |
| [GENERAL.md](./GENERAL.md)                         | Button、Input、Card、Dialog 等原子组件的用法与反例                     | 使用 `~/components/ui/` 组件    |
| [time-input.md](./time-input.md)                   | TimeInput 的解析规则、滚轮、Props 与可访问性                           | 需要填写时刻、改造时间输入      |
| [file-dropzone.md](./file-dropzone.md)             | FileDropzone 的选择、校验、缩略图与性能约定                            | 需要选择文件、图片预览          |
| [patterns.md](./patterns.md)                       | 信息预算、页面骨架、页面类型、工具栏、列表、响应式表格、三态、检查清单 | 新增页面、拆组件                |
| [information-density.md](./information-density.md) | 一屏一个焦点、四个冗余信号、生成后的删除清单与验收方法                 | 页面写完、审查 UI、发现信息重复 |
| [feedback.md](./feedback.md)                       | 空、加载、错误、浮层、Toast 与提示文案                                 | 接数据、写状态与提示            |
| [interaction.md](./interaction.md)                 | 键盘、导航、URL 状态、持久化、SSR 与触摸                               | 写交互与状态                    |
| [research.md](./research.md)                       | 规范与研究来源、正反例、采纳取舍                                       | 评审规则或引入新做法            |

本目录只放可复用的规范，不记录具体页面的实现进度、截图或按日期的改造日志。页面进度写进
[docs/planning/backlog.md](../planning/backlog.md)，实现记录写进
[docs/development-log/](../development-log/)。

## 2. 设计立场

1. **先给答案**：首屏先说明当前状态与下一步，明细放进二级区域。
2. **层级来自取舍**：每个视图保留一个主操作和一组主数字，其余动作降级。
3. **表面从简**：页面用留白与分隔线分组；卡片只承载独立对象，卡片内不再套卡片。
4. **Token 是颜色来源**：颜色与圆角来自 `app/app.css`；组件里不写一次性 hex 或 `rgb()`。遮罩与阴影使用 `black` / `white` 透明度是有限例外。
5. **移动端优先**：先写基础布局，再用 `sm:` / `md:` / `lg:` 增强；触控目标不小于 44px。
6. **原语优先**：交互使用 `~/components/ui/` 的 coss / Base UI 组件，Tailwind 负责布局。
7. **状态如实**：加载、空、失败各自成态；`0` 只在真实为零时出现。
8. **文档即事实**：路径、组件名、Token 以当前代码为准；改代码时同步改文档。

## 3. AI 生成 UI 前自检

- [ ] 先查 `~/components/ui/` 是否已有组件，再写新结构。
- [ ] 颜色只用 Token：`bg-background`、`text-muted-foreground`、`border-input`；没有 `#fff` 或 `bg-[#...]`。
- [ ] 浅色与深色同时成立；不在组件里用 `dark:` 覆盖颜色。
- [ ] 交互元素有 hover（指针设备）、active（触屏）与 `focus-visible` 状态。
- [ ] 数据路径覆盖 loading / empty / error。
- [ ] 内部导航用 `<Link>`，提交用 `useSubmit()`，跳转用 `navigate()`。
- [ ] 类名用 `cn()` 合并，不手工拼接条件字符串。
- [ ] 图标按钮有 `aria-label`，装饰图标标 `aria-hidden`。
- [ ] 同一数字、名称、状态只出现一次；没有口径脚注与 `详情 →` 入口（见 [information-density.md](./information-density.md)）。
- [ ] 新路由写进 `app/routes.ts`，并跑 `bun run typecheck` 刷新 `+types/*`。

## 4. 当前约定

| 项       | 结论                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| 技术栈   | React 19 + React Router v8 SSR + Tailwind CSS v4 + coss / Base UI            |
| 主题     | `.dark` 类 + CSS 变量；浅色 / 深色 / 跟随系统由 `appConfig` store 持久化     |
| 字体     | `Inter`；等宽 `Geist Mono`；中文由系统 `sans-serif` 回退（见 `app/app.css`） |
| 主色     | `rgb(29, 155, 240)`                                                          |
| 圆角基准 | `--radius: 0.625rem`（10px）                                                 |
| 断点     | Tailwind 默认断点；`useMediaQuery('max-md')` 按 800px 计算                   |
| 布局     | 移动端单列；`md` 以上可加侧栏或双栏；详情在窄屏改为整页                      |
| 反馈     | `Empty` / `Skeleton` / `Spinner` / `Alert` / `toastManager`                  |
| 浮层     | `Dialog` / `AlertDialog` / `Sheet` / `Drawer` / `Popover` / `Menu`           |

## 5. 维护

- 新增、移动或删除文档时同步更新本页与 [docs/README.md](../README.md)。
- 规则变化先改文档，再改代码；模板仓库不保留一次性的页面方案与改造记录。
- 评审按 [research.md §5](./research.md#5-评审方法) 的检查顺序执行。
