import type { Route } from './+types/example'
import { useState } from 'react'
import { ExampleNav } from '~/components/shared/example-nav'
import { TimeInput } from '~/components/shared/time-input'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '~/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '~/components/ui/field'
import { generateSEOMeta } from '~/lib/seo'

export function meta(): Route.MetaDescriptors {
  return generateSEOMeta({
    title: '时间输入示例',
    description: '单输入框宽容解析的时间输入组件示例',
  })
}

export default function Example() {
  const [lastChange, setLastChange] = useState('')
  const [controlled, setControlled] = useState('14:30')

  return (
    <div className="min-h-dvh bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <ExampleNav />
          <h1 className="font-heading font-semibold text-2xl text-foreground">
            时间输入
          </h1>
          <p className="text-muted-foreground text-sm">
            单输入框宽容解析：9、930、9:30、9am、下午3点 都行；失焦后规范化为 HH:mm。
            右侧按钮打开快捷选择，输入框内可用 ↑/↓ 调整。
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基础用法</CardTitle>
              <CardDescription>非受控，默认 10 分钟步进</CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-2">
              <Field>
                <FieldLabel htmlFor="demo-basic">开始时间</FieldLabel>
                <TimeInput
                  id="demo-basic"
                  defaultValue="9:30"
                  onChange={setLastChange}
                />
                <FieldDescription>
                  试试输入 930、9am、下午3点、9.30
                </FieldDescription>
              </Field>
              <p className="text-muted-foreground text-xs">
                最近一次 onChange：
                <span className="tabular-nums text-foreground">
                  {lastChange || '—'}
                </span>
              </p>
            </CardPanel>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>受控 + 12 小时制</CardTitle>
              <CardDescription>value 始终是 24 小时制 HH:mm</CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-2">
              <Field>
                <FieldLabel htmlFor="demo-hour12">提醒时间</FieldLabel>
                <TimeInput
                  hour12
                  id="demo-hour12"
                  value={controlled}
                  onChange={setControlled}
                />
                <FieldDescription>
                  当前值：
                  {controlled}
                </FieldDescription>
              </Field>
            </CardPanel>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>自定义分钟间隔</CardTitle>
              <CardDescription>
                15 分钟粒度，滚轮只列出 00 / 15 / 30 / 45
              </CardDescription>
            </CardHeader>
            <CardPanel>
              <Field>
                <FieldLabel htmlFor="demo-custom">会议时间</FieldLabel>
                <TimeInput
                  defaultValue="10:30"
                  id="demo-custom"
                  placeholder="例如 10:30"
                  step={15}
                />
                <FieldDescription>
                  按 ↑/↓ 每次调整 15 分钟，跨过午夜会自动回绕
                </FieldDescription>
              </Field>
            </CardPanel>
          </Card>
        </div>
      </div>
    </div>
  )
}
