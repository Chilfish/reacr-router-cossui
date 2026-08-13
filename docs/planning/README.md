# 规划与架构（Planning）

本目录记录系统架构决策（ADR）与任务规划。文档关系：

```
requirements/（需求真相源 —— 描述「要做什么」）
planning/（规划与执行 —— 描述「怎么做、做到哪了」）
  ├── architecture.md   ← ADR 记录架构决策
  ├── backlog.md        ← 未排程任务候选
  └── todo-*.md        ← 当前阶段行动计划
```

## 文档索引

| 文档                                 | 说明                               | 何时阅读         |
| ------------------------------------ | ---------------------------------- | ---------------- |
| [architecture.md](./architecture.md) | 系统架构总览 + ADR 记录            | 任何架构级变更前 |
| [backlog.md](./backlog.md)           | 未决任务清单（含前置条件）         | 规划下一阶段任务 |
| `todo-*.md`                          | 当前阶段行动计划（新建后在此登记） | 当前阶段         |

## 约定

1. 关键架构决策（ADR）格式：`ADR-NNN`，追加到 `architecture.md`
2. 阶段计划用 `todo-<kebab-case>.md`，完成或取消后用 `git mv` 移到 `archive/`
3. 审查问题按编号承接进 backlog 或 todo-*，交付后标记 ✅ 并记录 commit hash
