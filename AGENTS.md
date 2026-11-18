# AGENTS.md

AI Agent 协作指南。人类贡献者见 [CONTRIBUTING.md](./CONTRIBUTING.md)。
文档唯一入口是 [docs/README.md](./docs/README.md)，文档与界面文案规范见 [docs/writing-style.md](./docs/writing-style.md)。
本文件只放跨任务都成立的约束；目录、映射、完整反例表在文档里，按需读取。

## 项目

React 19 + React Router v8（SSR）+ Tailwind CSS v4 + coss / Base UI 的脚手架。fork 后按真实业务增删路由与组件。

```bash
bun install
bun run dev              # 9080
bun run typecheck        # react-router typegen && tsc
bun run lint             # eslint --fix
bun run test             # vitest
bun run test:coverage    # app/lib 行覆盖 ≥ 55%
bun run build
```

## 先读哪里

| 场景               | 文档                                                       |
| ------------------ | ---------------------------------------------------------- |
| 任何任务入口       | `docs/README.md`（按任务导航）                             |
| 目录、数据流、ADR  | `docs/planning/architecture.md`（含「意图 → 文件」）       |
| 写代码             | `docs/engineering/code-style.md`                           |
| 写 UI              | `docs/ui-design/README.md` → `GENERAL.md` / `patterns.md`  |
| 写码前自查雷区     | `docs/postmortem/README.md`                                |
| 性能预算           | `docs/engineering/performance.md`                          |
| 安全基线           | `docs/engineering/security.md`                             |
| 依赖版本约束       | `docs/engineering/dependencies.md`                         |
| Commit / PR / 发布 | `docs/engineering/git-workflow.md`、`release-checklist.md` |

## 强制规范

1. **文档先行**：先在 `docs/planning/backlog.md` 或方案文档登记，再写代码；改文档同步改索引。
2. **验证必须能失败**：故意改坏被测行为时测试要变红。禁止空跑、全 `skip`、`only`、源码扫描冒充行为断言。
3. **文档即事实**：路径、命令、路由、字段名与代码一致；未做的事写进 backlog，不写成现状。
4. **文案照 `writing-style.md`**：写事实与做法，不用形容词堆砌与口号式对偶。
5. **不复述**：同一规则只留一处，发现矛盾先修再新增。

## 不可协商的技术约束

- **颜色只用 Token**：`bg-background`、`text-muted-foreground`、`border-input`；不写 `#fff`、`rgb()`、`bg-[#...]`，不用 `dark:` 覆盖颜色。
- **组件来自原语**：优先 `~/components/ui/`，交互用 coss / Base UI，不手写弹层与下拉。
- **导航用 Router API**：`<Link>` / `useSubmit()` / `navigate()`；只有外部资源下载用 `<a href>`。
- **数据路径三态**：loading（Skeleton）/ empty（Empty + 下一步）/ error（说明 + 重试）；`0` 只在真实为零时出现。
- **SSR 边界**：`window` / `document` / `localStorage` / `matchMedia` 只在 effect 或客户端钩子中读取。
- **密钥不进客户端**：服务端逻辑放 `app/lib/*.server.ts`，由 loader / action 调用。
- **首屏别塞全量数据**：loader 只返回首屏需要的字段，完整数据走分页或独立接口（见 `performance.md`）。

## 维护本文件

- 控制在 80 行内（ADR-006）。新增内容前先判断归属：根文件 / 领域文档 / skill。
- 只在 Agent 同类错误出现第二次时加规则；模型能自己做对后删除。
- 目录树、依赖清单、完整反例表不回根文件。
