/**
 * 错误处理类的单元测试
 */

import { describe, expect, it } from 'vitest'

import { DocumentConverterError, ERROR_CODES } from '../../src/core/errors.js'

describe('documentConverterError', () => {
  it('应该创建错误实例', () => {
    const error = new DocumentConverterError('测试错误', ERROR_CODES.VALIDATION_ERROR)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(DocumentConverterError)
    expect(error.name).toBe('DocumentConverterError')
    expect(error.message).toBe('测试错误')
    expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR)
    expect(error.details).toEqual({})
  })

  it('应该包含错误详情', () => {
    const details = { field: 'test', value: 123 }
    const error = new DocumentConverterError('详细错误', ERROR_CODES.INVALID_JSON, details)

    expect(error.details).toEqual(details)
  })
})

describe('eRROR_CODES', () => {
  it('应该定义所有必要的错误代码', () => {
    expect(ERROR_CODES.INVALID_JSON).toBeDefined()
    expect(ERROR_CODES.UNSUPPORTED_FORMAT).toBeDefined()
    expect(ERROR_CODES.CONVERSION_FAILED).toBeDefined()
    expect(ERROR_CODES.VALIDATION_ERROR).toBeDefined()
  })
})
