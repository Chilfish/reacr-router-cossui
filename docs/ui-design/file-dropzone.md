# 文件选择器（FileDropzone）

> 组件：`app/components/shared/file-dropzone.tsx`
> 纯逻辑：`app/lib/files.ts`（测试：`app/lib/files.spec.ts`）
> 缩略图：`app/hooks/use-file-thumbnails.ts`
> 大图预览：`app/hooks/use-object-url.ts`
> 演示：`/example/files`（`app/routes/example-files.tsx`）

## 1. 何时使用

- 需要添加一个或多个文件，允许点击选择与拖拽放入。
- 需要在提交前展示所选文件，图片带缩略图，并能查看大图。

不要用于：

- 需要上传进度、分片或断点续传：组件只负责选择与预览，上传由业务层完成。
- 需要选择整个文件夹：改用 `webkitdirectory` 或基于 `DataTransferItem` 的目录解析。
- 需要服务端直传签名：在业务层接入，组件仍只输出 `File[]`。

## 2. 导入与基础用法

```tsx
import { FileDropzone } from '~/components/shared/file-dropzone'

<FileDropzone
  accept="image/*"
  maxFiles={10}
  maxSize={8 * 1024 * 1024}
  onChange={setFiles}
/>
```

组件不包含 label 与说明文字结构，`label`、`description` 直接传入即可；需要接入表单时按下文「6. 提交」处理。

## 3. 行为

### 3.1 选择方式

- 点击虚线区域打开系统文件选择器。
- 拖拽文件到区域上，进入时高亮；拖拽计数避免子元素触发闪烁。
- 区域支持键盘：聚焦后按 `Enter` 或空格打开选择器。
- 选择后自动去重：同名、同大小、同修改时间的文件视为同一个。

### 3.2 校验

按顺序校验并给出拒绝原因：

1. 类型不符（`accept`）
2. 超过大小上限（`maxSize`）
3. 超出数量上限（`maxFiles`）
4. 重复文件

拒绝的文件不进入列表，界面显示一行汇总提示，例如「已忽略 2 个文件：1 个类型不符，1 个超过 10 MB」。

### 3.3 单选

`multiple={false}` 时：

- 系统选择器只允许一个文件。
- 再次选择会替换原文件，不追加。

### 3.4 图片预览

- 选中图片后异步生成缩略图，列表内展示 40×40 缩略图。
- 点击缩略图打开 `Dialog` 大图预览，显示文件名、大小与 MIME。
- 非图片文件显示文件图标，不创建图片 URL。

## 4. 性能约定

- 缩略图由 `createImageBitmap` 按 128px 宽度解码，再绘制到 canvas 转成 WebP，避免列表直接解码原图。
- 缩略图生成最多 3 个并发；文件多时不会同时占满主线程。
- 不支持 `createImageBitmap` 或解码失败时退化为对象 URL。
- 缩略图使用固定 `width` / `height` 与 `loading="lazy"`、`decoding="async"`，避免布局抖动与首屏解码。
- 所有对象 URL 在移除文件或组件卸载时释放；大图 URL 只在预览打开期间存在。
- 默认 `maxFiles = 20`、`maxSize = 10 MB`，用上限约束 DOM 与内存；业务可按需调整，但不要无限放开。

## 5. Props

| Prop           | 类型                      | 默认                | 说明                         |
| -------------- | ------------------------- | ------------------- | ---------------------------- |
| `value`        | `File[]`                  | —                   | 受控文件列表                 |
| `defaultValue` | `File[]`                  | —                   | 非受控初始文件               |
| `onChange`     | `(files: File[]) => void` | —                   | 列表变化回调，始终返回新数组 |
| `accept`       | `string`                  | —                   | 原生 `accept` 规则           |
| `multiple`     | `boolean`                 | `true`              | 是否允许多选                 |
| `maxFiles`     | `number`                  | `20`                | 最多保留的文件数             |
| `maxSize`      | `number`                  | `10485760`（10 MB） | 单个文件大小上限（字节）     |
| `disabled`     | `boolean`                 | `false`             | 禁用选择与拖拽               |
| `label`        | `string`                  | `拖拽文件到此处`    | 区域主文案                   |
| `description`  | `string`                  | 自动生成            | 区域说明文案                 |
| `className`    | `string`                  | —                   | 传递给最外层容器             |
| `aria-label`   | `string`                  | `选择文件`          | 拖拽区域的可访问名称         |

## 6. 提交

组件只持有 `File[]`，不会自动上传。提交时自行构造 `FormData`：

```tsx
const formData = new FormData()
for (const file of files)
  formData.append('files', file)

await fetch('/api/upload', { method: 'POST', body: formData })
```

使用 React Router 的 action 时，把 `FormData` 交给 `submit(formData, { method: 'post' })`，不要直接调用 `form.submit()`。

## 7. 可访问性

- 拖拽区域使用 `role="button"`、`tabIndex=0`，支持 `Enter` / 空格触发。
- 区域通过 `aria-describedby` 关联说明文案；`aria-disabled` 反映禁用状态。
- 缩略图预览按钮有 `aria-label`（包含文件名），移除按钮同理。
- 校验提示使用 `role="alert"`，错误不依赖颜色单独表达。
- 焦点样式使用 `focus-visible:ring-2`；图标标记 `aria-hidden`。

## 8. 约束

- 文件只在浏览器内存中处理，不会自动上传；组件不负责持久化。
- 不要绕过 `addFiles` 直接拼接列表，否则去重与数量限制会失效。
- 新增校验规则时，先在 `app/lib/files.spec.ts` 补能失败的用例，再改实现。
- 颜色只用 Token（`bg-background`、`text-muted-foreground`、`border-input` 等）。
