/**
 * ConversionResult类的单元测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ConversionResult } from '../../src/models/ConversionResult.js'

describe('conversionResult', () => {
  let htmlResult
  let pdfResult
  let docxResult

  beforeEach(() => {
    // 模拟日期
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-24T12:00:00Z'))

    // 创建测试结果
    htmlResult = new ConversionResult('html', '<html><body>测试</body></html>', {
      documentTitle: 'HTML测试文档',
    })

    pdfResult = new ConversionResult('pdf', new Uint8Array([1, 2, 3, 4]), {
      documentTitle: 'PDF测试文档',
    })

    docxResult = new ConversionResult('docx', new Uint8Array([5, 6, 7, 8]), {
      documentTitle: 'DOCX测试文档',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('构造函数', () => {
    it('应该创建HTML结果实例', () => {
      expect(htmlResult.format).toBe('html')
      expect(htmlResult.data).toBe('<html><body>测试</body></html>')
      expect(htmlResult.metadata.documentTitle).toBe('HTML测试文档')
      expect(htmlResult.timestamp).toBe('2025-07-24T12:00:00.000Z')
    })

    it('应该创建PDF结果实例', () => {
      expect(pdfResult.format).toBe('pdf')
      expect(pdfResult.data).toBeInstanceOf(Uint8Array)
      expect(pdfResult.metadata.documentTitle).toBe('PDF测试文档')
    })

    it('应该创建DOCX结果实例', () => {
      expect(docxResult.format).toBe('docx')
      expect(docxResult.data).toBeInstanceOf(Uint8Array)
      expect(docxResult.metadata.documentTitle).toBe('DOCX测试文档')
    })
  })

  describe('toBlob', () => {
    it('应该将HTML结果转换为Blob', () => {
      const blob = htmlResult.toBlob()

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('text/html')
    })

    it('应该将PDF结果转换为Blob', () => {
      const blob = pdfResult.toBlob()

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/pdf')
    })

    it('应该将DOCX结果转换为Blob', () => {
      const blob = docxResult.toBlob()

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    })

    it('应该处理未知格式', () => {
      const unknownResult = new ConversionResult('unknown', 'data')
      const blob = unknownResult.toBlob()

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/octet-stream')
    })
  })

  describe('getFileName', () => {
    it('应该生成HTML文件名', () => {
      const fileName = htmlResult.getFileName()

      expect(fileName).toBe('html测试文档_2025-07-24.html')
    })

    it('应该生成PDF文件名', () => {
      const fileName = pdfResult.getFileName()

      expect(fileName).toBe('pdf测试文档_2025-07-24.pdf')
    })

    it('应该生成DOCX文件名', () => {
      const fileName = docxResult.getFileName()

      expect(fileName).toBe('docx测试文档_2025-07-24.docx')
    })

    it('应该处理未知格式', () => {
      const unknownResult = new ConversionResult('unknown', 'data')
      const fileName = unknownResult.getFileName()

      expect(fileName).toBe('document_2025-07-24.bin')
    })
  })
})
