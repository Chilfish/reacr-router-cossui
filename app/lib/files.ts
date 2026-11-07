const FILE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

export type FileRejectionReason = 'type' | 'size' | 'count' | 'duplicate'

export interface FileRejection {
  file: File
  reason: FileRejectionReason
}

export interface AddFilesOptions {
  /** 与原生 `accept` 相同：扩展名、MIME 或 `image/*` */
  accept?: string
  /** 最多保留的文件数，默认不限 */
  maxFiles?: number
  /** 单个文件的大小上限（字节），默认不限 */
  maxSize?: number
  multiple?: boolean
}

export interface AddFilesResult {
  files: File[]
  rejected: FileRejection[]
}

/**
 * 生成用于去重与 React key 的文件标识。
 * 同名、同大小、同修改时间的文件视为同一个。
 */
export function getFileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

/**
 * 把字节数格式化为带单位的可读文本，如 `1.5 KB`、`10 MB`。
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0)
    return '0 B'

  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < FILE_UNITS.length - 1) {
    value /= 1024
    unit += 1
  }

  const rounded = unit === 0 || value >= 10
    ? Math.round(value)
    : Number(value.toFixed(1))
  return `${rounded} ${FILE_UNITS[unit]}`
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 判断文件是否匹配 `accept` 规则。空规则表示全部接受。
 * 支持扩展名、MIME、类型通配（如 `image/*`）与全选通配。
 */
export function matchesAccept(file: File, accept?: string): boolean {
  const rules = accept
    ?.split(',')
    .map(rule => rule.trim().toLowerCase())
    .filter(Boolean)

  if (!rules || rules.length === 0)
    return true

  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()

  return rules.some((rule) => {
    if (rule === '*/*')
      return true
    if (rule.startsWith('.'))
      return name.endsWith(rule)
    if (rule.endsWith('/*'))
      return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}

/**
 * 把新文件合并进当前列表：过滤类型、大小与数量，按 `getFileKey` 去重。
 *
 * `multiple` 为 false 时，新选择会替换原列表，只保留第一个合法文件。
 */
export function addFiles(
  existing: readonly File[],
  incoming: readonly File[],
  options: AddFilesOptions = {},
): AddFilesResult {
  const {
    accept,
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    multiple = true,
  } = options

  const limit = multiple
    ? Math.max(1, Math.floor(maxFiles))
    : 1
  const sizeLimit = maxSize > 0
    ? maxSize
    : Number.POSITIVE_INFINITY
  const files = multiple
    ? [...existing]
    : []
  const keys = new Set(files.map(getFileKey))
  const rejected: FileRejection[] = []

  for (const file of incoming) {
    if (files.length >= limit) {
      rejected.push({ file, reason: 'count' })
      continue
    }
    if (!matchesAccept(file, accept)) {
      rejected.push({ file, reason: 'type' })
      continue
    }
    if (file.size > sizeLimit) {
      rejected.push({ file, reason: 'size' })
      continue
    }

    const key = getFileKey(file)
    if (keys.has(key)) {
      rejected.push({ file, reason: 'duplicate' })
      continue
    }

    keys.add(key)
    files.push(file)
  }

  return { files, rejected }
}

/**
 * 按文件标识移除一项，返回新数组。
 */
export function removeFile(files: readonly File[], target: File): File[] {
  const key = getFileKey(target)
  return files.filter(file => getFileKey(file) !== key)
}
