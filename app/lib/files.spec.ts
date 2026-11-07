import { describe, expect, it } from 'vitest'
import {
  addFiles,
  formatFileSize,
  getFileKey,
  isImageFile,
  matchesAccept,
  removeFile,
} from './files'

function createFile(
  name: string,
  { size = 1, type = '' }: { size?: number, type?: string } = {},
): File {
  return new File([
    new Uint8Array(size),
  ], name, {
    lastModified: 1,
    type,
  })
}

describe('formatFileSize', () => {
  it('withBytes_returnsBytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1023)).toBe('1023 B')
  })

  it('withKilobytes_returnsOneDecimalBelowTen', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1024 * 1024 * 1.25)).toBe('1.3 MB')
  })

  it('withLargeValues_roundsToWholeNumber', () => {
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('withInvalidInput_returnsZeroBytes', () => {
    expect(formatFileSize(-1)).toBe('0 B')
    expect(formatFileSize(Number.NaN)).toBe('0 B')
  })
})

describe('getFileKey', () => {
  it('withSameMetadata_returnsSameKey', () => {
    expect(getFileKey(createFile('a.png'))).toBe(
      getFileKey(createFile('a.png')),
    )
  })

  it('withDifferentNames_returnsDifferentKeys', () => {
    expect(getFileKey(createFile('a.png'))).not.toBe(
      getFileKey(createFile('b.png')),
    )
  })
})

describe('isImageFile', () => {
  it('withImageMime_returnsTrue', () => {
    expect(isImageFile(createFile('a.png', { type: 'image/png' }))).toBe(true)
  })

  it('withOtherMime_returnsFalse', () => {
    expect(isImageFile(createFile('a.pdf', { type: 'application/pdf' })))
      .toBe(false)
  })
})

describe('matchesAccept', () => {
  it('withoutAccept_acceptsEverything', () => {
    expect(matchesAccept(createFile('a.bin'))).toBe(true)
  })

  it('withExtension_matchesCaseInsensitive', () => {
    const accept = '.PNG,.jpg'
    expect(matchesAccept(createFile('photo.png'), accept)).toBe(true)
    expect(matchesAccept(createFile('photo.gif'), accept)).toBe(false)
  })

  it('withExactMime_matchesType', () => {
    const accept = 'application/pdf'
    expect(
      matchesAccept(createFile('a.pdf', { type: 'application/pdf' }), accept),
    ).toBe(true)
    expect(
      matchesAccept(createFile('a.png', { type: 'image/png' }), accept),
    ).toBe(false)
  })

  it('withWildcardType_matchesPrefix', () => {
    const accept = 'image/*'
    expect(
      matchesAccept(createFile('a.webp', { type: 'image/webp' }), accept),
    ).toBe(true)
    expect(
      matchesAccept(createFile('a.pdf', { type: 'application/pdf' }), accept),
    ).toBe(false)
  })

  it('withUniversalWildcard_acceptsAll', () => {
    expect(matchesAccept(createFile('a.bin'), '*/*')).toBe(true)
  })
})

describe('addFiles', () => {
  it('withValidFiles_appendsInOrder', () => {
    const first = createFile('a.png', { type: 'image/png' })
    const second = createFile('b.png', { type: 'image/png' })
    const result = addFiles([first], [second])
    expect(result.files).toEqual([first, second])
    expect(result.rejected).toEqual([])
  })

  it('withTypeMismatch_rejectsFile', () => {
    const file = createFile('a.pdf', { type: 'application/pdf' })
    const result = addFiles([], [file], { accept: 'image/*' })
    expect(result.files).toEqual([])
    expect(result.rejected).toEqual([
      { file, reason: 'type' },
    ])
  })

  it('withOversizedFile_rejectsFile', () => {
    const file = createFile('a.png', { size: 2048, type: 'image/png' })
    const result = addFiles([], [file], { maxSize: 1024 })
    expect(result.rejected).toEqual([
      { file, reason: 'size' },
    ])
  })

  it('withDuplicateFile_rejectsDuplicate', () => {
    const file = createFile('a.png', { type: 'image/png' })
    const result = addFiles([file], [
      createFile('a.png', { type: 'image/png' }),
    ])
    expect(result.files).toHaveLength(1)
    expect(result.rejected[0]?.reason).toBe('duplicate')
  })

  it('withMaxFiles_rejectsExtras', () => {
    const files = [
      createFile('a.png', { type: 'image/png' }),
      createFile('b.png', { type: 'image/png' }),
    ]
    const result = addFiles([], files, { maxFiles: 1 })
    expect(result.files).toHaveLength(1)
    expect(result.rejected).toEqual([
      { file: files[1], reason: 'count' },
    ])
  })

  it('withSingleMode_replacesExisting', () => {
    const first = createFile('a.png', { type: 'image/png' })
    const second = createFile('b.png', { type: 'image/png' })
    const result = addFiles([first], [second], { multiple: false })
    expect(result.files).toEqual([second])
  })

  it('withSingleMode_rejectsAdditionalFiles', () => {
    const first = createFile('a.png', { type: 'image/png' })
    const second = createFile('b.png', { type: 'image/png' })
    const result = addFiles([], [first, second], { multiple: false })
    expect(result.files).toEqual([first])
    expect(result.rejected[0]).toEqual({ file: second, reason: 'count' })
  })
})

describe('removeFile', () => {
  it('withExistingFile_removesOnlyThatFile', () => {
    const first = createFile('a.png')
    const second = createFile('b.png')
    expect(removeFile([first, second], first)).toEqual([second])
  })

  it('withUnknownFile_keepsList', () => {
    const files = [
      createFile('a.png'),
    ]
    expect(removeFile(files, createFile('b.png'))).toEqual(files)
  })
})
