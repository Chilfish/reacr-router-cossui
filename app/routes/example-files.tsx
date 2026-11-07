import type { Route } from './+types/example-files'
import { useState } from 'react'
import { ExampleNav } from '~/components/shared/example-nav'
import { FileDropzone } from '~/components/shared/file-dropzone'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '~/components/ui/card'
import { generateSEOMeta } from '~/lib/seo'

export function meta(): Route.MetaDescriptors {
  return generateSEOMeta({
    title: '文件选择器示例',
    description: '拖拽、缩略图与大图预览的文件选择器示例',
  })
}

export default function ExampleFiles() {
  const [images, setImages] = useState<File[]>([])

  return (
    <div className="min-h-dvh bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <ExampleNav />
          <h1 className="font-heading font-semibold text-2xl text-foreground">
            文件选择器
          </h1>
          <p className="text-muted-foreground text-sm">
            拖拽或点击添加文件；图片会在本地生成缩略图，点击缩略图查看大图。
            文件只保存在浏览器内存中，不会上传。
          </p>
        </header>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>图片</CardTitle>
              <CardDescription>
                最多 10 张，单张 8 MB，自动生成缩略图
              </CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-2">
              <FileDropzone
                accept="image/*"
                description="拖拽图片到此处，或点击选择"
                maxFiles={10}
                maxSize={8 * 1024 * 1024}
                onChange={setImages}
              />
              <p className="text-muted-foreground text-xs tabular-nums">
                当前
                {' '}
                {images.length}
                {' '}
                张图片
              </p>
            </CardPanel>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>单个文档</CardTitle>
              <CardDescription>
                只保留一个文件，替换时自动移除旧文件
              </CardDescription>
            </CardHeader>
            <CardPanel>
              <FileDropzone
                accept=".pdf,.doc,.docx,.txt"
                description="支持 PDF、Word 与文本，单个不超过 5 MB"
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                multiple={false}
              />
            </CardPanel>
          </Card>
        </div>
      </div>
    </div>
  )
}
