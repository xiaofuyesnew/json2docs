// 集成测试 Pinia store 的 convertDocument action
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDocumentStore } from './document'

// Mock converter 库
vi.mock('@json2docs/converter', () => {
  return {
    DocumentConverter: vi.fn().mockImplementation(() => ({
      convert: vi.fn(async (json, format) => {
        if (format === 'html')
          return { format: 'html', data: '<html>ok</html>', metadata: { documentTitle: '测试' }, timestamp: new Date().toISOString() }
        if (format === 'pdf')
          return { format: 'pdf', data: new Uint8Array([1, 2]), metadata: {}, timestamp: new Date().toISOString() }
        if (format === 'docx')
          return { format: 'docx', data: new Uint8Array([3, 4]), metadata: {}, timestamp: new Date().toISOString() }
        throw Object.assign(new Error('不支持的格式'), { code: 'UNSUPPORTED_FORMAT' })
      }),
    })),
    DocumentConverterError: class extends Error {
      constructor(message, code) {
        super(message)
        this.code = code
      }
    },
    ERROR_CODES: { INVALID_JSON: 'INVALID_JSON', UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT', CONVERSION_FAILED: 'CONVERSION_FAILED', VALIDATION_ERROR: 'VALIDATION_ERROR' },
  }
})

describe('document store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should convert document to HTML', async () => {
    const store = useDocumentStore()
    store.setJsonDocument({ foo: 'bar' })
    store.setSelectedFormat('html')
    await store.convertDocument()
    expect(store.convertedResult).toBeTruthy()
    expect(store.convertedResult.format).toBe('html')
    expect(store.errors.length).toBe(0)
  })

  it('should handle unsupported format error', async () => {
    const store = useDocumentStore()
    store.setJsonDocument({ foo: 'bar' })
    store.setSelectedFormat('unknown')
    await store.convertDocument()
    expect(store.convertedResult).toBeNull()
    expect(store.errors.length).toBeGreaterThan(0)
    expect(store.errors[0]).toMatch(/不支持|未知错误/)
  })

  it('should handle missing document', async () => {
    const store = useDocumentStore()
    store.setJsonDocument(null)
    await store.convertDocument()
    expect(store.errors.length).toBeGreaterThan(0)
    expect(store.errors[0]).toMatch(/没有可转换/)
  })
})
