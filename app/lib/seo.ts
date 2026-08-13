import type { MetaDescriptor, MetaFunction } from 'react-router'

/**
 * 站点级 SEO 默认配置。
 * fork 后修改这里的值为你的站点信息即可全局生效。
 */
export const siteConfig = {
  name: 'React Router App',
  shortName: 'RR App',
  description: '基于 React Router v8 + coss-ui 的全栈 Web 应用',
  url: 'https://example.com',
  ogImage: '/og-image.png',
  twitterHandle: '@yourhandle',
  locale: 'zh_CN',
  themeColor: '#f5f9fb',
  backgroundColor: '#f5f9fb',
} as const

/**
 * 根据 title 生成标准的页面标题（"页面名 — 站点名" 格式）。
 */
export function generateTitle(pageTitle?: string): string {
  if (!pageTitle)
    return siteConfig.name
  return `${pageTitle} — ${siteConfig.name}`
}

export interface SEOMetaInput {
  /** 页面标题（不包含站点名后缀） */
  title?: string
  /** 页面描述，默认使用站点描述 */
  description?: string
  /** 页面规范 URL（绝对路径，如 `/about`） */
  canonical?: string
  /** OG 图片，默认使用站点 OG 图片 */
  ogImage?: string
  /** 是否禁止搜索引擎索引 */
  noIndex?: boolean
  /** JSON-LD 结构化数据 */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * 生成一组标准 SEO meta 标签。
 *
 * 适用于 React Router v8 的 `meta` 导出函数。
 *
 * @example
 * ```ts
 * export const meta: Route.MetaFunction = () =>
 *   generateSEOMeta({ title: '关于我们', description: '了解更多' })
 * ```
 */
export function generateSEOMeta(input: SEOMetaInput = {}): MetaDescriptor[] {
  const {
    title,
    description = siteConfig.description,
    canonical,
    ogImage = siteConfig.ogImage,
    noIndex = false,
    jsonLd,
  } = input

  const pageTitle = generateTitle(title)
  const pageUrl = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteConfig.url}${ogImage}`

  const meta: MetaDescriptor[] = [
    // 基础
    { title: pageTitle },
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: canonical ? 'article' : 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: imageUrl },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:locale', content: siteConfig.locale },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:creator', content: siteConfig.twitterHandle },

    // 机器人
    { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' },
  ]

  // Canonical URL
  if (canonical) {
    meta.push({ tagName: 'link', rel: 'canonical', href: pageUrl } satisfies MetaDescriptor)
  }

  // JSON-LD 结构化数据
  if (jsonLd) {
    meta.push({ 'script:ld+json': jsonLd } satisfies MetaDescriptor)
  }

  return meta
}

/**
 * React Router v8 的 meta 合并工具。
 * 子路由的 meta 会覆盖父路由中相同 key 的 meta 标签。
 *
 * @example
 * ```ts
 * // 在父路由中
 * export const meta = mergeMeta<typeof loader>(({ data }) =>
 *   generateSEOMeta({ title: data?.title })
 * )
 * ```
 */
export function mergeMeta<Loader extends (...args: any[]) => unknown>(
  fn: MetaFunction<Loader>,
): MetaFunction<Loader> {
  return fn
}
