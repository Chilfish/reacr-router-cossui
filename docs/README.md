# 项目文档

## 文档索引

| 文档        | 路径                                | 何时阅读                                 |
| ----------- | ----------------------------------- | ---------------------------------------- |
| 需求规格    | `requirements/requirements-spec.md` | 新增功能、判断功能边界                   |
| 用户故事    | `requirements/user-stories.md`      | 理解用户需求、设计新特性                 |
| 系统架构    | `planning/architecture.md`          | 任何架构级变更前（ADR 记录）             |
| 任务清单    | `planning/backlog.md`               | 未决任务 + 排期                          |
| 审查记录    | `reviews/`                          | 了解已知问题清单                         |
| Git 流程    | `engineering/git-workflow.md`       | 每次 commit / PR                         |
| 代码规范    | `engineering/code-style.md`         | 写代码前                                 |
| 发布清单    | `engineering/release-checklist.md`  | 里程碑发布前                             |
| 事后分析    | `postmortem/README.md`              | 写代码前自查「高频雷区」，防复现         |
| 开发日志    | `development-log/README.md`         | 了解历史决策                             |
| UI 设计规范 | `ui-design/OVERVIEW.md`             | 涉及 UI 时（设计 Token、排版、组件索引） |
| 组件规范    | `ui-design/components/GENERAL.md`   | 使用 coss-ui 原子组件时                  |
| SEO 工具    | `ui-design/seo.md`                  | 新增路由写 `meta` 时                     |
| 共享组件    | `shared-components/README.md`       | 使用脚手架自带全局组件时                 |

## 文档关系

```
requirements/（需求真相源 —— 描述「要做什么」）
  ├── requirements-spec.md   ← FR 编号从这里产生
  └── user-stories.md        ← 用户视角的表达

planning/（规划与执行 —— 描述「怎么做、做到哪了」）
  ├── architecture.md        ← ADR 记录架构决策
  ├── backlog.md             ← 未排程任务候选
  └── todo-*.md             ← 当前阶段行动计划

engineering/（工程规范 —— 描述「怎么实现」）
  └── git-workflow.md / code-style.md / release-checklist.md

reviews/ + postmortem/ + development-log/（复盘与演进 —— 描述「踩了什么坑、怎么不再踩」）
```

## 约定

1. 所有文档用中文（根级 README / CHANGELOG / CONTRIBUTING / LICENSE 除外）
2. 需求变更时同步更新 `requirements/requirements-spec.md` 并记录日期
3. 关键架构决策记录在 `planning/architecture.md`（ADR 格式）
4. 所有 PR 更新 `CHANGELOG.md`（Unreleased 节）
5. 开发日志按天记录在 `development-log/YYYY-MM-DD.md`
6. 已完成阶段的计划文档用 `git mv` 移到 `archive/`；存档不主动读取
7. 新 Bug 模式写 postmortem，预防项同步到 `CLAUDE.md` / `engineering/git-workflow.md`
