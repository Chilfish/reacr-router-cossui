# 安全基线

**项目**: react-router-cossui | **最后更新**: 2026-11-18

> 本页是脚手架的默认安全姿态。业务落地后按实际数据边界补充，不要假设「已经安全」。
> 每条都标注了它在哪一层生效，以及失效时怎么验证。

## 1. 数据边界

react-router-cossui 是 SSR 应用，服务端与浏览器共享一套路由代码。边界只有两条：

| 位置                  | 允许放什么                                              |
| --------------------- | ------------------------------------------------------- |
| `app/lib/*.server.ts` | 密钥、数据库连接、内部接口凭据                          |
| 其余 `app/**`         | 只放可以进浏览器的东西；`getPublicEnv()` 白名单之外不给 |

- 客户端模块不能 import `*.server.ts`；React Router 的构建期检查会报错，不要绕过。
- `env.server.ts` 只导出校验后的值，不导出 `process.env` 本身。
- 公开测不出边界：把服务端变量写进组件 props 会在 HTML 里出现，属泄漏。

## 2. 结构化数据的注入面

`generateSEOMeta()` 走 React Router 的 `script:ld+json`，框架内部先 `JSON.stringify` 再转义 `<`、`>`、`&`、U+2028、U+2029。**不要自己拼 `<script>` 字符串**：`JSON.stringify` 不转义 `<`，标题里出现 `</script>` 就能闭合标签。

- 需要原生 JSON-LD 时仍走 `jsonLd` 入参，不要用 `dangerouslySetInnerHTML`。
- 全仓库不接受 `dangerouslySetInnerHTML` / `innerHTML`；确有必要时必须在 PR 里说明输入来源与转义方式。

## 3. 响应头

安全头按部署形态配置。Vercel 走 `vercel.json` 的 `headers`，自托管走反向代理；不要写进 React Router 的 `headers` 导出，那里只影响路由响应且与静态资源不一致。

必要项：

| 头                          | 值                                                           |
| --------------------------- | ------------------------------------------------------------ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`（确认子域全 HTTPS 后） |
| `X-Content-Type-Options`    | `nosniff`                                                    |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                            |
| `Content-Type`              | 文本响应带 `; charset=utf-8`                                 |

- `http://` 必须 301 到 `https://`。两者都能返回 200 时，同一内容存在明文副本，HSTS 也没机会生效。
- `Content-Type` 缺 `charset` 时按头解码的客户端会退回 latin-1，中文字节数被算成 3 倍。`.md` 一类响应尤其要显式写。

## 4. CSP

上线 CSP 前先列出实际会加载的外部资源，否则会把站点自己的脚本挡掉（例如自动注入的统计脚本）：

```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self';
form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self';
manifest-src 'self'; media-src 'self'; worker-src 'self' blob:
```

- `style-src` 的 `'unsafe-inline'` 是 Tailwind 运行期样式与第三方浮层定位的现实约束；`script-src` 不允许 `'unsafe-inline'`。
- 用 nonce 而不是 `'unsafe-inline'`：`root.tsx` 已通过 `useNonce()` 把 nonce 传给 `<Scripts>`，接入时给内联脚本一并带上。
- CSP 生效后必须复查控制台 `errors-in-console`：被挡掉的脚本是静默的数据丢失。

## 5. 输入与 URL

- 结果集筛选、分页、排序写进 URL 后要校验类型与范围，不要直接透传给查询。
- 渲染用户内容时不要拼 HTML；React 默认转义已经覆盖大部分场景。
- 外部链接带 `rel="noreferrer"`；站外资源用 `<a href>` 是唯一允许的裸链接场景。
- 分享链接里的凭据（访问口令、邀请码）至少 32 位随机字符，可轮换，不写进文档与日志。

## 6. 验证

```bash
bun run typecheck
bun run build
bun run test
```

部署后逐项确认：

- `curl -I https://<host>/` 返回 HSTS、`nosniff`、`referrer-policy`、带 `charset` 的 `Content-Type`。
- `curl -I http://<host>/` 返回 301 到 https。
- 浏览器控制台无 CSP 报错，结构化数据能被 `JSON.parse` 还原。
- 未登录访问受限路由返回 401 / 403 且不泄露内容；错误响应带 `no-store`。
