# Release Checklist

**项目**: react-router-cossui | **最后更新**: 2026-08-09

> 脚手架部署到 Vercel。目标：每个「里程碑发布」的产物在真实环境验证通过，不留已知回归。
> 常规 push 自动部署（Preview + Production）；本文档覆盖**里程碑发布**（打 tag + GitHub Release）时的完整清单。

## 版本纪律

- 版本号单一来源：`package.json` `version` 字段（SemVer 2.0.0）
- 仅在**验证门禁全绿**后打 tag：`git tag v0.1.0 && git push --tags`
- 每次发布 version 单调递增，禁止回退
- `CHANGELOG.md` 的 Unreleased 节在发布前迁移到版本节

## 验证门禁（发布前必过）

- [ ] `bun run typecheck` 通过
- [ ] `bun run lint` 通过
- [ ] `bun run build` 通过（react-router build）
- [ ] `bun run test` 全绿（Vitest）
- [ ] `bun run test:coverage` 达到阈值（`app/lib` ≥ 55%）
- [ ] 关键测试能失败：故意改坏被测行为时相关测试会变红
- [ ] 无 `skip` / `only` / 空跑用例冒充通过
- [ ] lefthook pre-commit / pre-push 钩子无跳过

## 功能冒烟（真实环境浏览器实测）

> 浏览器验证在真实部署 URL（Vercel Production）执行，勾选并记录日期。业务功能落地后在此追加对应冒烟项。

### 脚手架基础

- [ ] 首页加载正常（SSR 内容可见，无白屏闪烁）
- [ ] 路由切换（`/` → 404 页）顶部进度条正常
- [ ] 404 页面展示 + 返回首页可导航
- [ ] 错误边界（模拟异常）展示错误信息 + 重试按钮

### 主题与响应式

- [ ] 浅色 / 深色 / 系统三种主题切换生效且持久化（刷新保留）
- [ ] Dark Mode 下组件配色完整（无漏配）
- [ ] 移动端（<768px）响应式布局正常

### 无障碍

- [ ] 键盘焦点可见（focus-visible ring）
- [ ] 交互元素有可访问名称（ARIA）

## 文档一致性

- [ ] `docs/README.md` 的索引链接都能打开
- [ ] 改动涉及的路径、命令、路由、字段名与代码一致
- [ ] 新增/移动/删除的文档已更新索引
- [ ] 已完成阶段计划已 `git mv` 到 `docs/archive/`
- [ ] `CHANGELOG.md` 的 Unreleased 已迁移到版本节
- [ ] `docs/writing-style.md` 的提交前检查命中项已人工处理
- [ ] 本次改动涉及的 postmortem 高频雷区已对照检查

## 稳定性

- [ ] 无网络 / 错误响应时页面不白屏
- [ ] 控制台无报错 / 警告
- [ ] Lighthouse（可选）基础通过

## 发布步骤

1. 更新 `CHANGELOG.md`（Unreleased → 版本节）
2. 更新 `docs/README.md` 索引和文档一致性清单（如涉及新增/移动文档）
3. 合并到 `main` → Vercel Production 部署
4. 冒烟清单在 Production URL 上勾选
5. 打 Tag：`git tag v0.1.0 && git push --tags`
6. GitHub Release：`gh release create v0.1.0 --generate-notes`

> 真机 / 真实环境验证由作者在发布前执行，勾选并记录日期。
