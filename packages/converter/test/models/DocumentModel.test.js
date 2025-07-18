/**
 * DocumentModel类的单元测试
 */

import { describe, expect, it } from 'vitest'

import { DocumentConverterError } from '../../src/core/errors.js'
import { ContentBlock } from '../../src/models/ContentBlock.js'
import { DocumentModel } from '../../src/models/DocumentModel.js'
import { MetadataModel } from '../../src/models/MetadataModel.js'
import { StylesModel } from '../../src/models/StylesModel.js'

describe('documentModel', () => {
  describe('构造函数', () => {
    it('应该创建文档模型实例', () => {
      const data = {
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
        ],
        styles: {
          fonts: {
            default: 'Arial',
          },
        },
      }

      const document = new DocumentModel(data)

      expect(document).toBeInstanceOf(DocumentModel)
      expect(document.version).toBe('1.0')
      expect(document.metadata).toBeInstanceOf(MetadataModel)
      expect(document.metadata.title).toBe('测试文档')
      expect(document.content).toHaveLength(1)
      expect(document.content[0]).toBeInstanceOf(ContentBlock)
      expect(document.styles).toBeInstanceOf(StylesModel)
    })

    it('应该使用默认值处理缺失字段', () => {
      const data = {
        version: '1.0',
        content: [
          {
            type: 'paragraph',
            text: '测试段落',
          },
        ],
      }

      const document = new DocumentModel(data)

      expect(document.metadata).toBeInstanceOf(MetadataModel)
      expect(document.metadata.title).toBe('Untitled Document')
      expect(document.styles).toBeInstanceOf(StylesModel)
    })
  })

  describe('validate', () => {
    it('应该验证有效的文档', () => {
      const data = {
        version: '1.0',
        content: [
          {
            type: 'paragraph',
            text: '测试段落',
          },
        ],
      }

      const document = new DocumentModel(data)

      expect(() => document.validate()).not.toThrow()
    })

    it('应该在缺少版本时抛出错误', () => {
      const data = {
        content: [
          {
            type: 'paragraph',
            text: '测试段落',
          },
        ],
      }

      const document = new DocumentModel(data)
      document.version = null

      expect(() => document.validate()).toThrow(DocumentConverterError)
      expect(() => document.validate()).toThrow('文档必须包含版本信息')
    })

    it('应该在内容为空时抛出错误', () => {
      expect(() => {
        new DocumentModel({
          version: '1.0',
          content: [],
        })
      }).toThrow(DocumentConverterError)
      expect(() => {
        new DocumentModel({
          version: '1.0',
          content: [],
        })
      }).toThrow('文档必须包含至少一个内容块')
    })
  })
})
