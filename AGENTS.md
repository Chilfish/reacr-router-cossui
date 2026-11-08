# AGENTS.md

Agent 的 README，不是项目手册。默认进入每次会话，只写「每次任务都成立、且无法从代码推断」的约束。
完整文档索引见 [docs/README.md](./docs/README.md)；架构与目录见 [docs/planning/architecture.md](./docs/planning/architecture.md)；文案规范见 [docs/writing-style.md](./docs/writing-style.md)。

react-router-cossui：React 19 + React Router v8（SSR）+ Tailwind v4 + coss / Base UI 的脚手架，bun 管理，部署 Vercel。

## 先读哪里

| 任务           | 文档                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| 任何任务开始前 | [docs/README.md](./docs/README.md)（唯一入口，按任务导航）                                                 |
| 需求 / 规划    | [requirements-spec.md](./docs/requirements/requirements-spec.md)、[backlog.md](./docs/planning/backlog.md) |
| 写代码         | [code-style.md](./docs/engineering/code-style.md)                                                          |
| 修改 UI        | [ui-design/README.md](./docs/ui-design/README.md)                                                          |
| 防复现已知问题 | [postmortem/README.md](./docs/postmortem/README.md)                                                        |
| Commit / PR    | [git-workflow.md](./docs/engineering/git-workflow.md)                                                      |

目录树、数据流、ADR 见 `docs/planning/architecture.md`；意图 → 文件映射不在根文件维护。

## 强制规范

1. **文档先行**：先更新 `docs/planning/backlog.md` 或方案文档；过程中同步记录 `docs/development-log/YYYY-MM-DD.md`，不事后补记。
2. **验证先行**：先写可验证的验收标准，再实现；新增纯逻辑必须有同目录 `*.spec.ts`。
3. **验证必须携带信号**：测试要能失败。故意改坏被测行为仍全绿，说明测试无效；不提交空跑、全 `skip`、条件断言或 `only`，不用源码扫描冒充行为断言。
4. **写码前读事后分析**：对照 `docs/postmortem/README.md` 的「模板基线雷区」自查；新 Bug 模式回写 postmortem。
5. **Commit 纪律**：先定 Conventional Commit message 再写代码；超过 10 个文件或 200 行主动拆分。
6. **文档即事实**：路径、命令、路由、字段名与代码一致；改代码时同步更新文档与索引，不留死链。
7. **文案遵循规范**：文档与界面文案按 `docs/writing-style.md` 执行。

## 不可协商的技术约束

```tsx
// 颜色只用 Token，浅色/深色由 .dark 切换
用 bg-background  text-muted-foreground  border-input
不用 #fff  rgb(0,0,0)  bg-[#xxx]  dark:text-white

// 导航与提交
用 <Link to={url}>   useSubmit()   navigate(url)
不用 <a href={url}>    form.submit()  window.location.href
```

- **三态覆盖**：所有数据获取路径必须有 loading（Skeleton/Spinner）、empty（Empty + 描述）、error（消息 + 重试）。细节见 [feedback.md](./docs/ui-design/feedback.md)。
- **组件优先**：复用 `~/components/ui/` 的 coss / Base UI 组件，不手写弹层、下拉或按钮模拟。
- **不用 `any`**：用 `unknown` + 收窄。
- **SSR 安全**：渲染期不读 `window` / `document` / `localStorage`；放到 effect 或客户端钩子。
- **信息密度**：同一数字、名称、状态只出现一次；不写口径脚注与 `详情 →` 入口。见 [information-density.md](./docs/ui-design/information-density.md)。
- **无障碍**：交互元素有可见 focus 环；图标按钮有 `aria-label`。

完整反模式表在 [postmortem/README.md](./docs/postmortem/README.md) 与 [code-style.md](./docs/engineering/code-style.md)。

## 工作流

1. 按 `docs/README.md` 的「按任务导航」读对应文档 → 读相关源码
2. 在 `docs/planning/backlog.md` 登记；复杂功能先写需求与验收标准
3. 读 `docs/postmortem/README.md` 的雷区自查
4. 按「不可协商的技术约束」实现
5. 验证（commit 前，lefthook / CI 强制）：

   ```bash
   bun run typecheck      # 含 react-router typegen
   bun run lint           # ESLint --fix
   bun run test           # Vitest
   bun run test:coverage  # app/lib 行覆盖 ≥ 55%
   bun run build          # 生产构建
   ```

6. Commit：`<type>(<scope>): <description>`，英文祈使句
7. 复盘：新 Bug 模式写 postmortem；审查问题登记 backlog 的「审查承接区」

## 维护本文件

1. 只写每次任务都成立、且 Agent 无法从代码或 `docs/` 推断的约束。
2. 同一规则只留一处；发现矛盾先修再谈新增。
3. Agent 同类错误出现第二次才加规则；模型能自己做对后删除。
4. 多步流程、目录树、依赖清单、完整反模式表不回到根文件。
5. 关键规则用 hook、脚本或 CI 强制执行；本文件只负责说明。
6. 改约定时在同一个 PR 里更新本文件。
7. 新增内容前先问：它属于根文件、领域文档，还是 skill。
