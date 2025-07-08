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
  constructor(options = {}) {
    this.validators = {
      config: ConfigValidator,
      content: ConfigValidator
    };

    // 配置选项
    this.options = {
      defaultFontSize: 12,
      defaultFont: 'Roboto',
      enableSourceMap: true,
      ...options
    };

    // 缓存样式映射
    this.styleCache = new Map();
  }

  /**
   * 设置全局选项
   * @param {Object} options - 选项对象
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
  }

  /**
   * 获取当前选项
   * @returns {Object} 当前选项
   */
  getOptions() {
    return { ...this.options };
  }

  /**
   * 清除样式缓存
   */
  clearStyleCache() {
    this.styleCache.clear();
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

      // 2. 预处理配置
      const processedConfig = this.preprocessConfig(config);

      // 3. 验证文档内容
      const contentValidation = this.validators.content.validatePdfMakeContent(processedConfig.content);
      if (!contentValidation.isValid) {
        throw new Error(`文档内容验证失败: ${contentValidation.errors.join(', ')}`);
      }

      // 4. 判别输出格式
      const format = FormatDiscriminator.discriminateFormat(processedConfig);
      const options = FormatDiscriminator.getFormatOptions(processedConfig);

      // 5. 检查格式支持
      if (!this.isFormatSupported(format)) {
        throw new Error(`不支持的输出格式: ${format}`);
      }

      // 6. 根据格式调用对应的生成器
      const result = await this.generateByFormat(format, processedConfig, options);

      return {
        success: true,
        format,
        content: result.content,
        outputPath: result.outputPath,
        metadata: {
          generatedAt: new Date().toISOString(),
          format,
          contentLength: processedConfig.content.length,
          processedAt: new Date().toISOString(),
          options: this.getOptions()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          generatedAt: new Date().toISOString(),
          format: config?.output?.format || 'unknown'
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
   * 预处理配置
   * @param {Object} config - 原始配置
   * @returns {Object} 处理后的配置
   */
  preprocessConfig(config) {
    const processed = { ...config };

    // 合并默认样式
    if (!processed.styles) {
      processed.styles = {};
    }

    // 添加默认样式
    processed.styles = {
      default: {
        fontSize: this.options.defaultFontSize,
        font: this.options.defaultFont
      },
      ...processed.styles
    };

    // 处理内容项，应用默认样式
    if (processed.content) {
      processed.content = this.processContentItems(processed.content, processed.styles);
    }

    return processed;
  }

  /**
   * 处理内容项，应用默认样式
   * @param {Array} content - 内容数组
   * @param {Object} styles - 样式定义
   * @returns {Array} 处理后的内容数组
   */
  processContentItems(content, styles) {
    return content.map(item => {
      const processed = { ...item };

      // 如果没有指定样式，应用默认样式
      if (!processed.style && !processed.fontSize && !processed.font) {
        processed.style = 'default';
      }

      // 处理嵌套内容
      if (processed.stack && Array.isArray(processed.stack)) {
        processed.stack = this.processContentItems(processed.stack, styles);
      }

      if (processed.columns && Array.isArray(processed.columns)) {
        processed.columns = this.processContentItems(processed.columns, styles);
      }

      return processed;
    });
  }

  /**
   * 验证并获取支持的格式列表
   * @returns {Array} 支持的格式列表
   */
  getSupportedFormats() {
    return ['html', 'pdf', 'docx'];
  }

  /**
   * 检查格式是否支持
   * @param {string} format - 格式名称
   * @returns {boolean} 是否支持
   */
  isFormatSupported(format) {
    return this.getSupportedFormats().includes(format.toLowerCase());
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
    try {
      // 动态导入 pdfmake
      let pdfMake;
      let vfs;

            // 优先使用全局的 pdfmake（CDN 版本）
      if (typeof window !== 'undefined' && window.pdfMake) {
        pdfMake = window.pdfMake;
        if (pdfMake.vfs) {
          vfs = pdfMake.vfs;
        }
      }

      // 如果全局没有，尝试动态导入
      if (!pdfMake) {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts.js');

          pdfMake = pdfMakeModule.default || pdfMakeModule;
          const pdfFonts = pdfFontsModule.default || pdfFontsModule;

          // 尝试多种方式获取 vfs
          if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
            vfs = pdfFonts.pdfMake.vfs;
          } else if (pdfFonts && pdfFonts.vfs) {
            vfs = pdfFonts.vfs;
          } else if (pdfFonts && typeof pdfFonts === 'object') {
            // 查找包含 vfs 的对象
            for (const key in pdfFonts) {
              if (pdfFonts[key] && pdfFonts[key].vfs) {
                vfs = pdfFonts[key].vfs;
                break;
              }
            }
          }
        } catch (error) {
          console.warn('动态导入失败:', error.message);
        }
      }

      if (!pdfMake) {
        throw new Error('无法加载 pdfmake 库');
      }

      // 设置字体（如果可用）
      if (vfs) {
        pdfMake.vfs = vfs;
      } else {
        console.warn('pdfmake 字体文件未加载，可能影响 PDF 显示效果');
      }

      // 构建 pdfmake 文档定义
      const docDefinition = {
        content: config.content,
        styles: config.styles || {},
        defaultStyle: {
          fontSize: this.options.defaultFontSize,
          font: this.options.defaultFont
        }
      };

      // 生成 PDF
      const pdfDoc = pdfMake.createPdf(docDefinition);

      if (options.filename) {
        // 保存到文件
        const outputPath = options.filename;
        return new Promise((resolve, reject) => {
          pdfDoc.getBuffer(async (buffer) => {
            try {
              // 在浏览器环境中，使用下载方式
              if (typeof window !== 'undefined') {
                const blob = new Blob([buffer], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = options.filename;
                link.click();
                URL.revokeObjectURL(url);
                resolve({
                  content: buffer,
                  outputPath: options.filename
                });
              } else {
                // Node.js 环境
                const fs = await import('fs');
                fs.default.writeFileSync(outputPath, buffer);
                resolve({
                  content: buffer,
                  outputPath
                });
              }
            } catch (error) {
              reject(new Error(`文件保存失败: ${error.message}`));
            }
          });
        });
      } else {
        // 返回 buffer
        return new Promise((resolve, reject) => {
          pdfDoc.getBuffer((buffer) => {
            resolve({
              content: buffer,
              outputPath: null
            });
          });
        });
      }
    } catch (error) {
      throw new Error(`PDF 生成失败: ${error.message}`);
    }
  }

    /**
   * 生成 DOCX 文件
   * @param {Object} config - 配置对象
   * @param {Object} options - DOCX 特定选项
   * @returns {Promise<Object>} DOCX 生成结果
   */
  async generateDocx(config, options = {}) {
    try {
      // 动态导入 docx 库
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = await import('docx');

      // 转换 pdfmake 配置为 docx 格式
      const children = await this.convertPdfMakeToDocx(config.content, config.styles);

      // 创建文档
      const doc = new Document({
        sections: [{
          properties: {},
          children
        }]
      });

      // 生成 buffer
      const buffer = await Packer.toBuffer(doc);

      if (options.filename) {
        // 保存到文件
        const outputPath = options.filename;

        if (typeof window !== 'undefined') {
          // 浏览器环境
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = options.filename;
          link.click();
          URL.revokeObjectURL(url);
          return {
            content: buffer,
            outputPath: options.filename
          };
        } else {
          // Node.js 环境
          const fs = await import('fs');
          fs.default.writeFileSync(outputPath, buffer);
          return {
            content: buffer,
            outputPath
          };
        }
      } else {
        return {
          content: buffer,
          outputPath: null
        };
      }
    } catch (error) {
      throw new Error(`DOCX 生成失败: ${error.message}`);
    }
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
    const styleKey = JSON.stringify(styles);

    // 检查缓存
    if (this.styleCache.has(styleKey)) {
      return this.styleCache.get(styleKey);
    }

    Object.keys(styles).forEach(styleName => {
      const style = styles[styleName];
      styleMap[styleName] = this.convertPdfMakeStyleToCss(style);
    });

    // 缓存结果
    this.styleCache.set(styleKey, styleMap);
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
    if (pdfMakeStyle.padding) {
      const padding = Array.isArray(pdfMakeStyle.padding) ? pdfMakeStyle.padding : [pdfMakeStyle.padding];
      cssProperties.push(`padding: ${padding.join('px ')}px`);
    }
    if (pdfMakeStyle.background) {
      cssProperties.push(`background-color: ${pdfMakeStyle.background}`);
    }
    if (pdfMakeStyle.border) {
      cssProperties.push(`border: ${pdfMakeStyle.border}`);
    }
    if (pdfMakeStyle.lineHeight) {
      cssProperties.push(`line-height: ${pdfMakeStyle.lineHeight}`);
    }
    if (pdfMakeStyle.textDecoration) {
      cssProperties.push(`text-decoration: ${pdfMakeStyle.textDecoration}`);
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

    // 处理表头
    let thead = '';
    if (table.headerRows && table.headerRows > 0) {
      const headerRows = table.body.slice(0, table.headerRows);
      thead = headerRows.map(row => {
        const cells = row.map(cell => {
          const cellContent = typeof cell === 'string' ? cell : cell.text || '';
          const cellStyle = this.getTableCellStyle(cell);
          return `<th style="${cellStyle}">${this.escapeHtml(cellContent)}</th>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      thead = `<thead>${thead}</thead>`;
    }

    // 处理表体
    const tbodyRows = table.headerRows ? table.body.slice(table.headerRows) : table.body;
    const tbody = tbodyRows.map(row => {
      const cells = row.map(cell => {
        const cellContent = typeof cell === 'string' ? cell : cell.text || '';
        const cellStyle = this.getTableCellStyle(cell);
        return `<td style="${cellStyle}">${this.escapeHtml(cellContent)}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const tableStyle = this.getTableStyle(table);
    return `<table style="${tableStyle}">${thead}<tbody>${tbody}</tbody></table>`;
  }

  /**
   * 获取表格样式
   * @param {Object} table - 表格配置
   * @returns {string} CSS 样式字符串
   */
  getTableStyle(table) {
    const styles = [
      'border-collapse: collapse',
      'width: 100%',
      'margin: 10px 0'
    ];

    if (table.layout) {
      styles.push(`table-layout: ${table.layout}`);
    }

    return styles.join('; ');
  }

  /**
   * 获取表格单元格样式
   * @param {Object} cell - 单元格配置
   * @returns {string} CSS 样式字符串
   */
  getTableCellStyle(cell) {
    const styles = [
      'border: 1px solid #ddd',
      'padding: 8px',
      'text-align: left'
    ];

    if (cell && typeof cell === 'object') {
      if (cell.alignment) {
        styles.push(`text-align: ${cell.alignment}`);
      }
      if (cell.fillColor) {
        styles.push(`background-color: ${cell.fillColor}`);
      }
      if (cell.bold) {
        styles.push('font-weight: bold');
      }
    }

    return styles.join('; ');
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
   * 将 pdfmake 配置转换为 DOCX 格式
   * @param {Array} content - 文档内容
   * @param {Object} styles - 样式定义
   * @returns {Array} DOCX 子元素数组
   */
  async convertPdfMakeToDocx(content, styles = {}) {
    const { Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = await import('docx');
    const children = [];

    content.forEach(item => {
      const docxElement = this.convertItemToDocx(item, styles);
      if (docxElement) {
        children.push(docxElement);
      }
    });

    return children;
  }

  /**
   * 转换单个内容项为 DOCX 格式
   * @param {Object} item - 内容项
   * @param {Object} styles - 样式定义
   * @returns {Object} DOCX 元素
   */
  async convertItemToDocx(item, styles) {
    const { Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = await import('docx');

    if (item.text) {
      const textRun = new TextRun({
        text: item.text,
        bold: item.bold || (item.style && styles[item.style]?.bold),
        italic: item.italic || (item.style && styles[item.style]?.italic),
        size: item.fontSize || (item.style && styles[item.style]?.fontSize) || 24,
        color: item.color || (item.style && styles[item.style]?.color)
      });

      return new Paragraph({
        children: [textRun],
        alignment: await this.convertAlignment(item.alignment || (item.style && styles[item.style]?.alignment))
      });
    }

    if (item.table) {
      return this.convertTableToDocx(item.table);
    }

    if (item.ul || item.ol) {
      return this.convertListToDocx(item.ul || item.ol, item.ul ? 'ul' : 'ol');
    }

    if (item.stack) {
      const stackChildren = item.stack.map(subItem =>
        this.convertItemToDocx(subItem, styles)
      ).filter(Boolean);

      return stackChildren.length > 0 ? stackChildren : null;
    }

    if (item.columns) {
      // DOCX 不支持列布局，转换为段落
      const columnChildren = item.columns.map(column =>
        this.convertItemToDocx(column, styles)
      ).filter(Boolean);

      return columnChildren.length > 0 ? columnChildren : null;
    }

    return null;
  }

  /**
   * 转换表格为 DOCX 格式
   * @param {Object} table - 表格配置
   * @returns {Object} DOCX 表格
   */
  async convertTableToDocx(table) {
    const { Table, TableRow, TableCell, Paragraph, TextRun } = await import('docx');

    if (!table.body || !Array.isArray(table.body)) {
      return null;
    }

    const rows = table.body.map(row => {
      const cells = row.map(cell => {
        const cellContent = typeof cell === 'string' ? cell : cell.text || '';
        return new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: cellContent })]
            })
          ]
        });
      });

      return new TableRow({ children: cells });
    });

    return new Table({ rows });
  }

  /**
   * 转换列表为 DOCX 格式
   * @param {Array} list - 列表项
   * @param {string} type - 列表类型 (ul/ol)
   * @returns {Array} DOCX 段落数组
   */
  async convertListToDocx(list, type) {
    const { Paragraph, TextRun } = await import('docx');

    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item, index) => {
      const content = typeof item === 'string' ? item : item.text || '';
      const bulletText = type === 'ul' ? '• ' : `${index + 1}. `;

      return new Paragraph({
        children: [
          new TextRun({ text: bulletText, bold: true }),
          new TextRun({ text: content })
        ]
      });
    });
  }

  /**
   * 转换对齐方式
   * @param {string} alignment - pdfmake 对齐方式
   * @returns {string} DOCX 对齐方式
   */
  async convertAlignment(alignment) {
    const { AlignmentType } = await import('docx');
    switch (alignment) {
      case 'left':
        return AlignmentType.LEFT;
      case 'center':
        return AlignmentType.CENTER;
      case 'right':
        return AlignmentType.RIGHT;
      case 'justify':
        return AlignmentType.JUSTIFIED;
      default:
        return AlignmentType.LEFT;
    }
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

  /**
   * 获取文档统计信息
   * @param {Object} config - 配置对象
   * @returns {Object} 统计信息
   */
  getDocumentStats(config) {
    const stats = {
      totalItems: 0,
      textItems: 0,
      tableItems: 0,
      listItems: 0,
      imageItems: 0,
      nestedItems: 0,
      styles: 0
    };

    if (config.content) {
      this.countContentItems(config.content, stats);
    }

    if (config.styles) {
      stats.styles = Object.keys(config.styles).length;
    }

    return stats;
  }

  /**
   * 统计内容项
   * @param {Array} content - 内容数组
   * @param {Object} stats - 统计对象
   */
  countContentItems(content, stats) {
    content.forEach(item => {
      stats.totalItems++;

      if (item.text) stats.textItems++;
      if (item.table) stats.tableItems++;
      if (item.ul || item.ol) stats.listItems++;
      if (item.image) stats.imageItems++;
      if (item.stack || item.columns) stats.nestedItems++;

      // 递归统计嵌套内容
      if (item.stack && Array.isArray(item.stack)) {
        this.countContentItems(item.stack, stats);
      }
      if (item.columns && Array.isArray(item.columns)) {
        this.countContentItems(item.columns, stats);
      }
    });
  }

  /**
   * 验证样式配置
   * @param {Object} styles - 样式配置
   * @returns {Object} 验证结果
   */
  validateStyles(styles) {
    const errors = [];
    const warnings = [];

    if (!styles || typeof styles !== 'object') {
      errors.push('样式配置必须是对象');
      return { isValid: false, errors, warnings };
    }

    Object.keys(styles).forEach(styleName => {
      const style = styles[styleName];

      if (typeof style !== 'object') {
        errors.push(`样式 "${styleName}" 必须是对象`);
        return;
      }

      // 检查字体大小
      if (style.fontSize && (typeof style.fontSize !== 'number' || style.fontSize <= 0)) {
        errors.push(`样式 "${styleName}" 的 fontSize 必须是正数`);
      }

      // 检查颜色格式
      if (style.color && !this.isValidColor(style.color)) {
        warnings.push(`样式 "${styleName}" 的颜色格式可能不正确: ${style.color}`);
      }

      // 检查对齐方式
      if (style.alignment && !['left', 'center', 'right', 'justify'].includes(style.alignment)) {
        errors.push(`样式 "${styleName}" 的对齐方式无效: ${style.alignment}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 验证颜色格式
   * @param {string} color - 颜色值
   * @returns {boolean} 是否有效
   */
  isValidColor(color) {
    // 简单的颜色验证
    const colorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\))$/;
    return colorRegex.test(color);
  }

  /**
   * 获取支持的样式属性
   * @returns {Array} 支持的样式属性列表
   */
  getSupportedStyleProperties() {
    return [
      'fontSize', 'font', 'bold', 'italic', 'color', 'alignment',
      'margin', 'padding', 'background', 'border', 'lineHeight',
      'textDecoration', 'opacity', 'fillColor'
    ];
  }
}

// 导出验证器和判别器（用于测试和扩展）
export { ConfigValidator, FormatDiscriminator };