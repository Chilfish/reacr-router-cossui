import { useEffect, useRef, useState } from 'react'
import { getFileKey, isImageFile } from '~/lib/files'

const THUMBNAIL_WIDTH = 128
const MAX_CONCURRENT = 3

/**
 * 为图片文件生成小尺寸缩略图，避免列表直接解码原图。
 *
 * - `createImageBitmap` 在解码时按宽度缩放；不支持时退化为对象 URL
 * - 同时最多处理 3 个文件，避免大量图片同时解码卡住主线程
 * - 移除文件或卸载时释放对应的对象 URL
 */
export function useFileThumbnails(
  files: readonly File[],
): Record<string, string> {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})
  const thumbnailsRef = useRef(thumbnails)

  useEffect(() => {
    const imageFiles = files.filter(isImageFile)
    const activeKeys = new Set(imageFiles.map(getFileKey))
    let cancelled = false

    let next = thumbnailsRef.current
    for (const [key, url] of Object.entries(next)) {
      if (activeKeys.has(key))
        continue
      URL.revokeObjectURL(url)
      next = { ...next }
      delete next[key]
    }
    if (next !== thumbnailsRef.current) {
      thumbnailsRef.current = next
      setThumbnails(next)
    }

    const queue = imageFiles.filter(
      file => !(getFileKey(file) in thumbnailsRef.current),
    )
    if (queue.length === 0)
      return

    const workerCount = Math.min(MAX_CONCURRENT, queue.length)
    for (let index = 0; index < workerCount; index += 1)
      void processQueue()

    async function processQueue(): Promise<void> {
      while (queue.length > 0) {
        if (cancelled)
          return

        const file = queue.shift()
        if (!file)
          return

        const url = await createThumbnail(file)
        if (!url)
          continue

        const key = getFileKey(file)
        if (
          cancelled
          || !files.some(current => getFileKey(current) === key)
        ) {
          URL.revokeObjectURL(url)
          continue
        }

        thumbnailsRef.current = {
          ...thumbnailsRef.current,
          [key]: url,
        }
        setThumbnails(thumbnailsRef.current)
      }
    }

    return () => {
      cancelled = true
    }
  }, [files])

  useEffect(() => {
    return () => {
      for (const url of Object.values(thumbnailsRef.current))
        URL.revokeObjectURL(url)
      thumbnailsRef.current = {}
    }
  }, [])

  return thumbnails
}

async function createThumbnail(file: File): Promise<string | null> {
  if (typeof createImageBitmap !== 'function')
    return URL.createObjectURL(file)

  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(file, {
      resizeQuality: 'medium',
      resizeWidth: THUMBNAIL_WIDTH,
    })

    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const context = canvas.getContext('2d')
    if (!context)
      return URL.createObjectURL(file)

    context.drawImage(bitmap, 0, 0)
    const blob = await canvasToBlob(canvas)
    return blob
      ? URL.createObjectURL(blob)
      : URL.createObjectURL(file)
  }
  catch {
    return URL.createObjectURL(file)
  }
  finally {
    bitmap?.close()
  }
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.8)
  })
}
