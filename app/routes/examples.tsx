import type { Route } from './+types/examples'
import { Link } from 'react-router'
import { ExampleNav } from '~/components/shared/example-nav'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '~/components/ui/card'
import { generateSEOMeta } from '~/lib/seo'

const EXAMPLES = [
  {
    description: '单输入框宽容解析、分列滚轮与 12 小时制展示。',
    title: '时间输入',
    to: '/example',
  },
  {
    description: '拖拽或点击选择，图片自动生成缩略图并支持大图预览。',
    title: '文件选择器',
    to: '/example/files',
  },
] as const

export function meta(): Route.MetaDescriptors {
  return generateSEOMeta({
    title: '组件示例',
    description: '脚手架内置组件的可交互示例',
  })
}

export default function Examples() {
  return (
    <div className="min-h-dvh bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <ExampleNav />
          <h1 className="font-heading font-semibold text-2xl text-foreground">
            组件示例
          </h1>
          <p className="text-muted-foreground text-sm">
            打开即可试用。示例数据只在浏览器本地处理，不会上传。
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {EXAMPLES.map(example => (
            <Card key={example.to}>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardPanel className="pt-0">
                <Link
                  className="text-primary text-sm hover:underline"
                  to={example.to}
                >
                  打开示例 →
                </Link>
              </CardPanel>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
