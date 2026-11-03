# 依赖版本约束

**项目**: react-router-cossui | **最后更新**: 2026-11-03

少数依赖的可用版本由工具链决定，不能跟着最新版走。改 `package.json` 前先查本页。

## 版本锁定表

| 依赖                | 当前版本                                       | 锁定方式       | 约束来源                                               |
| ------------------- | ---------------------------------------------- | -------------- | ------------------------------------------------------ |
| `typescript`        | `6.0.3`（精确，无 `^`）                        | `package.json` | `typescript-eslint@8.72.x` 的 peer 为 `>=4.8.4 <6.1.0` |
| `eslint`            | `^10.14.0`                                     | caret          | `typescript-eslint` peer 支持 `^10.0.0`，可跟随 minor  |
| `typescript-eslint` | `8.72.0`（经 `@antfu/eslint-config` 间接引入） | `bun.lock`     | 跟随 `@antfu/eslint-config` 与上游发版                 |

`typescript` 精确锁定后，`bun install` / `bun update` 不会改动它；`bun update --latest typescript` 会。

## TypeScript 停在 6.x 的原因

1. TypeScript 7.0（2026-07-08 发布，Go 原生移植）不提供编译器编程 API。`require("typescript")` 只导出 `version` 与 `versionMajorMinor`。
2. `typescript-eslint` 经 `@typescript-eslint/typescript-estree` 直接调用同步 API（如 `ts.Extension.Cjs`）。装上 7.0 后 `bun run lint` 崩溃：`TypeError: Cannot read properties of undefined (reading 'Cjs')`。
3. 包管理器的 peer 校验会先拦截：`@typescript-eslint/parser` 等包的 peer 是 `typescript >=4.8.4 <6.1.0`，npm 报 `ERESOLVE`。
4. TypeScript 7.1（2026-10-20 beta）提供新 API，入口为 `typescript/sync`、`typescript/async`、`typescript/ast`、`typescript/fs`。typescript-eslint 的适配在 PR #12803，截至 2026-11-03 未发布。

7.1 正式版发布后仍需等 typescript-eslint 跟进。解除锁定的条件：`typescript-eslint` 发布把 peer 上限提到 7.1 的版本，届时同步升级 `typescript` 并复查 `tsconfig.json`。

## 验证

```bash
bun pm ls typescript     # 期望 6.0.x；npm 用户用 npm ls typescript
bun run lint             # estree 崩溃或版本警告，说明已超出 peer range
bun run typecheck
```

升级 TS 主版本前还要复查 `tsconfig.json`：7.0 改了 `strict`、`module`、`target`、`rootDir`、`types` 的默认值，并移除了 `baseUrl`、`moduleResolution: node`、`target: es5` 等选项。

## 提前使用 TS 7 编译速度的官方方案

`typescript` 指向 `npm:@typescript/typescript6@^6.0.2`，另加 `@typescript/native: npm:typescript@^7.0.2` 别名：lint 走 6，`tsc` 走 7。本仓库未采用，因为 `typecheck` 脚本要在两套编译器下保持一致行为，成本大于收益。

## 相关文档

- [postmortem 基线雷区「依赖跨主版本」](../postmortem/README.md)
- 上游：[typescript-eslint #10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)、[TypeScript 7.0 发布说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
