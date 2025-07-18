/**
 * 文档数据模型
 */

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'

import { ContentBlock } from './ContentBlock.js'
import { MetadataModel } from './MetadataModel.js'
import { StylesModel } from './StylesModel.js'

export class DocumentModel {
  /**
   * 创建文档模型
   * @param {object} data - JSON文档数据
   */
  constructor(data) {
    this.version = data.version || '1.0'
    this.metadata = new MetadataModel(data.metadata || {})
    this.content = (data.content || []).map(block => new ContentBlock(block))
    this.styles = new StylesModel(data.styles || {})

    this.validate()
  }

  /**
   * 验证文档结构
   * @throws {DocumentConverterError} 验证错误
   */
  validate() {
    // 验证版本
    if (!this.version) {
      throw new DocumentConverterError(
        '文档必须包含版本信息',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证内容
    if (!Array.isArray(this.content) || this.content.length === 0) {
      throw new DocumentConverterError(
        '文档必须包含至少一个内容块',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }
}
