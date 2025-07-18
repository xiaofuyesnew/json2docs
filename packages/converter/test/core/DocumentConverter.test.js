/**
 * DocumentConverter类的单元测试
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DocumentConverter } from '../../src/core/DocumentConverter.js'
import { DocumentConverterError, ERROR_CODES } from '../../src/core/errors.js'
import { DocumentValidator } from '../../src/utils/validator.js'

// 模拟生成器
vi.mock('../../src/generators/HTMLGenerator.js', () => ({
  HTMLGenerator: vi.fn().mockImplementation(() => ({
    generate: vi.fn().mockResolvedValue('<html><body>测试HTML</body></html>'),
  })),
}))

vi.mock('../../src/generators/PDFGenerator.js', () => ({
  PDFGenerator: vi.fn().mockImplementation(() => ({
    generate: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
  })),
}))

vi.mock('../../src/generators/DOCXGenerator.js', () => ({
  DOCXGenerator: vi.fn().mockImplementation(() => ({
    generate: vi.fn().mockResolvedValue(new Uint8Array([5, 6, 7, 8])),
  })),
}))

// 模拟DocumentValidator
vi.mock('../../src/utils/validator.js', () => ({
  DocumentValidator: {
    validate: vi.fn(),
  },
}))

describe('documentConverter', () => {
  let converter
  let validDocument

  beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks()

    // 创建转换器实例
    converter = new DocumentConverter()

    // 有效的测试文档
    validDocument = {
      version: '1.0',
      metadata: {
        title: '测试文档',
        author: '测试作者',
      },
      content: [
        {
          type: 'heading',
          level: 1,
          text: '测试标题',
        },
        {
          type: 'paragraph',
          text: '测试段落',
        },
      ],
    }
  })

  describe('构造函数', () => {
    it('应该使用默认选项创建实例', () => {
      expect(converter).toBeInstanceOf(DocumentConverter)
      expect(converter.options).toBeDefined()
      expect(converter.options.validateInput).toBe(true)
    })

    it('应该使用自定义选项创建实例', () => {
      const customOptions = {
        validateInput: false,
        prettyPrint: true,
      }

      const customConverter = new DocumentConverter(customOptions)

      expect(customConverter.options.validateInput).toBe(false)
      expect(customConverter.options.prettyPrint).toBe(true)
    })
  })

  describe('getSupportedFormats', () => {
    it('应该返回支持的格式列表', () => {
      const formats = converter.getSupportedFormats()

      expect(formats).toEqual(['html', 'pdf', 'docx'])
    })
  })

  describe('convert', () => {
    it('应该将文档转换为HTML格式', async () => {
      const result = await converter.convert(validDocument, 'html')

      expect(result.format).toBe('html')
      expect(result.data).toBe('<html><body>测试HTML</body></html>')
      expect(result.metadata.documentTitle).toBe('测试文档')
    })

    it('应该将文档转换为PDF格式', async () => {
      const result = await converter.convert(validDocument, 'pdf')

      expect(result.format).toBe('pdf')
      expect(result.data).toBeInstanceOf(Uint8Array)
      expect(result.data).toEqual(new Uint8Array([1, 2, 3, 4]))
    })

    it('应该将文档转换为DOCX格式', async () => {
      const result = await converter.convert(validDocument, 'docx')

      expect(result.format).toBe('docx')
      expect(result.data).toBeInstanceOf(Uint8Array)
      expect(result.data).toEqual(new Uint8Array([5, 6, 7, 8]))
    })

    it('应该在不支持的格式时抛出错误', async () => {
      await expect(converter.convert(validDocument, 'invalid')).rejects.toThrow(DocumentConverterError)
      await expect(converter.convert(validDocument, 'invalid')).rejects.toThrow(/不支持的输出格式/)

      try {
        await converter.convert(validDocument, 'invalid')
      }
      catch (error) {
        expect(error.code).toBe(ERROR_CODES.UNSUPPORTED_FORMAT)
      }
    })

    it('应该在转换失败时抛出错误', async () => {
      // 创建一个新的转换器实例，避免模拟冲突
      const failingConverter = new DocumentConverter()

      // 直接修改生成器的 generate 方法
      failingConverter.generators.html.generate = vi.fn().mockRejectedValue(new Error('HTML生成失败'))

      await expect(failingConverter.convert(validDocument, 'html')).rejects.toThrow(DocumentConverterError)
      await expect(failingConverter.convert(validDocument, 'html')).rejects.toThrow('转换失败')
    })
  })

  describe('convertMultiple', () => {
    it('应该将文档转换为多种格式', async () => {
      // 确保生成器正常工作
      converter.generators.html.generate = vi.fn().mockResolvedValue('<html><body>测试HTML</body></html>')
      converter.generators.pdf.generate = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))

      const result = await converter.convertMultiple(validDocument, ['html', 'pdf'])

      expect(result.results).toBeDefined()
      expect(result.results.html).toBeDefined()
      expect(result.results.pdf).toBeDefined()
      expect(result.results.html.format).toBe('html')
      expect(result.results.pdf.format).toBe('pdf')
      expect(result.errors).toBeNull()
    })

    it('应该处理部分格式转换失败的情况', async () => {
      // 设置一个生成器失败，另一个成功
      converter.generators.html.generate = vi.fn().mockRejectedValue(new Error('HTML生成失败'))
      converter.generators.pdf.generate = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))

      const result = await converter.convertMultiple(validDocument, ['html', 'pdf'])

      expect(result.results.pdf).toBeDefined()
      expect(result.errors).toBeDefined()
      expect(result.errors.html).toBeInstanceOf(DocumentConverterError)
      expect(result.errors.html.message).toContain('HTML生成失败')
    })

    it('应该在所有格式转换失败时抛出错误', async () => {
      // 设置所有生成器都失败
      converter.generators.html.generate = vi.fn().mockRejectedValue(new Error('HTML生成失败'))
      converter.generators.pdf.generate = vi.fn().mockRejectedValue(new Error('PDF生成失败'))

      await expect(converter.convertMultiple(validDocument, ['html', 'pdf'])).rejects.toThrow(DocumentConverterError)
      await expect(converter.convertMultiple(validDocument, ['html', 'pdf'])).rejects.toThrow('所有格式转换都失败')
    })
  })

  describe('validateJsonDocument', () => {
    it('应该调用DocumentValidator.validate', () => {
      // 创建一个模拟函数
      const originalValidate = DocumentValidator.validate
      DocumentValidator.validate = vi.fn()

      try {
        converter.validateJsonDocument(validDocument)
        expect(DocumentValidator.validate).toHaveBeenCalledWith(validDocument)
      }
      finally {
        // 恢复原始函数
        DocumentValidator.validate = originalValidate
      }
    })
  })

  describe('setOptions和resetOptions', () => {
    it('应该更新选项', () => {
      converter.setOptions({ prettyPrint: true })

      expect(converter.options.prettyPrint).toBe(true)
      expect(converter.options.validateInput).toBe(true) // 保留默认值
    })

    it('应该重置选项为默认值', () => {
      converter.setOptions({ validateInput: false, prettyPrint: true })
      converter.resetOptions()

      expect(converter.options.validateInput).toBe(true) // 恢复默认值
      expect(converter.options.prettyPrint).toBe(false) // 恢复默认值
    })
  })
})
