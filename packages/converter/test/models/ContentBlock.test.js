/**
 * ContentBlock类的单元测试
 */

import { describe, expect, it } from 'vitest'

import { ContentBlock } from '../../src/models/ContentBlock.js'

describe('contentBlock', () => {
  describe('构造函数', () => {
    it('应该创建标题块', () => {
      const data = {
        type: 'heading',
        level: 2,
        text: '测试标题',
        id: 'test-id',
      }

      const block = new ContentBlock(data)

      expect(block).toBeInstanceOf(ContentBlock)
      expect(block.type).toBe('heading')
      expect(block.level).toBe(2)
      expect(block.text).toBe('测试标题')
      expect(block.id).toBe('test-id')
    })

    it('应该创建段落块', () => {
      const data = {
        type: 'paragraph',
        text: '测试段落',
        alignment: 'center',
      }

      const block = new ContentBlock(data)

      expect(block.type).toBe('paragraph')
      expect(block.text).toBe('测试段落')
      expect(block.alignment).toBe('center')
    })

    it('应该创建列表块', () => {
      const data = {
        type: 'list',
        listType: 'ordered',
        items: [
          { text: '项目1', level: 0 },
          { text: '项目2', level: 1 },
        ],
      }

      const block = new ContentBlock(data)

      expect(block.type).toBe('list')
      expect(block.listType).toBe('ordered')
      expect(block.items).toHaveLength(2)
      expect(block.items[0].text).toBe('项目1')
      expect(block.items[1].level).toBe(1)
    })

    it('应该创建表格块', () => {
      const data = {
        type: 'table',
        headers: ['列1', '列2'],
        rows: [
          ['数据1', '数据2'],
          ['数据3', '数据4'],
        ],
      }

      const block = new ContentBlock(data)

      expect(block.type).toBe('table')
      expect(block.headers).toEqual(['列1', '列2'])
      expect(block.rows).toHaveLength(2)
      expect(block.rows[0]).toEqual(['数据1', '数据2'])
    })

    it('应该创建图片块', () => {
      const data = {
        type: 'image',
        src: 'image.jpg',
        alt: '测试图片',
        width: 300,
        height: 200,
      }

      const block = new ContentBlock(data)

      expect(block.type).toBe('image')
      expect(block.src).toBe('image.jpg')
      expect(block.alt).toBe('测试图片')
      expect(block.width).toBe(300)
      expect(block.height).toBe(200)
    })

    it('应该使用默认值处理缺失字段', () => {
      const headingBlock = new ContentBlock({ type: 'heading' })
      expect(headingBlock.level).toBe(1)
      expect(headingBlock.text).toBe('')

      const paragraphBlock = new ContentBlock({ type: 'paragraph' })
      expect(paragraphBlock.text).toBe('')
      expect(paragraphBlock.alignment).toBe('left')

      const listBlock = new ContentBlock({ type: 'list' })
      expect(listBlock.listType).toBe('unordered')
      expect(listBlock.items).toEqual([])
    })
  })

  describe('validateType', () => {
    it('应该验证有效的类型', () => {
      const validTypes = ['heading', 'paragraph', 'list', 'table', 'image']

      validTypes.forEach((type) => {
        const block = new ContentBlock({ type })
        expect(() => block.validateType()).not.toThrow()
      })
    })

    it('应该在类型缺失时抛出错误', () => {
      expect(() => {
        new ContentBlock({})
      }).toThrow()
    })

    it('应该在类型无效时抛出错误', () => {
      expect(() => {
        new ContentBlock({ type: 'invalid' })
      }).toThrow()
    })
  })
})
