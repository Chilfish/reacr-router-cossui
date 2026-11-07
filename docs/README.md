# 项目文档

> **本文档是项目文档的唯一入口。** 处理任务前先读本页，再按「按任务导航」读取对应文档，不要一次性全读。

## 一、文档目录

```
docs/
├── README.md                 # 本文档（唯一入口）
├── writing-style.md          # 文档与界面文案的写作规范
├── requirements/             # 需求真相源（PRD / 用户故事 / 验收标准）
├── planning/                 # 架构 ADR / backlog / 阶段计划
├── engineering/              # 工程规范（code-style / git-workflow / release-checklist）
├── ui-design/                # UI 设计系统（Token / 页面骨架 / 三态 / 交互 / 研究）
├── postmortem/               # 事故复盘与高频雷区
├── reviews/                  # 代码审查记录
├── development-log/          # 按天开发日志
└── archive/                  # 已完成阶段计划存档（不主动读取）
```

## 二、按任务导航

| 任务场景                | 先读                                                                                                                                                                                                                                                                | 说明                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 新增功能 / 判断功能边界 | [requirements-spec.md](./requirements/requirements-spec.md) + [user-stories.md](./requirements/user-stories.md)                                                                                                                                                     | FR 编号、验收标准、范围                       |
| 架构级变更              | [architecture.md](./planning/architecture.md)                                                                                                                                                                                                                       | 先读 ADR，再补新 ADR                          |
| 规划下一阶段            | [backlog.md](./planning/backlog.md)                                                                                                                                                                                                                                 | 未决任务、前置条件、来源                      |
| 写代码                  | [code-style.md](./engineering/code-style.md) + [writing-style.md](./writing-style.md)                                                                                                                                                                               | 命名、类型、测试、文案                        |
| Commit / PR             | [git-workflow.md](./engineering/git-workflow.md) + [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md)                                                                                                                                          | 提交纪律、验证门禁、审查清单                  |
| 里程碑发布              | [release-checklist.md](./engineering/release-checklist.md)                                                                                                                                                                                                          | 验证、冒烟、文档一致性                        |
| 写代码前防复现          | [postmortem/README.md](./postmortem/README.md)                                                                                                                                                                                                                      | 模板基线雷区、高频雷区、高危文件              |
| 代码审查                | [reviews/README.md](./reviews/README.md) + [reviews/TEMPLATE.md](./reviews/TEMPLATE.md)                                                                                                                                                                             | 审查视角、问题分级、承接流程                  |
| 修改 UI / 组件          | [ui-design/README.md](./ui-design/README.md)；按需读 [visual.md](./ui-design/visual.md)、[patterns.md](./ui-design/patterns.md)、[GENERAL.md](./ui-design/GENERAL.md)、[time-input.md](./ui-design/time-input.md)、[file-dropzone.md](./ui-design/file-dropzone.md) | Token、页面骨架、原子组件、时间输入、文件选择 |
| 写空/加载/错误状态      | [ui-design/feedback.md](./ui-design/feedback.md) + [ui-design/interaction.md](./ui-design/interaction.md)                                                                                                                                                           | 三态、浮层、Toast、导航                       |
| 评审视觉规则            | [ui-design/research.md](./ui-design/research.md)                                                                                                                                                                                                                    | 来源、正反例、评审方法                        |
| 写文档 / 界面文案       | [writing-style.md](./writing-style.md)                                                                                                                                                                                                                              | 语气、用词、事实性、反例                      |
| 了解历史决策            | [development-log/](./development-log/) + [archive/](./archive/)                                                                                                                                                                                                     | 按日期查阅；存档不主动读                      |

## 三、文档生命周期

```
需求与规划 → 工程规范 → 功能实现 → 反馈沉淀 → 存档
requirements/ planning/ → engineering/ → 代码 → postmortem/ reviews/ development-log/ → archive/
```

### 何时写入

| 事件               | 动作                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| 新功能 / 需求变更  | 先更新 `requirements/` 与 `planning/backlog.md`，再实现                    |
| 架构级决策         | 以 ADR 追加到 `planning/architecture.md`                                   |
| 新 Bug 模式 / 返工 | 写 `postmortem/0NN-*.md`，教训进入「高频雷区」                             |
| 每次代码审查       | 记录 `reviews/review-YYYY-MM-DD-<主题>.md`，问题登记 backlog「审查承接区」 |
| 每天收尾           | 记录 `development-log/YYYY-MM-DD.md`                                       |
| 阶段计划完成       | `git mv` 到 `archive/`，更新本页索引                                       |
| 里程碑发布         | 走 `engineering/release-checklist.md`                                      |

## 四、文档约定

1. **语言**：文档用简体中文；根级 README / CHANGELOG / CONTRIBUTING / LICENSE 用英文。
2. **单一入口**：新增、删除、移动文档时同步更新本页表格；索引只列存在的文件。
3. **文档即事实**：路径、命令、路由、字段名必须与当前代码一致；改代码时同步清理旧引用。
4. **不把计划当现状**：未完成的内容放 backlog 或 `todo-*.md`，正文只写已经成立的事实。
5. **写作**：按 [writing-style.md](./writing-style.md) 执行。不堆形容词和黑话，数字带单位，链接写清指向。
6. **复盘 blameless**：postmortem 归因于系统条件，不归因于个人。
7. **存档不主动读取**：`archive/` 只作历史参考。

## 五、验证门禁

每个 commit / PR 合并前必须通过：

```bash
bun run typecheck
bun run lint
bun run build
bun run test
bun run test:coverage   # 覆盖率门禁（app/lib 行覆盖 ≥ 55%）
```

- 自动化入口：`lefthook`（pre-commit / pre-push）+ [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- 禁止 `--no-verify` 跳过钩子；失败必须修根因
- 不接受「既有红灯」作为基线
- 测试必须能失败：故意改坏被测行为时，相关测试应变红（见 [code-style.md](./engineering/code-style.md)「验证与诚实」）

## 六、根目录文档

| 文档                                  | 说明                                           |
| ------------------------------------- | ---------------------------------------------- |
| [README.md](../README.md)             | 项目介绍、技术栈、快速开始                     |
| [AGENTS.md](../AGENTS.md)             | AI Agent 协作指南（意图 → 文件映射、强制规范） |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 人类贡献者指南                                 |
| [CHANGELOG.md](../CHANGELOG.md)       | 变更日志                                       |
| [LICENSE](../LICENSE)                 | 许可证                                         |
