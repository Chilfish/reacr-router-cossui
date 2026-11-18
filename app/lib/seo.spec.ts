import { describe, expect, it } from 'vitest'
import { generateSEOMeta, generateTitle, mergeMeta, siteConfig, TITLE_MAX_LENGTH, truncateTitle } from './seo'

describe('generateTitle', () => {
  it('withPageTitle_appendsSiteName', () => {
    // Given pageTitle
    const pageTitle = '首页'
    // When
    const result = generateTitle(pageTitle)
    // Then
    expect(result).toBe(`首页 — ${siteConfig.name}`)
  })

  it('withoutPageTitle_returnsSiteName', () => {
    expect(generateTitle()).toBe(siteConfig.name)
  })

  it('withLongPageTitle_staysWithinTitleMaxLength', () => {
    const result = generateTitle('页面标题'.repeat(20))
    expect(result.length).toBeLessThanOrEqual(TITLE_MAX_LENGTH)
    expect(result.endsWith('…')).toBe(true)
  })
})

describe('truncateTitle', () => {
  it('withinLimit_returnsInputUnchanged', () => {
    expect(truncateTitle('短标题', 20)).toBe('短标题')
  })

  it('overLimitWithBoundary_breaksAtLastBoundary', () => {
    expect(truncateTitle('前端工程化实践 与 React Router 的服务端渲染', 20)).toBe('前端工程化实践 与 React…')
  })

  it('overLimitWithoutBoundary_hardTruncates', () => {
    const result = truncateTitle('abcdefghijklmnopqrstuvwxyz', 10)
    expect(result).toBe('abcdefghi…')
  })
})

describe('generateSEOMeta', () => {
  it('defaults_usesSiteConfig', () => {
    const result = generateSEOMeta()
    const title = result.find(r => 'title' in r) as { title: string }
    expect(title.title).toBe(siteConfig.name)
    expect(result).toContainEqual({ name: 'robots', content: 'index, follow' })
  })

  it('withTitle_overridesPageTitle', () => {
    const result = generateSEOMeta({ title: '关于' })
    const title = result.find(r => 'title' in r) as { title: string }
    expect(title.title).toBe(`关于 — ${siteConfig.name}`)
  })

  it('withNoIndex_setsRobotsNoIndex', () => {
    const result = generateSEOMeta({ noIndex: true })
    expect(result).toContainEqual({ name: 'robots', content: 'noindex, nofollow' })
  })

  it('withJsonLd_addsStructuredData', () => {
    const jsonLd = { '@context': 'https://schema.org', '@type': 'Organization' }
    const result = generateSEOMeta({ jsonLd })
    expect(result).toContainEqual({ 'script:ld+json': jsonLd })
  })

  it('withCanonical_addsCanonicalLink', () => {
    const result = generateSEOMeta({ canonical: '/about' })
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: `${siteConfig.url}/about`,
    })
  })
})

describe('mergeMeta', () => {
  it('returnsSameFunction', () => {
    const fn = () => generateSEOMeta({ title: '首页' })
    expect(mergeMeta(fn)).toBe(fn)
  })
})
