# SEO 工具

> `~/lib/seo.ts`

## 概述

提供一组轻量级 SEO 工具，用于生成 React Router v7 路由的 meta 标签。集中管理站点配置，避免在每个路由中重复编写相同的 OG 标签。

## 站点配置

`siteConfig` 对象包含站点的全局默认值：

```ts
import { siteConfig } from '~/lib/seo'

// fork 后修改这些值：
siteConfig.name        // 站点名称
siteConfig.description // 站点描述
siteConfig.url         // 站点 URL（用于 OG 和 canonical）
siteConfig.ogImage     // 默认 OG 图片路径
siteConfig.themeColor  // 主题色（#f5f9fb）
```

## API

### generateSEOMeta(input?)

生成一组标准 SEO meta 标签。返回 `MetaDescriptor[]`，可直接用于 React Router 的 `meta` 导出。

```ts
import { generateSEOMeta } from '~/lib/seo'

// 基本用法：只覆盖标题
export const meta = () => generateSEOMeta({ title: '关于我们' })

// 完整用法
export const meta = ({ data }) => generateSEOMeta({
  title: data?.post.title,
  description: data?.post.excerpt,
  canonical: `/posts/${data?.post.slug}`,
  ogImage: data?.post.ogImage,
  noIndex: data?.post.draft,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data?.post.title,
  },
})
```

#### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | 站点名称 | 页面标题（自动添加 " — 站点名" 后缀） |
| `description` | `string` | `siteConfig.description` | 页面描述 |
| `canonical` | `string` | — | 规范 URL 路径（如 `/about`） |
| `ogImage` | `string` | `siteConfig.ogImage` | OG 图片 URL |
| `noIndex` | `boolean` | `false` | 禁止搜索引擎索引 |
| `jsonLd` | `object \| object[]` | — | JSON-LD 结构化数据 |

### generateTitle(pageTitle?)

生成标准格式页面标题。

```ts
generateTitle('首页')       // → "首页 — React Router App"
generateTitle()             // → "React Router App"
```

## 子路由覆盖

React Router v7 的 meta 合并机制：子路由导出的 meta 会覆盖父路由的同 key 标签。这意味着：

```ts
// root.tsx — 全局默认
export const meta = () => generateSEOMeta()

// routes/blog.tsx — 子路由覆盖标题、描述
export const meta = () => generateSEOMeta({
  title: '博客',
  description: '最新文章',
})
```

子路由只需要传想要覆盖的字段，其余自动继承根路由的默认值。

## 结构化数据（JSON-LD）

```ts
export const meta = () => generateSEOMeta({
  title: '关于我们',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'My Company',
    url: 'https://example.com',
  },
})
```

生成标签：
```html
<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "Organization", ... }
</script>
```

## 新建路由的 SEO 检查清单

- [ ] 导出了 `meta` 函数？
- [ ] 使用了 `generateSEOMeta()`？
- [ ] 设置了合适的 `title`？
- [ ] 特殊页面（404、错误页）设置了 `noIndex: true`？
- [ ] 有内容的页面设置了 `description`？
- [ ] `siteConfig.url` 已更新为实际域名？
