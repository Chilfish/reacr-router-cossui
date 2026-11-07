import { useEffect, useMemo } from 'react'

/**
 * 为文件创建对象 URL，并在文件变化或卸载时自动释放。
 * 适合只在需要时加载大图预览，避免长期占用内存。
 */
export function useObjectUrl(file: File | null | undefined): string | null {
  const url = useMemo(
    () => (file
      ? URL.createObjectURL(file)
      : null),
    [file],
  )

  useEffect(() => {
    return () => {
      if (url)
        URL.revokeObjectURL(url)
    }
  }, [url])

  return url
}
