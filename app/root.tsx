import type { Route } from './+types/root'
import { AlertTriangle, Loader2 } from 'lucide-react'
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { ThemeProvider } from '~/components/shared/ThemeProvider'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import stylesheet from './app.css?url'
import { ProgressBar } from './components/shared/progress-bar'
import { Button } from './components/ui/button'
import { useNonce } from './hooks/use-nonce'
import { generateSEOMeta, siteConfig } from './lib/seo'

export const meta: Route.MetaFunction = () =>
  generateSEOMeta()

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+SC:wght@400;500;700&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap',
  },
  { rel: 'icon', type: 'image/svg+xml', href: '/vite.svg' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/manifest.webmanifest' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useNonce()

  return (
    <html
      lang="zh"
      className="touch-manipulation overflow-x-hidden"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={siteConfig.themeColor} />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
        <link rel="stylesheet" href={stylesheet} precedence="high" />
      </head>
      <body>
        <ProgressBar />

        <ToastProvider>
          <AnchoredToastProvider>
            {children}
          </AnchoredToastProvider>
        </ToastProvider>

        <ScrollRestoration getKey={location => location.pathname} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}

export function HydrateFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">加载中...</p>
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = '出错了'
  let details = '发生了意外错误，请稍后重试。'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404
      ? '页面未找到'
      : '发生错误'
    details = error.status === 404
      ? '您要查找的页面不存在。'
      : error.data?.message || error.statusText
  }
  else if (error instanceof Error) {
    message = error.message
    stack = error.stack
  }

  console.error('ErrorBoundary caught an error:', error)

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:max-w-3xl max-w-full mx-auto text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">
          {message}
        </h1>
        <p className="text-muted-foreground mb-6">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-muted text-muted-foreground rounded text-left text-sm">
            <code>{stack}</code>
          </pre>
        )}
        <div className="mt-8 flex items-center gap-4">
          <Button variant="link" render={<Link to="/" />}>
            返回首页
          </Button>
          <Button onClick={() => window.location.reload()}>
            刷新重试
          </Button>
        </div>
      </div>
    </Layout>
  )
}
