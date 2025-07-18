/**
 * BaseGenerator类的单元测试
 */

import { describe, expect, it } from 'vitest'

import { DocumentConverterError } from '../../src/core/errors.js'
import { BaseGenerator } from '../../src/generators/BaseGenerator.js'

describe('baseGenerator', () => {
  describe('构造函数', () => {
    it('应该使用默认选项创建实例', () => {
      const generator = new BaseGenerator()

      expect(generator).toBeInstanceOf(BaseGenerator)
      expect(generator.options).toEqual({})
    })

    it('应该使用自定义选项创建实例', () => {
      const options = { option1: 'value1', option2: 'value2' }
      const generator = new BaseGenerator(options)

      expect(generator.options).toEqual(options)
    })
  })

  describe('generate', () => {
    it('应该抛出"必须由子类实现"错误', async () => {
      const generator = new BaseGenerator()

      await expect(generator.generate()).rejects.toThrow('必须由子类实现')
    })
  })

  describe('validateInput', () => {
    it('应该在缺少文档数据时抛出错误', () => {
      const generator = new BaseGenerator()

      expect(() => generator.validateInput()).toThrow(DocumentConverterError)
      expect(() => generator.validateInput()).toThrow('缺少文档数据')
    })

    it('应该在内容不是数组时抛出错误', () => {
      const generator = new BaseGenerator()
      const invalidDocument = { content: 'not an array' }

      expect(() => generator.validateInput(invalidDocument)).toThrow(DocumentConverterError)
      expect(() => generator.validateInput(invalidDocument)).toThrow('文档内容必须是数组')
    })

    it('应该验证有效的文档数据', () => {
      const generator = new BaseGenerator()
      const validDocument = { content: [] }

      expect(() => generator.validateInput(validDocument)).not.toThrow()
    })
  })
})
