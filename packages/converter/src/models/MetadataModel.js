/**
 * 文档元数据模型
 */

export class MetadataModel {
  /**
   * 创建元数据模型
   * @param {object} data - 元数据
   */
  constructor(data = {}) {
    this.title = data.title || 'Untitled Document'
    this.author = data.author || ''
    this.created = data.created || new Date().toISOString().split('T')[0]
    this.description = data.description || ''

    // 保留其他自定义元数据
    Object.keys(data).forEach((key) => {
      if (!['title', 'author', 'created', 'description'].includes(key)) {
        this[key] = data[key]
      }
    })
  }
}
