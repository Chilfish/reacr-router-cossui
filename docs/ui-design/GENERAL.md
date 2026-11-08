# 通用组件设计规范（General Components）

> **原则：** 所有基础 UI 元素优先使用 `~/components/ui/` 下的 coss-ui 组件。不要手写裸 `<div>` 或 `<button>` 来模拟已有组件。
>
> **coss-ui 基础：** 基于 Base UI（无头无障碍原语） + Tailwind CSS + CVA（变体管理）。组件已内置可访问性、Focus 管理和默认样式。
>
> **参考文档：** https://coss.com/ui/llms.txt

---

## 0. 全局规则

### 0.1 导入路径

所有 UI 组件从 `~/components/ui/<name>` 导入。不要从 node_modules 直接导入。

```tsx
// 正确
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardHeader, CardContent } from '~/components/ui/card'

// 错误
import { Button } from '@/components/ui/button'  // 不要用 @/
import { Input } from '../components/ui/input'   // 不要用相对路径
```

### 0.2 类名工具

使用 `cn()` 合并类名（封装了 `clsx` + `tailwind-merge`）：

```tsx
import { cn } from '~/lib/utils'

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

### 0.3 不要在 coss-ui 组件外层擅自添加 padding

Base UI 组件已处理好整体结构。额外的 padding 会被坏组件内部的对齐。

---

## 1. 按钮（Button）

导入路径：`~/components/ui/button`

### 1.1 Variant 使用指南

| Variant               | 类名绑定                                    | 使用场景                               |
| --------------------- | ------------------------------------------- | -------------------------------------- |
| `default`             | `bg-primary text-primary-foreground` + 阴影 | 页面唯一的首要操作（提交、确认、保存） |
| `secondary`           | `bg-secondary text-secondary-foreground`    | 次要操作（取消、返回、重置）           |
| `outline`             | `border-input bg-popover text-foreground`   | 带边框的中性操作（导出、预览）         |
| `ghost`               | `border-transparent hover:bg-accent`        | 工具栏图标按钮、行内操作               |
| `destructive`         | `bg-destructive text-white`                 | 不可逆的危险操作（删除、清空）         |
| `link`                | `underline-offset-4 hover:underline`        | 文字链接式按钮                         |
| `destructive-outline` | 边框 + 红色文字                             | 次要危险操作（取消订阅）               |

### 1.2 Size 使用指南

| Size                  | 移动端高度           | `sm` 以上 | 使用场景                         |
| --------------------- | -------------------- | --------- | -------------------------------- |
| `xs`                  | `h-7`                | `h-6`     | 紧凑表格内、批量操作栏           |
| `sm`                  | `h-8`                | `h-7`     | 工具栏、卡片 footer              |
| `default`             | `h-9`                | `h-8`     | **最常用**，表单提交、对话框确认 |
| `lg`                  | `h-10`               | `h-9`     | 大卡片 CTA                       |
| `xl`                  | `h-11`               | `h-10`    | 登录页、落地页主按钮             |
| `icon-xs` ~ `icon-xl` | `size-7` ~ `size-11` | 小一档    | 纯图标按钮                       |

触屏设备的点击区域由组件的 `pointer-coarse` 样式补到 44×44px，不需要在页面里重复加 padding。

### 1.3 交互增强

```tsx
// 标准按钮
<Button variant="default">提交</Button>
<Button variant="ghost" size="icon-sm"><SettingsIcon /></Button>

// 加载态
<Button loading>保存中...</Button>

// 移动端按压反馈（在主要操作上）
<Button className="active:scale-[0.97]">确认支付</Button>

// 禁止：手动拼凑按钮样式
<button className="bg-blue-500 text-white rounded px-4 py-2">确认</button>
```

---

## 2. 输入框（Input）

导入路径：`~/components/ui/input`

### 2.1 标准用法

```tsx
import { Input } from '~/components/ui/input'

<Input
  placeholder="请输入用户名"
  size="default"  // 可选: "sm" | "default" | "lg"
/>

// 禁用态
<Input disabled placeholder="不可编辑" />

// 文件选择
<Input type="file" />
```

### 2.2 InputGroup（带图标/标签）

**必须使用 InputGroup**，禁止手动 absolute 定位图标：

```tsx
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'
import { SearchIcon } from 'lucide-react'

// 带前缀图标
<InputGroup>
  <InputGroupAddon align="inline-start">
    <SearchIcon className="size-4" />
  </InputGroupAddon>
  <InputGroupInput placeholder="搜索..." />
</InputGroup>

// 禁止
<div className="relative">
  <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2" />
  <Input className="pl-8" />
</div>
```

**规则：**

- 图标使用 `size-4`（16px）
- 图标颜色：`text-muted-foreground`
- `InputGroupAddon` 的 `align` 可选 `"inline-start"`、`"inline-end"`、`"block-start"`、`"block-end"`；头部图标用 `inline-start`，尾部按钮用 `inline-end`

### 2.3 设置行中的无边框 Input

设置页没有 `SettingsItem` 组件。行由页面用 `FramePanel` 或普通容器拼装，需要行内编辑时再覆盖 Input 样式：

```tsx
<Input
  className="h-8 w-[200px] border-none bg-transparent px-0 text-right shadow-none focus-visible:ring-0"
  defaultValue="Alice"
/>
```

---

## 3. 卡片（Card）

导入路径：`~/components/ui/card`

### 3.1 使用规则

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述文字</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 主要内容 */}
  </CardContent>
  <CardFooter>
    <Button variant="outline">取消</Button>
    <Button>确认</Button>
  </CardFooter>
</Card>
```

### 3.2 禁止事项

- **禁止在 `Frame` / `FramePanel` 内再嵌套 Card** — 设置分组直接使用 `FramePanel`，不再套一层 Card
- **禁止在 `CardPanel`（别名 `CardContent`）内再嵌套独立 Card** — 如需分区，使用 `Frame`、分隔线或多 Card 并列
- **同质记录不使用 Card** — 列表或表格更容易扫读与比较

---

## 4. 浮层（Overlays）

### 4.1 Dialog（模态框）

导入路径：`~/components/ui/dialog`

```tsx
import { Dialog, DialogDescription, DialogHeader, DialogPopup, DialogTitle } from '~/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>编辑名称</DialogTitle>
      <DialogDescription>名称会显示在列表与搜索结果中。</DialogDescription>
    </DialogHeader>
    {/* 内容 */}
  </DialogPopup>
</Dialog>
```

**特性：**

- `DialogPopup` 也以 `DialogContent` 导出，两种名字等价
- 默认已含 `backdrop-blur-sm` 背景模糊与进出动画
- `bottomStickOnMobile` 默认为 `true`，移动端贴底；需要居中时显式传 `false`
- 删除、取消任务等不可逆操作使用 `AlertDialog`，不要用普通 Dialog

### 4.2 Drawer / Sheet（侧边或底部面板）

导入路径：`~/components/ui/drawer` 或 `~/components/ui/sheet`

- **`Drawer`** 支持 `position="bottom" | "top" | "left" | "right"`，默认 `bottom`，支持手势关闭；`showBar` 显示顶部拖拽条。
- **`Sheet`** 支持 `side="right" | "left" | "top" | "bottom"`，默认从右侧进入；需要底部面板时显式传 `side="bottom"`。
- 两者都不会按视口宽度自动切换形态。窄屏用底部、宽屏用侧边时，由页面根据 `useMediaQuery` 选择，或统一使用 `Dialog` 的 `bottomStickOnMobile`。
- `Sheet` 默认显示关闭按钮；`Drawer` 的 `showCloseButton` 默认为 `false`，需要按钮时显式传 `true`，或由页面提供关闭动作。

### 4.3 Toast（通知）

导入路径：`~/components/ui/toast`

应用已在 `root.tsx` 中全局挂载 `<ToastProvider>` 和 `<AnchoredToastProvider>`。组件内使用 `toastManager.add()`，锚定元素使用 `anchoredToastManager`。

```tsx
import { toastManager } from '~/components/ui/toast'

toastManager.add({ title: '已保存', type: 'success' })
```

- **位置：** `ToastProvider` 默认 `bottom-right`；需要其它位置时在 `root.tsx` 传 `position`，不要在每个页面单独配置。
- **类型：** `success` / `error` / `info` / `warning` / `loading`，图标与颜色由组件处理。
- **样式：** 组件内置 `bg-popover`、边框、阴影与圆角，不要覆盖成一次性颜色。
- 持续可见的状态用 `Alert` 或 `Badge`，不要用 Toast 代替状态展示。

---

## 5. 图标（Icons）

### 5.1 规则

- **库：** `lucide-react`
- **默认大小：** `size-4`（16px）
- **按钮内图标：** 由 `Button` 按 `size` 适配；默认移动端 `size-4.5`、`sm` 以上 `size-4`，`xl` / `icon-xl` 使用 `size-5`
- **极小图标：** `size-3.5`（14px）元数据/辅助文字
- **颜色：**
  - 默认跟随文字（`currentColor`，无需额外设置）
  - 辅助图标：`text-muted-foreground`
  - **禁止** 使用纯黑 `#000` 或纯白 `#fff`

```tsx
// 正确
<SearchIcon className="size-4 text-muted-foreground" />
<SettingsIcon className="size-5" />  // 继承父级文字颜色

// 错误
<SearchIcon className="size-4 text-black dark:text-white" />
```

---

## 6. 工具函数

### 6.1 cn() — 类名合并

```tsx
import { cn } from '~/lib/utils'

// 条件类名、合并覆盖
<div className={cn(
  'base-style',
  variant === 'primary' && 'text-primary',
  className,
)} />
```

### 6.2 useMediaQuery / useIsMobile — 响应式检测

统一从 `~/hooks/use-media-query` 导入。`app/hooks/use-mobile.ts` 是另一份未使用的实现，不要新增引用。

```tsx
import { useIsMobile, useMediaQuery } from '~/hooks/use-media-query'

const isMobile = useIsMobile()                        // < 800px
const isDesktop = useMediaQuery('lg')                 // >= 1024px
const isTouch = useMediaQuery({ pointer: 'coarse' })  // 触摸设备
```

- 断点名：`sm` 640、`md` 800、`lg` 1024、`xl` 1280、`2xl` 1536。
- 查询也可以传 CSS 媒体查询字符串。
- 服务端快照固定为 `false`，首屏不要依赖它渲染唯一内容。

---

## 7. 常见错误速查（Anti-Patterns）

| 错误                                                            | 正确做法                                                                    |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `<button className="bg-blue-500 text-white rounded px-4 py-2">` | `<Button>`                                                                  |
| `<div className="absolute left-2 top-1/2"><Icon /></div>`       | `<InputGroup><InputGroupAddon><Icon /></InputGroupAddon></InputGroup>`      |
| `<div className="bg-white rounded-xl shadow p-6">`              | `<Card><CardContent>...</CardContent></Card>`                               |
| `className="border-b border-gray-200"` 在设置列表               | `Frame` + `FramePanel` 分组，行间用 `Separator` 或 `border-border`          |
| `text-black dark:text-white`                                    | `text-foreground`                                                           |
| `bg-white dark:bg-gray-900`                                     | `bg-background` 或 `bg-card`                                                |
| `<hr />` 分割两个区域                                           | `<Separator />` 来自 `~/components/ui/separator`                            |
| 导入 `@/components/ui/button`                                   | 导入 `~/components/ui/button`                                               |
| 窄屏把表格压到标题列一字一行                                    | `md` 以下换成堆叠列表，见 [patterns.md §4](./patterns.md#4-行与卡片)        |
| 同一数字在标题、读数与脚注里各写一遍                            | 只保留层级最高的一处，见 [information-density.md](./information-density.md) |
