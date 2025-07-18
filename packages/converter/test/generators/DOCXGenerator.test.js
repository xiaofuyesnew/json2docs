/**
 * DOCXGenerator类的单元测试
 */

import { Document } from 'docx'
import { describe, expect, it, vi } from 'vitest'

import { DocumentConverterError } from '../../src/core/errors.js'
import { DOCXGenerator } from '../../src/generators/DOCXGenerator.js'
import { DocumentModel } from '../../src/models/DocumentModel.js'

// 模拟DocumentModel
vi.mock('../../src/models/DocumentModel.js', () => {
  return {
    DocumentModel: vi.fn().mockImplementation((data) => {
      return {
        metadata: data.metadata || {},
        content: data.content || [],
        styles: data.styles || {},
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

// 模拟docx库
vi.mock('docx', () => {
  return {
    Document: vi.fn().mockImplementation(() => ({
      save: vi.fn().mockResolvedValue(require('node:buffer').Buffer.from('mock docx content')),
    })),
    Paragraph: vi.fn().mockImplementation(({ text, children }) => ({
      text,
      children,
    })),
    TextRun: vi.fn().mockImplementation(({ text }) => ({
      text,
    })),
    ImageRun: vi.fn(),
    Table: vi.fn(),
    TableRow: vi.fn(),
    TableCell: vi.fn(),
    HeadingLevel: {
      HEADING_1: 'HEADING_1',
      HEADING_2: 'HEADING_2',
      HEADING_3: 'HEADING_3',
      HEADING_4: 'HEADING_4',
      HEADING_5: 'HEADING_5',
      HEADING_6: 'HEADING_6',
    },
    AlignmentType: {
      LEFT: 'LEFT',
      CENTER: 'CENTER',
      RIGHT: 'RIGHT',
      JUSTIFIED: 'JUSTIFIED',
    },
    WidthType: {
      PERCENTAGE: 'PERCENTAGE',
    },
    BorderStyle: {
      SINGLE: 'SINGLE',
    },
    LevelFormat: {
      DECIMAL: 'DECIMAL',
      LOWER_LETTER: 'LOWER_LETTER',
      LOWER_ROMAN: 'LOWER_ROMAN',
      BULLET: 'BULLET',
    },
    PageNumber: {
      CURRENT: 'CURRENT',
    },
    Footer: vi.fn(),
    Header: vi.fn(),
    convertInchesToTwip: vi.fn().mockImplementation(inches => inches * 1440),
  }
})

describe('dOCXGenerator', () => {
  describe('构造函数', () => {
    it('应该使用默认选项创建实例', () => {
      const generator = new DOCXGenerator()

      expect(generator).toBeInstanceOf(DOCXGenerator)
      expect(generator.options).toHaveProperty('margins')
      expect(generator.options).toHaveProperty('defaultFont')
      expect(generator.options).toHaveProperty('headingFont')
      expect(generator.options).toHaveProperty('baseFontSize')
    })

    it('应该使用自定义选项创建实例', () => {
      const options = {
        margins: { top: 2, right: 2, bottom: 2, left: 2 },
        defaultFont: 'Times New Roman',
        baseFontSize: 14,
      }
      const generator = new DOCXGenerator(options)

      expect(generator.options.margins).toEqual({ top: 2, right: 2, bottom: 2, left: 2 })
      expect(generator.options.defaultFont).toBe('Times New Roman')
      expect(generator.options.baseFontSize).toBe(14)
    })
  })

  describe('generate', () => {
    it('应该生成DOCX文档', async () => {
      const generator = new DOCXGenerator()
      const documentData = new DocumentModel({
        metadata: {
          title: 'Test Document',
          author: 'Test Author',
          description: 'Test Description',
        },
        content: [
          {
            type: 'heading',
            level: 1,
            text: 'Hello World',
          },
          {
            type: 'paragraph',
            text: 'This is a test paragraph.',
          },
        ],
      })

      const result = await generator.generate(documentData)

      expect(result.format).toBe('docx')
      expect(result.data).toBeDefined()
      expect(Document).toHaveBeenCalled()
    })

    it('应该处理无效的文档数据', async () => {
      const generator = new DOCXGenerator()

      await expect(generator.generate()).rejects.toThrow(DocumentConverterError)
    })
  })

  describe('processMarkdownText', () => {
    it('应该处理粗体文本', () => {
      const generator = new DOCXGenerator()
      const text = 'This is **bold** text'
      const options = { baseFontSize: 11 }

      // 由于我们模拟了TextRun，这里只能测试方法是否执行，不能测试具体属性
      const result = generator.processMarkdownText(text, options)

      expect(result).toHaveLength(3)
    })

    it('应该处理空文本', () => {
      const generator = new DOCXGenerator()
      const options = { baseFontSize: 11 }

      const result = generator.processMarkdownText('', options)

      expect(result).toHaveLength(1)
    })
  })

  describe('renderBlock', () => {
    it('应该处理不支持的内容块类型', () => {
      const generator = new DOCXGenerator()
      const block = {
        type: 'unknown',
      }
      const options = { baseFontSize: 11 }

      expect(() => generator.renderBlock(block, options)).toThrow(DocumentConverterError)
    })
  })
})
