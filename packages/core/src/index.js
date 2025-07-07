/**
 * JSON2Docs 核心转换引擎
 * 接收包含文档内容和输出格式的配置，生成对应格式的文档
 */

/**
 * 配置验证器
 */
class ConfigValidator {
  /**
   * 验证配置格式是否正确
   * @param {Object} config - 配置对象
   * @returns {Object} 验证结果 { isValid: boolean, errors: string[] }
   */
  static validate(config) {
    const errors = [];

    // 检查配置是否为对象
    if (!config || typeof config !== 'object') {
      errors.push('配置必须是一个对象');
      return { isValid: false, errors };
    }

    // 检查文档内容配置
    if (!config.content) {
      errors.push('缺少文档内容配置 (content)');
    } else if (!Array.isArray(config.content)) {
      errors.push('文档内容配置 (content) 必须是一个数组');
    }

    // 检查输出格式配置
    if (!config.output) {
      errors.push('缺少输出格式配置 (output)');
    } else if (typeof config.output !== 'object') {
      errors.push('输出格式配置 (output) 必须是一个对象');
    } else {
      if (!config.output.format) {
        errors.push('输出格式配置中缺少 format 字段');
      } else if (!['pdf', 'docx', 'html'].includes(config.output.format)) {
        errors.push('不支持的输出格式，支持: pdf, docx, html');
      }
    }

    // 检查样式配置（可选）
    if (config.styles && typeof config.styles !== 'object') {
      errors.push('样式配置 (styles) 必须是一个对象');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证 pdfmake 格式的文档内容
   * @param {Array} content - 文档内容数组
   * @returns {Object} 验证结果
   */
  static validatePdfMakeContent(content) {
    const errors = [];

    if (!Array.isArray(content)) {
      errors.push('文档内容必须是数组格式');
      return { isValid: false, errors };
    }

    // 递归验证内容项
    const validateItem = (item, path = '') => {
      if (!item || typeof item !== 'object') {
        errors.push(`${path} 内容项必须是对象`);
        return;
      }

      // 检查基本属性
      const hasText = 'text' in item;
      const hasTable = 'table' in item;
      const hasImage = 'image' in item;
      const hasUl = 'ul' in item;
      const hasOl = 'ol' in item;
      const hasStack = 'stack' in item;
      const hasColumns = 'columns' in item;

      if (!hasText && !hasTable && !hasImage && !hasUl && !hasOl && !hasStack && !hasColumns) {
        errors.push(`${path} 内容项缺少必要的属性 (text, table, image, ul, ol, stack, columns 之一)`);
      }

      // 验证表格
      if (hasTable && item.table) {
        if (!item.table.body || !Array.isArray(item.table.body)) {
          errors.push(`${path}.table.body 必须是数组`);
        }
      }

      // 验证列表
      if (hasUl && item.ul && !Array.isArray(item.ul)) {
        errors.push(`${path}.ul 必须是数组`);
      }
      if (hasOl && item.ol && !Array.isArray(item.ol)) {
        errors.push(`${path}.ol 必须是数组`);
      }

      // 验证嵌套内容
      if (hasStack && item.stack && Array.isArray(item.stack)) {
        item.stack.forEach((subItem, index) => {
          validateItem(subItem, `${path}.stack[${index}]`);
        });
      }

      if (hasColumns && item.columns && Array.isArray(item.columns)) {
        item.columns.forEach((subItem, index) => {
          validateItem(subItem, `${path}.columns[${index}]`);
        });
      }
    };

    content.forEach((item, index) => {
      validateItem(item, `content[${index}]`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * 格式判别器
 */
class FormatDiscriminator {
  /**
   * 根据配置判别输出格式
   * @param {Object} config - 配置对象
   * @returns {string} 输出格式
   */
  static discriminateFormat(config) {
    if (!config.output || !config.output.format) {
      throw new Error('配置中缺少输出格式信息');
    }

    const format = config.output.format.toLowerCase();

    if (!['pdf', 'docx', 'html'].includes(format)) {
      throw new Error(`不支持的输出格式: ${format}`);
    }

    return format;
  }

  /**
   * 获取格式特定的配置选项
   * @param {Object} config - 配置对象
   * @returns {Object} 格式特定选项
   */
  static getFormatOptions(config) {
    return config.output.options || {};
  }
}

/**
 * 主转换类
 */
export class Json2Docs {
  constructor() {
    this.validators = {
      config: ConfigValidator,
      content: ConfigValidator
    };
  }

  /**
   * 生成文档
   * @param {Object} config - 配置对象
   * @returns {Promise<Object>} 生成结果
   */
  async generate(config) {
    try {
      // 1. 验证配置格式
      const configValidation = this.validators.config.validate(config);
      if (!configValidation.isValid) {
        throw new Error(`配置验证失败: ${configValidation.errors.join(', ')}`);
      }

      // 2. 验证文档内容
      const contentValidation = this.validators.content.validatePdfMakeContent(config.content);
      if (!contentValidation.isValid) {
        throw new Error(`文档内容验证失败: ${contentValidation.errors.join(', ')}`);
      }

      // 3. 判别输出格式
      const format = FormatDiscriminator.discriminateFormat(config);
      const options = FormatDiscriminator.getFormatOptions(config);

      // 4. 根据格式调用对应的生成器
      const result = await this.generateByFormat(format, config, options);

      return {
        success: true,
        format,
        content: result.content,
        outputPath: result.outputPath,
        metadata: {
          generatedAt: new Date().toISOString(),
          format,
          contentLength: config.content.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          generatedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * 根据格式生成文档
   * @param {string} format - 输出格式
   * @param {Object} config - 配置对象
   * @param {Object} options - 格式特定选项
   * @returns {Promise<Object>} 生成结果
   */
  async generateByFormat(format, config, options) {
    switch (format) {
      case 'html':
        return await this.generateHtml(config, options);
      case 'pdf':
        return await this.generatePdf(config, options);
      case 'docx':
        return await this.generateDocx(config, options);
      default:
        throw new Error(`未实现的输出格式: ${format}`);
    }
  }

  /**
   * 生成 HTML DOM 字符串
   * @param {Object} config - 配置对象
   * @param {Object} options - HTML 特定选项
   * @returns {Promise<Object>} HTML 生成结果
   */
  async generateHtml(config, options = {}) {
    // TODO: 实现 HTML 生成器
    // 这里应该将 pdfmake 配置转换为 HTML DOM 字符串
    const htmlContent = this.convertPdfMakeToHtml(config.content, config.styles);

    return {
      content: htmlContent,
      outputPath: null
    };
  }

  /**
   * 生成 PDF 文件
   * @param {Object} config - 配置对象
   * @param {Object} options - PDF 特定选项
   * @returns {Promise<Object>} PDF 生成结果
   */
  async generatePdf(config, options = {}) {
    // TODO: 实现 PDF 生成器（使用 pdfmake）
    throw new Error('PDF 生成功能尚未实现');
  }

  /**
   * 生成 DOCX 文件
   * @param {Object} config - 配置对象
   * @param {Object} options - DOCX 特定选项
   * @returns {Promise<Object>} DOCX 生成结果
   */
  async generateDocx(config, options = {}) {
    // TODO: 实现 DOCX 生成器（使用 docx 库）
    throw new Error('DOCX 生成功能尚未实现');
  }

  /**
   * 将 pdfmake 配置转换为 HTML DOM 字符串
   * @param {Array} content - 文档内容
   * @param {Object} styles - 样式定义
   * @returns {string} HTML DOM 字符串
   */
  convertPdfMakeToHtml(content, styles = {}) {
    const styleMap = this.buildStyleMap(styles);
    const htmlParts = [];

    content.forEach(item => {
      htmlParts.push(this.convertItemToHtml(item, styleMap));
    });

    const htmlContent = htmlParts.join('\n');
    const cssStyles = this.generateCssStyles(styleMap);

    return `<style>${cssStyles}</style>\n${htmlContent}`;
  }

  /**
   * 构建样式映射
   * @param {Object} styles - 样式定义
   * @returns {Object} 样式映射
   */
  buildStyleMap(styles) {
    const styleMap = {};

    Object.keys(styles).forEach(styleName => {
      const style = styles[styleName];
      styleMap[styleName] = this.convertPdfMakeStyleToCss(style);
    });

    return styleMap;
  }

  /**
   * 将 pdfmake 样式转换为 CSS 样式
   * @param {Object} pdfMakeStyle - pdfmake 样式对象
   * @returns {string} CSS 样式字符串
   */
  convertPdfMakeStyleToCss(pdfMakeStyle) {
    const cssProperties = [];

    if (pdfMakeStyle.fontSize) {
      cssProperties.push(`font-size: ${pdfMakeStyle.fontSize}px`);
    }
    if (pdfMakeStyle.bold) {
      cssProperties.push('font-weight: bold');
    }
    if (pdfMakeStyle.italic) {
      cssProperties.push('font-style: italic');
    }
    if (pdfMakeStyle.color) {
      cssProperties.push(`color: ${pdfMakeStyle.color}`);
    }
    if (pdfMakeStyle.alignment) {
      cssProperties.push(`text-align: ${pdfMakeStyle.alignment}`);
    }
    if (pdfMakeStyle.margin) {
      const margin = Array.isArray(pdfMakeStyle.margin) ? pdfMakeStyle.margin : [pdfMakeStyle.margin];
      cssProperties.push(`margin: ${margin.join('px ')}px`);
    }

    return cssProperties.join('; ');
  }

  /**
   * 生成 CSS 样式字符串
   * @param {Object} styleMap - 样式映射
   * @returns {string} CSS 样式字符串
   */
  generateCssStyles(styleMap) {
    const cssRules = [];

    Object.keys(styleMap).forEach(styleName => {
      if (styleMap[styleName]) {
        cssRules.push(`.${styleName} { ${styleMap[styleName]} }`);
      }
    });

    return cssRules.join('\n');
  }

  /**
   * 转换单个内容项为 HTML
   * @param {Object} item - 内容项
   * @param {Object} styleMap - 样式映射
   * @returns {string} HTML 字符串
   */
  convertItemToHtml(item, styleMap) {
    if (item.text) {
      const className = item.style ? ` class="${item.style}"` : '';
      return `<div${className}>${this.escapeHtml(item.text)}</div>`;
    }

    if (item.table) {
      return this.convertTableToHtml(item.table);
    }

    if (item.image) {
      return `<img src="${item.image}" alt="图片" style="max-width: 100%;" />`;
    }

    if (item.ul) {
      return this.convertListToHtml(item.ul, 'ul');
    }

    if (item.ol) {
      return this.convertListToHtml(item.ol, 'ol');
    }

    if (item.stack) {
      const stackContent = item.stack.map(subItem =>
        this.convertItemToHtml(subItem, styleMap)
      ).join('\n');
      return `<div class="stack">${stackContent}</div>`;
    }

    if (item.columns) {
      const columnsContent = item.columns.map(column =>
        this.convertItemToHtml(column, styleMap)
      ).join('\n');
      return `<div class="columns" style="display: flex;">${columnsContent}</div>`;
    }

    return '';
  }

  /**
   * 转换表格为 HTML
   * @param {Object} table - 表格配置
   * @returns {string} HTML 表格字符串
   */
  convertTableToHtml(table) {
    if (!table.body || !Array.isArray(table.body)) {
      return '';
    }

    const rows = table.body.map(row => {
      const cells = row.map(cell => {
        const cellContent = typeof cell === 'string' ? cell : cell.text || '';
        return `<td>${this.escapeHtml(cellContent)}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `<table style="border-collapse: collapse; width: 100%;">${rows}</table>`;
  }

  /**
   * 转换列表为 HTML
   * @param {Array} list - 列表项
   * @param {string} tag - 列表标签 (ul/ol)
   * @returns {string} HTML 列表字符串
   */
  convertListToHtml(list, tag) {
    if (!Array.isArray(list)) {
      return '';
    }

    const items = list.map(item => {
      const content = typeof item === 'string' ? item : item.text || '';
      return `<li>${this.escapeHtml(content)}</li>`;
    }).join('');

    return `<${tag}>${items}</${tag}>`;
  }

  /**
   * HTML 转义
   * @param {string} text - 原始文本
   * @returns {string} 转义后的文本
   */
  escapeHtml(text) {
    if (typeof text !== 'string') {
      return String(text);
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// 导出验证器和判别器（用于测试和扩展）
export { ConfigValidator, FormatDiscriminator };