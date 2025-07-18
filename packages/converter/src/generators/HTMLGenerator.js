/**
 * HTML格式生成器
 */

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'
import { ConversionResult } from '../models/ConversionResult.js'

import { BaseGenerator } from './BaseGenerator.js'

export class HTMLGenerator extends BaseGenerator {
  /**
   * 创建HTML生成器
   * @param {object} options - 生成器选项
   */
  constructor(options = {}) {
    super(options)

    // HTML生成器特定选项
    this.options = {
      // 是否生成完整HTML文档（包含<!DOCTYPE>和<html>标签）
      fullDocument: true,
      // 是否包含内联样式
      inlineStyles: true,
      // 是否美化HTML输出
      prettyPrint: false,
      // 自定义CSS类前缀
      classPrefix: 'json-doc-',
      // 覆盖默认选项
      ...options,
    }
  }

  /**
   * 生成HTML输出
   * @param {DocumentModel} documentData - 文档数据模型
   * @param {object} options - 生成选项
   * @returns {Promise<ConversionResult>} 转换结果
   * @throws {DocumentConverterError} 转换错误
   */
  async generate(documentData, options = {}) {
    try {
      // 验证输入
      this.validateInput(documentData)

      // 合并选项
      const mergedOptions = { ...this.options, ...options }

      // 生成HTML内容
      let htmlContent = ''

      if (mergedOptions.fullDocument) {
        htmlContent = this.generateFullDocument(documentData, mergedOptions)
      }
      else {
        htmlContent = this.generateDocumentFragment(documentData, mergedOptions)
      }

      // 返回转换结果
      return new ConversionResult('html', htmlContent, {
        documentTitle: documentData.metadata.title,
      })
    }
    catch (error) {
      if (error instanceof DocumentConverterError) {
        throw error
      }

      throw new DocumentConverterError(
        `HTML生成失败: ${error.message}`,
        ERROR_CODES.CONVERSION_FAILED,
        { originalError: error },
      )
    }
  }

  /**
   * 生成完整HTML文档
   * @param {DocumentModel} documentData - 文档数据模型
   * @param {object} options - 生成选项
   * @returns {string} HTML文档
   * @private
   */
  generateFullDocument(documentData, options) {
    const { metadata, styles } = documentData
    const bodyContent = this.generateDocumentFragment(documentData, options)
    const cssStyles = options.inlineStyles ? this.generateCssStyles(styles, options) : ''

    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(metadata.title)}</title>
  <meta name="author" content="${this.escapeHtml(metadata.author)}">
  <meta name="description" content="${this.escapeHtml(metadata.description)}">
  ${cssStyles ? `<style>\n${cssStyles}\n</style>` : ''}
</head>
<body>
  <div class="${options.classPrefix}container">
${bodyContent}
  </div>
</body>
</html>`

    // 美化输出（简单缩进）
    if (options.prettyPrint) {
      html = this.prettyPrintHtml(html)
    }

    return html
  }

  /**
   * 生成HTML文档片段
   * @param {DocumentModel} documentData - 文档数据模型
   * @param {object} options - 生成选项
   * @returns {string} HTML片段
   * @private
   */
  generateDocumentFragment(documentData, options) {
    const { content } = documentData

    // 转换每个内容块
    const contentHtml = content.map(block => this.renderContentBlock(block, options)).join('\n')

    return contentHtml
  }

  /**
   * 渲染内容块
   * @param {ContentBlock} block - 内容块
   * @param {object} options - 生成选项
   * @returns {string} HTML片段
   * @private
   */
  renderContentBlock(block, options) {
    const { classPrefix } = options

    switch (block.type) {
      case 'heading':
        return this.renderHeading(block, classPrefix)

      case 'paragraph':
        return this.renderParagraph(block, classPrefix)

      case 'list':
        return this.renderList(block, classPrefix)

      case 'table':
        return this.renderTable(block, classPrefix)

      case 'image':
        return this.renderImage(block, classPrefix)

      default:
        throw new DocumentConverterError(
          `不支持的内容块类型: ${block.type}`,
          ERROR_CODES.CONVERSION_FAILED,
        )
    }
  }

  /**
   * 渲染标题
   * @param {ContentBlock} block - 标题块
   * @param {string} classPrefix - CSS类前缀
   * @returns {string} HTML标题
   * @private
   */
  renderHeading(block, classPrefix) {
    const { level, text, id } = block
    const validLevel = Math.min(Math.max(Number.parseInt(level) || 1, 1), 6)
    const idAttr = id ? ` id="${this.escapeHtml(id)}"` : ''

    return `    <h${validLevel}${idAttr} class="${classPrefix}heading ${classPrefix}h${validLevel}">${this.escapeHtml(text)}</h${validLevel}>`
  }

  /**
   * 渲染段落
   * @param {ContentBlock} block - 段落块
   * @param {string} classPrefix - CSS类前缀
   * @returns {string} HTML段落
   * @private
   */
  renderParagraph(block, classPrefix) {
    const { text, alignment } = block
    const alignClass = alignment ? ` ${classPrefix}align-${alignment}` : ''

    return `    <p class="${classPrefix}paragraph${alignClass}">${this.processText(text)}</p>`
  }

  /**
   * 渲染列表
   * @param {ContentBlock} block - 列表块
   * @param {string} classPrefix - CSS类前缀
   * @returns {string} HTML列表
   * @private
   */
  renderList(block, classPrefix) {
    const { listType, items } = block
    const tag = listType === 'ordered' ? 'ol' : 'ul'
    const listClass = `${classPrefix}list ${classPrefix}${listType}-list`

    // 处理列表项
    const listItems = items.map((item) => {
      const itemText = typeof item === 'string' ? item : item.text
      const itemLevel = typeof item === 'object' && item.level ? item.level : 0
      const indentStyle = itemLevel > 0 ? ` style="margin-left: ${itemLevel * 20}px;"` : ''

      return `      <li class="${classPrefix}list-item"${indentStyle}>${this.processText(itemText)}</li>`
    }).join('\n')

    return `    <${tag} class="${listClass}">
${listItems}
    </${tag}>`
  }

  /**
   * 渲染表格
   * @param {ContentBlock} block - 表格块
   * @param {string} classPrefix - CSS类前缀
   * @returns {string} HTML表格
   * @private
   */
  renderTable(block, classPrefix) {
    const { headers, rows } = block

    // 表头行
    let tableHtml = ''
    if (headers && headers.length > 0) {
      const headerCells = headers.map(header =>
        `        <th class="${classPrefix}table-header">${this.escapeHtml(header)}</th>`,
      ).join('\n')

      tableHtml += `      <thead>
        <tr>
${headerCells}
        </tr>
      </thead>\n`
    }

    // 数据行
    if (rows && rows.length > 0) {
      const tableRows = rows.map((row) => {
        const cells = row.map(cell =>
          `          <td class="${classPrefix}table-cell">${this.processText(cell)}</td>`,
        ).join('\n')

        return `        <tr>
${cells}
        </tr>`
      }).join('\n')

      tableHtml += `      <tbody>
${tableRows}
      </tbody>`
    }

    return `    <table class="${classPrefix}table">
${tableHtml}
    </table>`
  }

  /**
   * 渲染图片
   * @param {ContentBlock} block - 图片块
   * @param {string} classPrefix - CSS类前缀
   * @returns {string} HTML图片
   * @private
   */
  renderImage(block, classPrefix) {
    const { src, alt, width, height } = block

    let sizeAttrs = ''
    if (width)
      sizeAttrs += ` width="${width}"`
    if (height)
      sizeAttrs += ` height="${height}"`

    return `    <figure class="${classPrefix}figure">
      <img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt || '')}"${sizeAttrs} class="${classPrefix}image">
      ${alt ? `<figcaption class="${classPrefix}caption">${this.escapeHtml(alt)}</figcaption>` : ''}
    </figure>`
  }

  /**
   * 生成CSS样式
   * @param {StylesModel} styles - 样式模型
   * @param {object} options - 生成选项
   * @returns {string} CSS样式
   * @private
   */
  generateCssStyles(styles, options) {
    const { classPrefix } = options
    const { fonts, colors, sizes, spacing } = styles

    return `/* 基础样式 */
.${classPrefix}container {
  font-family: ${fonts.default};
  color: ${colors.text};
  background-color: ${colors.background};
  line-height: ${spacing.lineHeight};
  font-size: ${sizes.baseFontSize};
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

/* 标题样式 */
.${classPrefix}heading {
  font-family: ${fonts.heading};
  color: ${colors.heading};
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.${classPrefix}h1 { font-size: ${sizes.h1}; }
.${classPrefix}h2 { font-size: ${sizes.h2}; }
.${classPrefix}h3 { font-size: ${sizes.h3}; }
.${classPrefix}h4 { font-size: ${sizes.h4}; }
.${classPrefix}h5 { font-size: ${sizes.h5}; }
.${classPrefix}h6 { font-size: ${sizes.h6}; }

/* 段落样式 */
.${classPrefix}paragraph {
  margin-bottom: ${spacing.paragraphSpacing};
}
.${classPrefix}align-left { text-align: left; }
.${classPrefix}align-center { text-align: center; }
.${classPrefix}align-right { text-align: right; }
.${classPrefix}align-justify { text-align: justify; }

/* 列表样式 */
.${classPrefix}list {
  margin-bottom: ${spacing.paragraphSpacing};
}
.${classPrefix}list-item {
  margin-bottom: ${spacing.listItemSpacing};
}

/* 表格样式 */
.${classPrefix}table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${spacing.paragraphSpacing};
}
.${classPrefix}table-header,
.${classPrefix}table-cell {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.${classPrefix}table-header {
  background-color: #f2f2f2;
  font-weight: bold;
}

/* 图片样式 */
.${classPrefix}figure {
  margin: 1em 0;
  text-align: center;
}
.${classPrefix}image {
  max-width: 100%;
  height: auto;
}
.${classPrefix}caption {
  font-size: 0.9em;
  color: #666;
  margin-top: 0.5em;
}`
  }

  /**
   * 处理文本内容（支持简单的Markdown语法）
   * @param {string} text - 原始文本
   * @returns {string} 处理后的HTML
   * @private
   */
  processText(text) {
    if (!text)
      return ''

    let processed = this.escapeHtml(text)

    // 处理粗体 **text**
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // 处理斜体 *text*
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // 处理链接 [text](url)
    processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

    // 处理代码 `code`
    processed = processed.replace(/`(.*?)`/g, '<code>$1</code>')

    return processed
  }

  /**
   * 转义HTML特殊字符
   * @param {string} text - 原始文本
   * @returns {string} 转义后的文本
   * @private
   */
  escapeHtml(text) {
    if (!text)
      return ''

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * 美化HTML输出
   * @param {string} html - 原始HTML
   * @returns {string} 美化后的HTML
   * @private
   */
  prettyPrintHtml(html) {
    // 简单的美化实现，实际项目中可以使用专门的库
    return html
      .replace(/></g, '>\n<')
      .replace(/(<\/[^>]+>)(?!\s)/g, '$1\n')
      .replace(/([^>])\s*(<[^/])/g, '$1\n$2')
  }
}
