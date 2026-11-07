import type * as React from 'react'
import type { FileRejection } from '~/lib/files'
import { FileIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { useFileThumbnails } from '~/hooks/use-file-thumbnails'
import { useObjectUrl } from '~/hooks/use-object-url'
import {
  addFiles,
  formatFileSize,
  getFileKey,
  isImageFile,
  removeFile,
} from '~/lib/files'
import { cn } from '~/lib/utils'

const DEFAULT_MAX_FILES = 20
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024

export interface FileDropzoneProps {
  /** 受控文件列表 */
  'value'?: File[]
  /** 非受控初始文件 */
  'defaultValue'?: File[]
  /** 列表变化回调，始终返回新数组 */
  'onChange'?: (files: File[]) => void
  /** 原生 accept 规则：扩展名、MIME 或 `image/*` */
  'accept'?: string
  'multiple'?: boolean
  /** 最多保留的文件数，默认 20 */
  'maxFiles'?: number
  /** 单个文件大小上限（字节），默认 10 MB */
  'maxSize'?: number
  'disabled'?: boolean
  'label'?: string
  'description'?: string
  'className'?: string
  'aria-label'?: string
}

/**
 * 文件选择器：拖拽或点击选择，图片生成缩略图，点击缩略图打开大图预览。
 *
 * 性能约定：
 * - 缩略图按 128px 宽度解码，最多 3 个并发
 * - 列表项使用 `loading="lazy" decoding="async"` 与固定尺寸
 * - 对象 URL 在移除文件或卸载时释放；大图 URL 仅在预览打开时创建
 *
 * @example
 * ```tsx
 * <FileDropzone
 *   accept="image/*"
 *   maxFiles={10}
 *   onChange={setFiles}
 * />
 * ```
 */
export function FileDropzone({
  'aria-label': ariaLabel,
  accept,
  className,
  defaultValue,
  description,
  disabled = false,
  label = '拖拽文件到此处',
  maxFiles = DEFAULT_MAX_FILES,
  maxSize = DEFAULT_MAX_SIZE,
  multiple = true,
  onChange,
  value,
}: FileDropzoneProps): React.ReactElement {
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultValue ?? [])
  const [rejected, setRejected] = useState<FileRejection[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const hintId = useId()

  const files = value ?? internalFiles
  const thumbnails = useFileThumbnails(files)
  const previewUrl = useObjectUrl(previewFile)

  function updateFiles(next: File[]): void {
    if (value === undefined)
      setInternalFiles(next)
    onChange?.(next)
  }

  function addIncoming(incoming: readonly File[]): void {
    if (incoming.length === 0)
      return

    const result = addFiles(files, incoming, {
      accept,
      maxFiles,
      maxSize,
      multiple,
    })
    const changed = result.files.length !== files.length
      || result.files.some((file, index) => file !== files[index])

    if (changed)
      updateFiles(result.files)
    setRejected(result.rejected)
  }

  function openPicker(): void {
    if (!disabled)
      inputRef.current?.click()
  }

  function resetDrag(): void {
    dragDepth.current = 0
    setDragActive(false)
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    if (disabled)
      return
    dragDepth.current += 1
    setDragActive(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    if (disabled)
      return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0)
      setDragActive(false)
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    resetDrag()
    if (disabled)
      return
    addIncoming(Array.from(event.dataTransfer.files))
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Enter' && event.key !== ' ')
      return
    event.preventDefault()
    openPicker()
  }

  const hint = description
    ?? `最多 ${maxFiles} 个文件${maxSize > 0
      ? `，单个不超过 ${formatFileSize(maxSize)}`
      : ''}${accept
      ? `，格式 ${accept}`
      : ''}`
  const error = getRejectionMessage(rejected, maxSize)

  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      <div
        aria-describedby={hintId}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel ?? '选择文件'}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-4 py-8 text-center outline-none transition-colors duration-200',
          'hover:border-ring/64 hover:bg-accent/32 focus-visible:ring-2 focus-visible:ring-ring',
          dragActive && 'border-ring bg-accent/48',
          disabled && 'pointer-events-none opacity-64',
        )}
        onClick={openPicker}
        onDragEnd={resetDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled
          ? -1
          : 0}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-muted">
          <UploadIcon
            aria-hidden="true"
            className="size-4.5 text-muted-foreground"
          />
        </span>
        <span className="font-medium text-sm text-foreground">
          {dragActive ? '松开以添加文件' : label}
        </span>
        <span className="text-muted-foreground text-xs" id={hintId}>
          {hint}
        </span>
      </div>

      <input
        ref={inputRef}
        accept={accept}
        className="sr-only"
        disabled={disabled}
        multiple={multiple}
        onChange={(event) => {
          addIncoming(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
        type="file"
      />

      {error && (
        <p className="text-destructive-foreground text-xs" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs tabular-nums">
            已选择
            {' '}
            {files.length}
            {' '}
            个文件
          </p>
          <Button
            onClick={() => {
              updateFiles([])
              setRejected([])
            }}
            size="xs"
            variant="ghost"
          >
            清空
          </Button>
        </div>
      )}

      {files.length > 0 && (
        <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto overscroll-contain pe-1">
          {files.map((file) => {
            const key = getFileKey(file)
            const image = isImageFile(file)
            const thumbnail = thumbnails[key]

            return (
              <li
                className="flex items-center gap-3 rounded-lg border bg-card/64 px-2.5 py-2"
                key={key}
              >
                {image
                  ? (
                      <button
                        aria-label={`预览 ${file.name}`}
                        className="size-10 shrink-0 overflow-hidden rounded-md border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => setPreviewFile(file)}
                        type="button"
                      >
                        {thumbnail
                          ? (
                              <img
                                alt=""
                                className="size-full object-cover"
                                decoding="async"
                                height={40}
                                loading="lazy"
                                src={thumbnail}
                                width={40}
                              />
                            )
                          : (
                              <span className="flex size-full items-center justify-center">
                                <ImageIcon
                                  aria-hidden="true"
                                  className="size-4 text-muted-foreground"
                                />
                              </span>
                            )}
                      </button>
                    )
                  : (
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                        <FileIcon
                          aria-hidden="true"
                          className="size-4 text-muted-foreground"
                        />
                      </span>
                    )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Button
                  aria-label={`移除 ${file.name}`}
                  onClick={() => {
                    updateFiles(removeFile(files, file))
                    setRejected([])
                  }}
                  size="icon-xs"
                  variant="ghost"
                >
                  <XIcon />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <Dialog
        open={previewFile !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen)
            setPreviewFile(null)
        }}
      >
        <DialogPopup className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pe-8 text-base">
              {previewFile?.name}
            </DialogTitle>
            <DialogDescription className="tabular-nums">
              {previewFile
                ? `${formatFileSize(previewFile.size)}${previewFile.type
                  ? ` · ${previewFile.type}`
                  : ''}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex min-h-40 items-center justify-center">
            {previewUrl
              ? (
                  <img
                    alt={previewFile?.name ?? ''}
                    className="max-h-[70dvh] max-w-full rounded-lg object-contain"
                    decoding="async"
                    src={previewUrl}
                  />
                )
              : <Spinner className="size-5 text-muted-foreground" />}
          </DialogPanel>
        </DialogPopup>
      </Dialog>
    </div>
  )
}

function getRejectionMessage(
  rejected: readonly FileRejection[],
  maxSize: number,
): string | null {
  if (rejected.length === 0)
    return null

  const counts = {
    count: 0,
    duplicate: 0,
    size: 0,
    type: 0,
  }
  for (const item of rejected)
    counts[item.reason] += 1

  const parts: string[] = []
  if (counts.type > 0)
    parts.push(`${counts.type} 个类型不符`)
  if (counts.size > 0)
    parts.push(`${counts.size} 个超过 ${formatFileSize(maxSize)}`)
  if (counts.count > 0)
    parts.push(`${counts.count} 个超出数量上限`)
  if (counts.duplicate > 0)
    parts.push(`${counts.duplicate} 个重复`)

  return `已忽略 ${rejected.length} 个文件：${parts.join('，')}`
}
