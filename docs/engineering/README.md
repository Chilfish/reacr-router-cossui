# 工程规范（Engineering）

本目录存放项目级工程规范与流程说明。

## 文档索引

| 文档                                           | 说明                                                | 何时阅读         |
| ---------------------------------------------- | --------------------------------------------------- | ---------------- |
| [git-workflow.md](./git-workflow.md)           | 分支模型 / Commit 规范 / 验证门禁 / 发布 / 代码审查 | 每次 commit / PR |
| [code-style.md](./code-style.md)               | TypeScript / React / Tailwind 命名与约定、测试规范  | 写代码前         |
| [release-checklist.md](./release-checklist.md) | 里程碑发布清单（验证门禁 + 冒烟 + 发布步骤）        | 发布前           |
| [writing-style.md](../writing-style.md)        | 文档与界面文案的语气、用词、事实性要求              | 写文档 / 文案前  |

## 约定

1. 每个 commit / PR 必须通过验证门禁：`typecheck` + `lint` + `build` + `test` + `test:coverage`
2. 禁止 `--no-verify` 跳过 lefthook 钩子；钩子失败必须修复根因
3. 测试必须能失败：故意改坏被测行为时相关测试应变红
4. 新 Bug 模式写 postmortem，预防项同步 `AGENTS.md` 或本目录规范
5. 业务子系统（如上传、认证）落地后，在此新增对应工程文档（如 `api.md` / `data-flow.md`）
