# 项目文档

## UI 设计规范（AI 必读）

在编写任何 UI 组件或页面之前，请按以下顺序阅读规范文档：

### 入口

1. **[ui-design/OVERVIEW.md](./ui-design/OVERVIEW.md)** — 设计系统总览
   - 颜色 Token 速查表、排版层级、间距/圆角系统
   - 交互物理学（hover/active/focus 规则、动画预设）
   - 完整组件文件索引（58 个可用组件）

### 组件规范

2. **[ui-design/components/GENERAL.md](./ui-design/components/GENERAL.md)** — 通用原子组件规范
   - Button、Input、InputGroup、Card、Dialog、Drawer、Toast、Icon
   - 导入路径、API 速查、常见错误速查（Anti-Patterns）

3. **[ui-design/components/SETTINGS.md](./ui-design/components/SETTINGS.md)** — 设置页面强制模式
   - SettingsGroup + SettingsItem 的 5 个标准场景
   - 触发关键词识别、强制检查清单

4. **[ui-design/components/select-best-practices.md](./ui-design/components/select-best-practices.md)** — Select 组件最佳实践
   - `getLabel` API、4 种常见模式、边缘情况处理

### 阅读优先级

- **写通用组件/页面** → 先读 OVERVIEW.md，再读 GENERAL.md
- **写设置/配置页面** → 先读 SETTINGS.md，再参考 GENERAL.md
- **用到 Select** → 读 select-best-practices.md
- **不确定用哪个组件** → 查 OVERVIEW.md 第 7 节的组件索引

## 关键原则速记

- 所有颜色使用 CSS 变量 Token（`bg-background`、`text-muted-foreground` 等），禁止硬编码
- Dark Mode 是一等公民，所有组件必须兼容
- 优先复用 `~/components/ui/` 下已有组件
- 导入路径统一用 `~/components/ui/<name>`
- 移动端优先，再用 `sm:`/`md:`/`lg:` 增强
- 所有交互必须有过渡动画，时长 150-350ms

## 共享组件文档

脚手架自带的全局组件（ThemeProvider、ProgressBar 等）文档在 **[shared-components/](./shared-components/README.md)**。
