/**
 * DocumentValidator类的单元测试
 */

import { describe, expect, it } from 'vitest'

import { DocumentConverterError } from '../../src/core/errors.js'
import { DocumentValidator } from '../../src/utils/validator.js'

describe('documentValidator', () => {
  describe('validate', () => {
    it('应该验证有效的文档', () => {
      const validDocument = {
        version: '1.0',
        content: [
          {
            type: 'heading',
            level: 1,
            text: '测试标题',
          },
        ],
      }

      expect(() => DocumentValidator.validate(validDocument)).not.toThrow()
    })

    it('应该在文档为null时抛出错误', () => {
      expect(() => DocumentValidator.validate(null)).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validate(null)).toThrow('无效的JSON文档')
    })

    it('应该在缺少必需字段时抛出错误', () => {
      const invalidDocument = {
        content: [],
      }

      expect(() => DocumentValidator.validate(invalidDocument)).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validate(invalidDocument)).toThrow('缺少必需字段: version')
    })
  })

  describe('validateVersion', () => {
    it('应该验证有效的版本', () => {
      expect(() => DocumentValidator.validateVersion('1.0')).not.toThrow()
      expect(() => DocumentValidator.validateVersion('2.3.1')).not.toThrow()
    })

    it('应该在版本不是字符串时抛出错误', () => {
      expect(() => DocumentValidator.validateVersion(123)).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateVersion(123)).toThrow('版本必须是字符串')
    })

    it('应该在版本格式无效时抛出错误', () => {
      expect(() => DocumentValidator.validateVersion('invalid')).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateVersion('invalid')).toThrow('无效的版本格式')
    })
  })

  describe('validateContent', () => {
    it('应该验证有效的内容', () => {
      const validContent = [
        {
          type: 'heading',
          level: 1,
          text: '测试标题',
        },
      ]

      expect(() => DocumentValidator.validateContent(validContent)).not.toThrow()
    })

    it('应该在内容不是数组时抛出错误', () => {
      expect(() => DocumentValidator.validateContent('not an array')).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateContent('not an array')).toThrow('内容必须是数组')
    })

    it('应该在内容为空数组时抛出错误', () => {
      expect(() => DocumentValidator.validateContent([])).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateContent([])).toThrow('内容不能为空')
    })
  })

  describe('validateContentBlock', () => {
    it('应该验证有效的标题块', () => {
      const headingBlock = {
        type: 'heading',
        level: 1,
        text: '测试标题',
      }

      expect(() => DocumentValidator.validateContentBlock(headingBlock)).not.toThrow()
    })

    it('应该验证有效的段落块', () => {
      const paragraphBlock = {
        type: 'paragraph',
        text: '测试段落',
      }

      expect(() => DocumentValidator.validateContentBlock(paragraphBlock)).not.toThrow()
    })

    it('应该在块类型无效时抛出错误', () => {
      const invalidBlock = {
        type: 'invalid',
        text: '测试',
      }

      expect(() => DocumentValidator.validateContentBlock(invalidBlock)).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateContentBlock(invalidBlock)).toThrow('不支持的内容块类型')
    })
  })

  describe('validateHeadingBlock', () => {
    it('应该验证有效的标题块', () => {
      const validHeading = {
        type: 'heading',
        level: 1,
        text: '测试标题',
      }

      expect(() => DocumentValidator.validateHeadingBlock(validHeading)).not.toThrow()
    })

    it('应该在缺少必需字段时抛出错误', () => {
      const invalidHeading = {
        type: 'heading',
        level: 1,
      }

      expect(() => DocumentValidator.validateHeadingBlock(invalidHeading)).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateHeadingBlock(invalidHeading)).toThrow('缺少必需字段: text')
    })

    it('应该在级别无效时抛出错误', () => {
      const invalidHeading = {
        type: 'heading',
        level: 7, // 超出1-6范围
        text: '测试标题',
      }

      expect(() => DocumentValidator.validateHeadingBlock(invalidHeading)).toThrow(DocumentConverterError)
      expect(() => DocumentValidator.validateHeadingBlock(invalidHeading)).toThrow('标题级别必须是1-6之间的整数')
    })
  })
})
