# SEO 与分享元信息

**项目**: react-router-cossui | **最后更新**: 2026-11-18

> 脚手架不产出内容，但每个路由都在产出可被抓取的 HTML。本页写「什么都还没有时也必须成立」的约束；业务字段由 fork 后补。

## 1. 单一出口

所有页面的 meta 都走 `app/lib/seo.ts` 的 `generateSEOMeta()`，不要在路由里手写 `<meta>`。

| 函数 / 常量         | 作用                                                        |
| ------------------- | ----------------------------------------------------------- |
| `generateSEOMeta()` | title、description、OG、Twitter、robots、canonical、JSON-LD |
| `generateTitle()`   | 统一 `页面名 — 站点名` 格式，并收在 60 字内                 |
| `truncateTitle()`   | 按词边界截断，避免在词组中间切断                            |
| `TITLE_MAX_LENGTH`  | 60，搜索结果标题的显示上限                                  |
| `mergeMeta()`       | 父路由与子路由的 meta 合并                                  |

- fork 后先改 `siteConfig`（名称、描述、URL、OG 图），它决定所有页面的默认值。
- `siteConfig.url` 必须是生产环境的绝对地址：canonical、OG、JSON-LD 都从它派生。

## 2. 每个路由必须有的

- `meta` 导出：至少带 `title`；内容页带 `canonical`。
- 唯一 `h1`，不跳级（`h1` → `h2` → `h3`）。
- 站内链接用 `<Link>`：抓取工具沿 `<a href>` 走，Router 的客户端跳转会同时输出可抓取的 href。
- 404 返回真正的 404 状态码，不要用 200 + 「未找到」文案（软 404）。
- 不需要被索引的页面显式传 `noIndex: true`；不要靠 `robots.txt` 兜住单页。

## 3. 分享卡片

- 没有 `og:image` 时，社交平台退化成小卡片。每个可分享页面都要有图，最小可用方案是复用站点 OG 图。
- `og:image` 用绝对 URL；相对路径在部分平台上会失效（`generateSEOMeta` 已补全）。
- 图片建议 1200×630。缩略图别拿原图顶替，加载慢会拖累首屏。

## 4. 结构化数据

- `jsonLd` 入参支持单个对象或数组。常用类型：`WebSite`（首页）、`Organization`（组织）、`BreadcrumbList`（层级）、`Article` / `Product`（内容）。
- 实体层不要漏：站点有主体（组织、作者、商家）时同时输出 `WebSite` 与对应实体，只给 `BreadcrumbList` 等于放弃最该拿的信号。
- 序列化与转义由框架负责（`script:ld+json`），不要自己拼字符串。理由见 [security.md §2](../engineering/security.md)。

## 5. 站点级文件

| 文件                          | 现状                                                        |
| ----------------------------- | ----------------------------------------------------------- |
| `public/robots.txt`           | 已有，`Sitemap` 指向 `example.com`；fork 后必须改成真实域名 |
| `public/manifest.webmanifest` | 已有，名称与颜色随 `siteConfig` 改                          |
| `sitemap.xml`                 | 未生成。路由变多后需要接入生成方案，动态路由从数据源派生    |

- `robots.txt` 只挡不该抓的路径（后台、内部接口），不挡公开页面。
- sitemap 的 `lastmod` 要真实：全部写成构建时间等于没有信号。

## 6. 交付前检查

- 每个路由的 `<title>` 唯一且不超过 60 字（`generateTitle` 已兜住长度）。
- 每个路由有 `description`，长度 80–160 字。
- 页面有唯一 `h1`，层级不跳。
- 分享链接预览有标题、描述与图。
- 未知路径返回 404 状态码。
- 不需要索引的页面带 `noindex`。
- `robots.txt`、`manifest.webmanifest` 里没有 `example.com` 残留。
