import type * as React from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '~/lib/utils'

const LINKS = [
  { href: '/', label: '首页' },
  { href: '/examples', label: '示例' },
  { href: '/example', label: '时间输入' },
  { href: '/example/files', label: '文件选择器' },
] as const

export function ExampleNav({
  className,
}: {
  className?: string
}): React.ReactElement {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="示例导航"
      className={cn(
        'flex flex-wrap items-center gap-1 text-sm',
        className,
      )}
    >
      {LINKS.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-md px-2 py-1 transition-colors',
              active
                ? 'bg-accent font-medium text-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
            key={link.href}
            to={link.href}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
