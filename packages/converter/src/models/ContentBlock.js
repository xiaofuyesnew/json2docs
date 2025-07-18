/**
 * 内容块模型
 */

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'

export class ContentBlock {
  /**
   * 创建内容块
   * @param {object} data - 内容块数据
   */
  constructor(data) {
    this.type = data.type

    // 验证类型
    this.validateType()

    // 根据类型初始化特定属性
    switch (this.type) {
      case 'heading':
        this.level = data.level || 1
        this.text = data.text || ''
        this.id = data.id
        break

      case 'paragraph':
        this.text = data.text || ''
        this.alignment = data.alignment || 'left'
        break

      case 'list':
        this.listType = data.listType || 'unordered'
        this.items = data.items || []
        break

      case 'table':
        this.headers = data.headers || []
        this.rows = data.rows || []
        break

      case 'image':
        this.src = data.src || ''
        this.alt = data.alt || ''
        this.width = data.width
        this.height = data.height
        break

      default:
        // 自定义类型，保留所有属性
        Object.assign(this, data)
    }
  }

  /**
   * 验证内容块类型
   * @throws {DocumentConverterError} 验证错误
   */
  validateType() {
    const validTypes = ['heading', 'paragraph', 'list', 'table', 'image']

    if (!this.type) {
      throw new DocumentConverterError(
        '内容块必须指定类型',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (!validTypes.includes(this.type)) {
      throw new DocumentConverterError(
        `无效的内容块类型: ${this.type}`,
        ERROR_CODES.VALIDATION_ERROR,
        { validTypes },
      )
    }
  }
}
