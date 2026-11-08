# 页面与组件结构参考

> 新增页面、拆分页面或添加组件时按本页起步。视觉值见 [visual.md](./visual.md)，三态细节见 [feedback.md](./feedback.md)，工程约定见 [code-style.md](../engineering/code-style.md)。

## 0. 信息预算

写页面前先用一句话回答：**谁打开它、想知道什么、下一步做什么。** 这句话之外的元素先放进对话框、Sheet 或二级页。

- 首屏先给答案：状态、关键数字、待办；说明与明细排在其后。
- 每个视图保留一个主操作（填充按钮）；次要动作使用 `ghost` / `outline`，低频动作进菜单。
- 一屏最多 4 个关键数字；完整统计放进对话框或二级页。
- 复杂配置放进对话框或 Sheet；页面保留摘要与入口。
- 区块只承担一件事；没有内容的区块不渲染，页面不摆空卡片。
- 同一信息只出现一次；重复说明删掉。
- 检查方法：删掉任意区块后，页面是否仍回答核心问题。答案为是时，删除这个区块。

生成完成后再按 [information-density.md](./information-density.md) 的删除清单过一遍：重复表述、口径脚注、自证式导航、因字段存在而存在的区块，以及只加不减的改动。

## 1. 页面骨架

页面占满可用高度，工具栏固定，内容区自己滚动：

```tsx
<div className="flex h-dvh min-h-0 flex-col bg-background">
  <header className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
    {/* 标题、计数、搜索或筛选 */}
    <div className="ml-auto flex items-center gap-1">{/* 至多三个控件簇 */}</div>
  </header>

  <ScrollArea className="min-h-0 flex-1">
    {/* 列表或内容 */}
  </ScrollArea>
</div>
```

- 页面容器负责取数、路由参数与拼装，行数控制在 250 以内。
- 跨页复用的组件放 `app/components/shared/`；单页私有的区块放路由同目录的 `<name>/` 子目录。
- 纯逻辑放 `app/lib/`，同目录补 `*.spec.ts`。
- 组件接收 props，不在展示组件里直接取路由数据。
- `ScrollArea` 已设置 `size-full min-h-0`，父级需要有确定高度。

## 2. 页面类型

| 类型        | 结构                                             | 适用                    |
| ----------- | ------------------------------------------------ | ----------------------- |
| 列表页      | 标题行（标题 + 计数 + 搜索）+ 列表 + 底部加载    | 记录、日志、通知        |
| 列表 + 详情 | 左侧列表，右侧详情；窄屏详情改为整页             | 邮件、消息、数据集      |
| 网格页      | 标题行 + 分组 + 网格；工具栏保持一行             | 图片、文件、卡片集合    |
| 概览页      | 状态区 + 主操作 + 最多 4 个数字 + 最近条目       | 首页、Dashboard         |
| 表单页      | 标题 + `Field` / `Fieldset` + 底部提交条         | 设置、创建、编辑        |
| 设置页      | 分类栏 + `FramePanel` 分组 + 行控件              | 偏好、账号、集成        |
| 结果页      | 状态图标 + 标题 + 说明 + 一个主操作 + 一个次操作 | 成功、失败、404、无权限 |

**长列表**

- 优先使用 `ScrollArea` 与分页 / 游标加载；一次渲染数百行以上时再引入虚拟列表。
- 首屏骨架数量接近可见行数，减少加载后的跳动。
- 底部加载使用 `Spinner` +「正在加载」；到底后显示「已经到底了」。
- 分页参数写入 URL，返回时能回到同一页。

**筛选与 URL**

- 会改变结果集的筛选写入 URL：`?q=`、`?status=`、`?page=`、`?sort=`。
- 纯展示偏好（视图模式、密度、侧栏开合）写入 `appConfig` store 或组件状态，刷新后保留。
- 切换筛选时清空与旧结果绑定的选择。
- 使用 `useSearchParams` 读写；内部跳转用 `<Link>` 或 `navigate()`。

## 3. 工具栏

- 左侧：页面名 + 总数。计数使用 `tabular-nums`。
- 右侧按优先级分三段，最多三个控件簇：
  1. 一个主控件（搜索、筛选或主按钮）；
  2. 常用切换（`SegmentedControl`、`ToggleGroup`）；
  3. `⋯` 溢出菜单（`DropdownMenu`），放低频与维护动作。
- 选项多于 3 个且互斥时，用 `Popover` 承载一组带标签的控件；筛选生效时按钮带一个小圆点。
- 图标按钮使用 `size="icon-sm"`，同时提供 `aria-label` 与 `title`。
- 批量选择时，工具栏整条换成批量条，动作顺序：全选、主操作、次操作、取消。
- 页面头部需要分组控件时使用 `Toolbar`；它是带边框的控件容器，不替代页面 `<header>`。

## 4. 行与卡片

**列表行**

- 行高 56–80，左右内边距 16。
- 行内按「主信息、次要信息、右侧动作」排列。
- hover 使用背景或透明度变化，尺寸保持稳定；选中使用 2px 主色描边或 `bg-accent`。
- 元数据、计数、标签等短文本可以 `truncate`；标题与正文换行，不截断。数字列右对齐。

**卡片**

- 使用 `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardPanel` / `CardFooter`。
- 卡片承载独立对象与详情入口；同质内容优先用列表或表格。
- 卡片圆角由组件内置（`rounded-2xl`），不额外覆盖。
- 卡片内不再嵌套卡片；需要分区时用 `Frame` / `FramePanel` 或分隔线。
- 设置页用 `Frame` + `FramePanel` 组织分组，不为每一行套 Card。

**记录型表格（窄屏换形态）**

记录列表（日程、订单、成员、日志）在窄屏不要压缩表格：固定列宽会把标题列挤成一字一列。统一形态是「桌面表格 + 移动端堆叠列表」，分界点 `md`（768px）。

```tsx
<div className="hidden md:block">
  <Table>
    {/* 表头 + 行 */}
  </Table>
</div>

<ul className="md:hidden">
  {rows.map(row => (
    <li key={row.id} className="flex flex-col gap-1.5 border-t border-border px-4 py-3 first:border-t-0">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs tabular-nums text-muted-foreground">{row.time}</span>
        <span className="text-sm font-medium">{row.title}</span>
        <Badge size="sm" variant="outline">{row.status}</Badge>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
    </li>
  ))}
</ul>
```

| 规则                                                            | 原因                     |
| --------------------------------------------------------------- | ------------------------ |
| 标题列不设固定宽度、不用 `truncate`                             | 窄屏会把标题压成一字一列 |
| `<md` 不渲染表格，改堆叠列表                                    | 横向滚动与压缩列都难读   |
| 列表行用一条分隔线分组，不套卡片                                | 保持密度，避免卡片堆     |
| 状态、关联、操作抽成小组件，两种形态复用                        | 不写两份判断             |
| 真正的宽数据表（矩阵、热力图）才用 `overflow-x-auto` 容器内滚动 | 记录列表一律换形态       |
| 用设备模拟（宽度 + 触摸）验证 320 / 390px                       | 只缩桌面视口看不出问题   |

## 5. 状态三件套

| 状态 | 组件                                                                                        | 规则                                               |
| ---- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 空   | `Empty` / `EmptyHeader` / `EmptyMedia` / `EmptyTitle` / `EmptyDescription` / `EmptyContent` | 说清是什么、为什么空、下一步做什么                 |
| 加载 | `Skeleton` / `Spinner` / `Button loading` / `ProgressBar`                                   | 首屏用骨架，翻页用尾部 Spinner，按钮动作用 loading |
| 失败 | `ErrorBoundary` / `ErrorDisplay` / `Alert`                                                  | 说明原因并给重试；堆栈只进日志                     |

完整规则与文案示例见 [feedback.md](./feedback.md)。

## 6. 数据与状态

- 服务端数据用 React Router 的 `loader` / `action`；客户端交互状态用 `useState`。
- 跨页共享才使用 Zustand（`app/stores/`）；单页状态留在组件里。
- 数据获取路径必须覆盖 loading / empty / error。
- 请求参数与结果类型显式声明；不使用 `any`。
- 表单提交用 `useSubmit()` 或 `<Form>`；不要调用 `form.submit()`。
- 路由切换的全局进度由 `root.tsx` 的 `ProgressBar` 承担；按钮级提交状态用 `useIsPending()`。
- 持久化 store 改动 schema 时升 `version` 并写迁移；渲染前用 `useHydrated()` 判断客户端是否就绪。

## 7. 可访问性

- 每个图标按钮提供 `aria-label`；装饰图标标 `aria-hidden="true"`。
- 标题按层级使用 `h1` → `h2` → `h3`，不跳级。
- `Tab` 顺序与视觉顺序一致；`Esc` 关闭浮层；浮层关闭后焦点回到触发元素。
- 焦点样式使用 `focus-visible:ring-2`；不要移除 outline 后不补替代。
- 颜色状态同时配文字或图标。
- 触控目标不小于 44×44px；按钮组件的 `pointer-coarse` 样式已处理。
- 尊重 `prefers-reduced-motion`；减少动态时保留淡入。

## 8. 新增页面检查清单

- [ ] 路由注册在 `app/routes.ts`，并导出 `meta`。
- [ ] 路由模块使用 `import type { Route } from './+types/<name>'`。
- [ ] 页面容器不超过 250 行；取数与纯逻辑已拆分。
- [ ] 三种状态齐全：空、加载、失败。
- [ ] 工具栏控件不超过三段，主操作只有一个。
- [ ] 筛选进 URL，展示偏好进 store。
- [ ] 内部导航用 `<Link>`；提交用 `useSubmit()`；跳转用 `navigate()`。
- [ ] 图标按钮有 `aria-label`；键盘路径可用。
- [ ] 间距、圆角、字号与 [visual.md](./visual.md) 一致。
- [ ] 按 [information-density.md](./information-density.md) 的删除清单检查：无重复表述、口径脚注、自证式导航。
- [ ] 记录型表格在 `md` 以下换成堆叠列表，320 / 390px 无横向溢出。
- [ ] 纯逻辑有同目录 `*.spec.ts`，测试能失败。
- [ ] `bun run typecheck`、`bun run lint`、`bun run test`、`bun run build` 通过。

## 9. 组件速查

| 需求               | 组件                                      |
| ------------------ | ----------------------------------------- |
| 单行选项（2–4 项） | `SegmentedControl`                        |
| 图标切换           | `ToggleGroup` / `Toggle`                  |
| 下拉选择           | `Select`                                  |
| 可搜索选择         | `Combobox` / `Autocomplete` / `Command`   |
| 带标签的筛选面板   | `Popover` + `Select` / `SegmentedControl` |
| 低频动作           | `DropdownMenu` / `ContextMenu`            |
| 行内提示           | `Alert`                                   |
| 破坏性确认         | `AlertDialog`                             |
| 自包含任务         | `Sheet` / `Dialog`                        |
| 移动端底部面板     | `Drawer`（`position="bottom"`）           |
| 搜索输入           | `InputGroup` + `InputGroupInput`          |
| 时间输入           | `TimeInput`（`~/components/shared/`）     |
| 文件选择与拖拽     | `FileDropzone`（`~/components/shared/`）  |
| 短标签与状态       | `Badge`                                   |
| 快捷键提示         | `Kbd` / `Tooltip`                         |
| 加载               | `Skeleton` / `Spinner` / `Progress`       |
| 空状态             | `Empty`                                   |
| 长内容滚动         | `ScrollArea`                              |

完整导入路径与用法见 [GENERAL.md](./GENERAL.md)。
