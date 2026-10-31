# 代码审查记录（Reviews）

按次记录代码审查。审查问题按严重度分级（Z/R/E/U，见模板），并登记进 `docs/planning/backlog.md` 的「审查承接区」排期。

## 约定

- 文件名：`review-YYYY-MM-DD-<主题>.md`，从 [TEMPLATE.md](./TEMPLATE.md) 复制
- 时机：里程碑、阶段或较大重构完成后做一次；不必每次小改动都写
- 每条问题带编号、文件位置和建议修法
- 已修问题在原记录中勾选并注明 commit
- 同类问题复发时升级为 postmortem，或同步到「高频雷区」
- 审查结论只写事实：审了什么、发现了什么、修了什么、哪些没修

## 审查清单

- [ ] 遵循 [code-style.md](../engineering/code-style.md)：无 `any`、`catch` 用 `unknown`、三态覆盖
- [ ] SSR 安全：渲染期不读 `window` / `document` / `localStorage`
- [ ] 浏览器 bundle 安全：服务端代码未泄漏到客户端
- [ ] 状态订阅用 selector；persist 迁移显式
- [ ] 导航使用 `<Link>` / `useSubmit()` / `navigate()`
- [ ] 设计 Token：无硬编码颜色，浅色/深色同时成立
- [ ] 无障碍：焦点可见，图标按钮有可访问名称
- [ ] 测试能失败：故意改坏实现时相关测试会变红
- [ ] 无 `skip` / `only` / 空跑 / 源码扫描冒充行为断言
- [ ] 文档已同步：`docs/README.md` 索引、相关文档、`CHANGELOG.md`
- [ ] 文档与界面文案符合 [writing-style.md](../writing-style.md)
- [ ] 路径、命令、路由与代码一致；无死链
- [ ] 新 Bug 模式已写 postmortem

## 索引

| 日期           | 范围         | 分支/commit     | 摘要       |
| -------------- | ------------ | --------------- | ---------- |
| （YYYY-MM-DD） | （审查范围） | `main @ <hash>` | （一句话） |

> 尚无审查记录。首次审查后在此登记。

## 审查方式

- 建议采用多轴视角：安全 / 授权 / 正确性 / 资源纪律 / 工程文化 / UI 体验
- 对照 `docs/postmortem/README.md` 的「模板基线雷区」自查已修或复发
- 上轮问题逐条核验，避免「审了不改」
