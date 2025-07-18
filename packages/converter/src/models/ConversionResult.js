/**
 * 转换结果模型
 */

export class ConversionResult {
  /**
   * 创建转换结果
   * @param {string} format - 输出格式
   * @param {*} data - 输出数据
   * @param {object} metadata - 结果元数据
   */
  constructor(format, data, metadata = {}) {
    this.format = format
    this.data = data
    this.metadata = metadata
    this.timestamp = new Date().toISOString()
  }

  /**
   * 转换为Blob对象用于下载
   * @returns {Blob} 数据Blob
   */
  toBlob() {
    switch (this.format) {
      case 'html':
        return new Blob([this.data], { type: 'text/html' })

      case 'pdf':
        return new Blob([this.data], { type: 'application/pdf' })

      case 'docx':
        return new Blob([this.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

      default:
        return new Blob([this.data], { type: 'application/octet-stream' })
    }
  }

  /**
   * 获取推荐的文件名
   * @returns {string} 文件名
   */
  getFileName() {
    const title = this.metadata.documentTitle || 'document'
    const sanitizedTitle = title.replace(/[^\w\u4E00-\u9FA5]/g, '_').toLowerCase()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]

    switch (this.format) {
      case 'html':
        return `${sanitizedTitle}_${timestamp}.html`

      case 'pdf':
        return `${sanitizedTitle}_${timestamp}.pdf`

      case 'docx':
        return `${sanitizedTitle}_${timestamp}.docx`

      default:
        return `${sanitizedTitle}_${timestamp}.bin`
    }
  }
}
