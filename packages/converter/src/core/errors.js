/**
 * 文档转换器错误类和错误代码
 */

/**
 * 错误代码常量
 */
export const ERROR_CODES = {
  INVALID_JSON: 'INVALID_JSON',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  CONVERSION_FAILED: 'CONVERSION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
}

/**
 * 文档转换器自定义错误类
 */
export class DocumentConverterError extends Error {
  /**
   * 创建文档转换器错误
   * @param {string} message - 错误消息
   * @param {string} code - 错误代码
   * @param {object} details - 错误详情
   */
  constructor(message, code, details = {}) {
    super(message)
    this.name = 'DocumentConverterError'
    this.code = code
    this.details = details
  }
}
