/**
 * 验证工具函数的单元测试
 */

import { describe, expect, it } from 'vitest'

import { isEmpty, validateEnum, validateRequiredFields, validateType } from '../../src/utils/validation.js'

describe('验证工具函数', () => {
  describe('isEmpty', () => {
    it('应该检测null和undefined为空', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it('应该检测空字符串为空', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('  ')).toBe(true)
    })

    it('应该检测非空字符串不为空', () => {
      expect(isEmpty('test')).toBe(false)
      expect(isEmpty(' test ')).toBe(false)
    })

    it('应该检测空数组为空', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('应该检测非空数组不为空', () => {
      expect(isEmpty([1, 2, 3])).toBe(false)
    })

    it('应该检测空对象为空', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('应该检测非空对象不为空', () => {
      expect(isEmpty({ key: 'value' })).toBe(false)
    })

    it('应该检测数字和布尔值不为空', () => {
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(1)).toBe(false)
      expect(isEmpty(false)).toBe(false)
      expect(isEmpty(true)).toBe(false)
    })
  })

  describe('validateRequiredFields', () => {
    it('应该返回缺失的字段', () => {
      const obj = { field1: 'value1', field3: 'value3' }
      const requiredFields = ['field1', 'field2', 'field3', 'field4']

      const missingFields = validateRequiredFields(obj, requiredFields)

      expect(missingFields).toEqual(['field2', 'field4'])
    })

    it('应该在对象为null时返回所有必需字段', () => {
      const requiredFields = ['field1', 'field2']

      const missingFields = validateRequiredFields(null, requiredFields)

      expect(missingFields).toEqual(requiredFields)
    })

    it('应该在字段值为空时返回该字段', () => {
      const obj = { field1: '', field2: null, field3: 'value3' }
      const requiredFields = ['field1', 'field2', 'field3']

      const missingFields = validateRequiredFields(obj, requiredFields)

      expect(missingFields).toEqual(['field1', 'field2'])
    })
  })

  describe('validateType', () => {
    it('应该验证字符串类型', () => {
      expect(validateType('test', 'string')).toBe(true)
      expect(validateType(123, 'string')).toBe(false)
    })

    it('应该验证数字类型', () => {
      expect(validateType(123, 'number')).toBe(true)
      expect(validateType('123', 'number')).toBe(false)
    })

    it('应该验证布尔类型', () => {
      expect(validateType(true, 'boolean')).toBe(true)
      expect(validateType('true', 'boolean')).toBe(false)
    })

    it('应该验证数组类型', () => {
      expect(validateType([], 'array')).toBe(true)
      expect(validateType({}, 'array')).toBe(false)
    })

    it('应该验证对象类型', () => {
      expect(validateType({}, 'object')).toBe(true)
      expect(validateType([], 'object')).toBe(false)
      expect(validateType(null, 'object')).toBe(false)
    })
  })

  describe('validateEnum', () => {
    it('应该验证值在允许的列表中', () => {
      const allowedValues = ['a', 'b', 'c']

      expect(validateEnum('a', allowedValues)).toBe(true)
      expect(validateEnum('b', allowedValues)).toBe(true)
      expect(validateEnum('d', allowedValues)).toBe(false)
    })

    it('应该验证数字值', () => {
      const allowedValues = [1, 2, 3]

      expect(validateEnum(1, allowedValues)).toBe(true)
      expect(validateEnum(4, allowedValues)).toBe(false)
    })
  })
})
