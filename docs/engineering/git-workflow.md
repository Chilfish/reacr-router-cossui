# Git 开发流程

**项目**: react-router-cossui | **最后更新**: 2026-08-09

## 分支模型

采用 **Trunk-Based Development**（简化版）：

```
main ─────●─────●─────●─────●──→ (始终可部署)
           \     /
feat/xxx ──●───●
```

| 分支类型     | 命名格式                   | 用途                 | 生命周期   |
| ------------ | -------------------------- | -------------------- | ---------- |
| `main`       | —                          | 稳定分支，始终可部署 | 永久       |
| `feat/*`     | `feat/settings-page`       | 功能开发             | 合并后删除 |
| `fix/*`      | `fix/theme-flash`          | Bug 修复             | 合并后删除 |
| `refactor/*` | `refactor/extract-hooks`   | 重构                 | 合并后删除 |
| `docs/*`     | `docs/adopt-doc-structure` | 文档更新             | 合并后删除 |
| `test/*`     | `test/add-seo-spec`        | 测试补充             | 合并后删除 |

## Commit 规范

遵循 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)。

### 格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type

| Type       | 说明               | 示例                                      |
| ---------- | ------------------ | ----------------------------------------- |
| `feat`     | 新功能             | `feat(ui): add settings layout`           |
| `fix`      | Bug 修复           | `fix(theme): persist system preference`   |
| `refactor` | 重构（不改变行为） | `refactor(hooks): extract useMediaQuery`  |
| `test`     | 测试               | `test(seo): add generateSEOMeta coverage` |
| `docs`     | 文档               | `docs: adopt documentation structure`     |
| `style`    | 格式化             | `style: apply eslint --fix`               |
| `chore`    | 构建/工具          | `chore(build): add vitest config`         |
| `perf`     | 性能优化           | `perf(ui): memoize heavy rows`            |

### Scope

`scope` 使用模块名或功能名：`ui`、`seo`、`theme`、`routes`、`docs`、`build`、`test` 等。

### 规则

- **Description 用英文祈使句**（命令式）：`add`、`fix`、`remove`
- 首字母小写，不加句号，不超过 72 字符
- **Breaking change**：footer 中标记 `BREAKING CHANGE: description`

### Commit 纪律

> **先想 commit message，再动工写代码。** 避免「上帝 commit」（一个超大 commit 包含所有变更）。

1. 写代码前先用 Conventional Commit 格式确定 commit message
2. 围绕这个 message 的范围编写代码，超出范围的工作留给下一个 commit
3. 当 diff 变大时（>10 文件或 >200 行），主动拆分为多个独立 commit
4. 每个 commit 应能独立通过验证（`typecheck` + `lint` + `test`）
5. 模块创建、功能实现、配置修改、文档更新应分开 commit

## 验证门禁

每个 commit / PR 合并前必须通过：

```bash
bun run typecheck     # TypeScript 类型检查
bun run lint          # ESLint（@antfu/eslint-config）
bun run build         # 生产构建（react-router build）
bun run test          # Vitest（见 docs/engineering/code-style.md §测试）
bun run test:coverage # 覆盖率门禁（app/lib ≥ 55%）
```

- `lefthook` 在 `postinstall` 自动安装，pre-commit（eslint --fix）+ pre-push（build + test）已配置
- **禁止 `--no-verify` 跳过钩子**；钩子失败必须修复根因

### 验证诚实

- 测试必须能失败：故意改坏被测行为，相关测试应变红；否则该测试不构成门禁
- 不提交 `skip` / `only` / 空 `describe` 或零匹配的空跑作为通过
- 源码扫描只能做结构检查，不能替代行为断言
- 不接受「既有红灯」作为基线；已知失败先修或移除
- 报告门禁时写清命令与结果；未执行的检查标注「未验证」

## 代码审查

1. 创建 PR（按 [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md) 填写）→ 跑通验证门禁
2. 至少 1 人 Approve；AI 辅助先进行自动化 Code Review
3. 审查问题登记进 `docs/planning/backlog.md` 的「审查承接区」
4. 所有检查通过后 Merge（Create a Merge Commit，保留原子 commit）
5. Merge 后删除 feature 分支

### 审查清单

- [ ] 代码逻辑正确，覆盖边界情况
- [ ] 新功能/纯函数有测试；改动无回归
- [ ] 测试能失败：故意改坏实现时相关测试会变红
- [ ] 无 `skip` / `only` / 空跑 / 源码扫描冒充行为断言
- [ ] 遵循 [code-style.md](./code-style.md)
- [ ] 无硬编码颜色、无 `any`、无 TODO 遗留
- [ ] SSR 安全：渲染期不读 `window` / `document` / `localStorage`
- [ ] 导航使用 `<Link>` / `useSubmit()` / `navigate()`（如适用）
- [ ] 数据获取路径三态覆盖（loading / empty / error）
- [ ] 无障碍：焦点可见，图标按钮有可访问名称
- [ ] UI 变更已按 [information-density.md](../ui-design/information-density.md) 的删除清单检查
- [ ] 记录型表格在 `md` 以下换成堆叠列表，320 / 390px 无横向溢出
- [ ] UI 变更附带截图（浏览器实测）
- [ ] 相关文档已更新（`docs/`、索引、`CHANGELOG.md`）
- [ ] 文档与界面文案符合 [writing-style.md](../writing-style.md)
- [ ] 路径、命令、路由仍能对上代码；无死链
- [ ] 新 Bug 模式写 postmortem

## 发布流程

脚手架部署到 Vercel（`react-router.config.ts` 已配置 `vercelPreset`）：

### 常规部署

- `main` 分支推送自动触发 Vercel 部署（Previews + Production）

### 里程碑发布（按需）

1. 更新 `CHANGELOG.md`（Unreleased → 版本节）
2. 按 [release-checklist.md](./release-checklist.md) 跑冒烟清单
3. 打 Tag：`git tag v0.1.0 && git push --tags`
4. GitHub Release：`gh release create v0.1.0 --generate-notes`

## AI 协作开发

- 优先使用 `gh` CLI 进行 GitHub 全流程管理
- 文档先行：先更新 `docs/planning/backlog.md` 或方案文档，再写代码
- 验证先行：先写验收标准与可失败的测试，再实现
- 新功能先写 spike 验证跨系统边界假设（如新库 API 行为先写 5 行 spike 实测）
- 新 Bug 模式写 postmortem（见 `docs/postmortem/README.md`），预防项同步到本文件或 `AGENTS.md`
- 文档与界面文案按 [writing-style.md](../writing-style.md) 执行
