/**
 * PDFGenerator类的单元测试
 */

import { describe, expect, it, vi } from 'vitest'

import { DocumentConverterError } from '../../src/core/errors.js'
import { PDFGenerator } from '../../src/generators/PDFGenerator.js'

// 模拟DocumentModel
vi.mock('../../src/models/DocumentModel.js', () => {
  return {
    DocumentModel: vi.fn().mockImplementation((data) => {
      return {
        metadata: data.metadata || {},
        content: data.content || [],
        validate: vi.fn(),
      }
    }),
  }
})

// 模拟ConversionResult
vi.mock('../../src/models/ConversionResult.js', () => {
  return {
    ConversionResult: vi.fn().mockImplementation((format, data, metadata) => {
      return {
        format,
        data,
        metadata,
      }
    }),
  }
})

describe('pDFGenerator', () => {
  describe('构造函数', () => {
    it('应该使用默认选项创建实例', () => {
      const generator = new PDFGenerator()

      expect(generator).toBeInstanceOf(PDFGenerator)
      expect(generator.options).toHaveProperty('pageSize')
      expect(generator.options).toHaveProperty('margins')
      expect(generator.options).toHaveProperty('defaultFont')
      expect(generator.options).toHaveProperty('headingFont')
      expect(generator.options).toHaveProperty('baseFontSize')
    })

    it('应该使用自定义选项创建实例', () => {
      const options = {
        pageSize: { width: 800, height: 600 },
        margins: { top: 30, right: 30, bottom: 30, left: 30 },
        baseFontSize: 14,
      }
      const generator = new PDFGenerator(options)

      expect(generator.options.pageSize).toEqual({ width: 800, height: 600 })
      expect(generator.options.margins).toEqual({ top: 30, right: 30, bottom: 30, left: 30 })
      expect(generator.options.baseFontSize).toBe(14)
    })
  })

  describe('generate', () => {
    it('应该处理无效的文档数据', async () => {
      const generator = new PDFGenerator()

      await expect(generator.generate()).rejects.toThrow(DocumentConverterError)
    })
  })
})
