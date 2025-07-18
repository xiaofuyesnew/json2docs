/**
 * 基础生成器抽象类
 */

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'

export class BaseGenerator {
  /**
   * 创建基础生成器
   * @param {object} options - 生成器选项
   */
  constructor(options = {}) {
    this.options = options
  }

  /**
   * 生成输出
   * @param {DocumentModel} documentData - 文档数据模型
   * @param {object} _options - 生成选项
   * @throws {Error} 必须由子类实现
   */
  async generate(documentData, _options = {}) {
    throw new Error('必须由子类实现')
  }

  /**
   * 验证输入数据
   * @param {DocumentModel} documentData - 文档数据模型
   * @throws {DocumentConverterError} 验证错误
   */
  validateInput(documentData) {
    if (!documentData) {
      throw new DocumentConverterError(
        '缺少文档数据',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (!Array.isArray(documentData.content)) {
      throw new DocumentConverterError(
        '文档内容必须是数组',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }
}
