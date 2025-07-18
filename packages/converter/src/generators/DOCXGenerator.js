/**
 * DOCX格式生成器
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertInchesToTwip,
} from 'docx'

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'
import { ConversionResult } from '../models/ConversionResult.js'

import { BaseGenerator } from './BaseGenerator.js'

export class DOCXGenerator extends BaseGenerator {
  /**
   * 创建DOCX生成器
   * @param {object} options - 生成器选项
   */
  constructor(options = {}) {
    super(options)

    // DOCX生成器特定选项
    this.options = {
      // 页面边距（英寸）
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
      // 默认字体
      defaultFont: 'Arial',
      // 标题字体
      headingFont: 'Arial',
      // 基础字体大小（磅）
      baseFontSize: 11,
      // 行高（相对于字体大小）
      lineHeight: 1.15,
      // 段落间距（磅）
      paragraphSpacing: 8,
      // 是否添加页眉页脚
      includeHeaderFooter: true,
      // 是否添加页码
      includePageNumbers: true,
      // 覆盖默认选项
      ...options,
    }
  }

  /**
   * 生成DOCX输出
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

      // 创建文档对象
      const doc = new Document({
        title: documentData.metadata.title || 'Document',
        description: documentData.metadata.description || '',
        creator: documentData.metadata.author || 'JSON2Docs Converter',
        styles: this.createDocumentStyles(documentData.styles, mergedOptions),
        numbering: {
          config: [
            {
              reference: 'ordered-list',
              levels: [
                {
                  level: 0,
                  format: LevelFormat.DECIMAL,
                  text: '%1.',
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
                {
                  level: 1,
                  format: LevelFormat.LOWER_LETTER,
                  text: '%2.',
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(1.0), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
                {
                  level: 2,
                  format: LevelFormat.LOWER_ROMAN,
                  text: '%3.',
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(1.5), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
              ],
            },
            {
              reference: 'unordered-list',
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: '•',
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
                {
                  level: 1,
                  format: LevelFormat.BULLET,
                  text: '○',
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(1.0), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
                {
                  level: 2,
                  format: LevelFormat.BULLET,
                  text: '■',
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(1.5), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
              ],
            },
          ],
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(mergedOptions.margins.top),
                right: convertInchesToTwip(mergedOptions.margins.right),
                bottom: convertInchesToTwip(mergedOptions.margins.bottom),
                left: convertInchesToTwip(mergedOptions.margins.left),
              },
            },
          },
          headers: mergedOptions.includeHeaderFooter
            ? {
                default: new Header({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: documentData.metadata.title || '',
                          size: mergedOptions.baseFontSize * 10, // 字号单位为半点，所以乘以2
                          font: mergedOptions.defaultFont,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              }
            : undefined,
          footers: mergedOptions.includePageNumbers
            ? {
                default: new Footer({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          children: [PageNumber.CURRENT],
                          size: mergedOptions.baseFontSize * 10,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              }
            : undefined,
          children: this.processContent(documentData.content, mergedOptions),
        }],
      })

      // 生成DOCX文件
      const buffer = await doc.save()

      // 返回转换结果
      return new ConversionResult('docx', buffer, {
        documentTitle: documentData.metadata.title,
      })
    }
    catch (error) {
      if (error instanceof DocumentConverterError) {
        throw error
      }

      throw new DocumentConverterError(
        `DOCX生成失败: ${error.message}`,
        ERROR_CODES.CONVERSION_FAILED,
        { originalError: error },
      )
    }
  }

  /**
   * 创建文档样式
   * @param {StylesModel} styles - 样式模型
   * @param {object} options - 选项
   * @returns {object} 文档样式配置
   * @private
   */
  createDocumentStyles(styles, options) {
    const { baseFontSize, defaultFont, headingFont } = options

    return {
      default: {
        document: {
          run: {
            font: defaultFont,
            size: baseFontSize * 2, // 字号单位为半点，所以乘以2
          },
          paragraph: {
            spacing: {
              after: options.paragraphSpacing * 20, // 段落间距，单位为twip (1/20 point)
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: defaultFont,
            size: baseFontSize * 2,
          },
          paragraph: {
            spacing: {
              after: options.paragraphSpacing * 20,
            },
          },
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: headingFont,
            size: baseFontSize * 4, // 24pt
            bold: true,
          },
          paragraph: {
            spacing: {
              before: options.paragraphSpacing * 40,
              after: options.paragraphSpacing * 20,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: headingFont,
            size: baseFontSize * 3, // 18pt
            bold: true,
          },
          paragraph: {
            spacing: {
              before: options.paragraphSpacing * 30,
              after: options.paragraphSpacing * 20,
            },
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: headingFont,
            size: baseFontSize * 2.5, // 15pt
            bold: true,
          },
          paragraph: {
            spacing: {
              before: options.paragraphSpacing * 20,
              after: options.paragraphSpacing * 20,
            },
          },
        },
        {
          id: 'Heading4',
          name: 'Heading 4',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: headingFont,
            size: baseFontSize * 2, // 12pt
            bold: true,
            italics: true,
          },
        },
        {
          id: 'Heading5',
          name: 'Heading 5',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: headingFont,
            size: baseFontSize * 2, // 12pt
            bold: true,
          },
        },
        {
          id: 'Heading6',
          name: 'Heading 6',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: headingFont,
            size: baseFontSize * 2, // 12pt
            bold: true,
            italics: true,
          },
        },
        {
          id: 'TableHeader',
          name: 'Table Header',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 100,
              after: 100,
            },
          },
        },
      ],
    }
  }

  /**
   * 处理文档内容
   * @param {Array<ContentBlock>} content - 内容块数组
   * @param {object} options - 选项
   * @returns {Array} DOCX元素数组
   * @private
   */
  processContent(content, options) {
    const children = []

    // 处理每个内容块
    for (const block of content) {
      try {
        const docxElements = this.renderBlock(block, options)
        children.push(...docxElements)
      }
      catch (error) {
        // 如果渲染失败，添加错误信息
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[渲染错误: ${block.type} - ${error.message}]`,
                color: 'FF0000',
              }),
            ],
          }),
        )
      }
    }

    return children
  }

  /**
   * 渲染内容块
   * @param {ContentBlock} block - 内容块
   * @param {object} options - 选项
   * @returns {Array} DOCX元素数组
   * @private
   */
  renderBlock(block, options) {
    switch (block.type) {
      case 'heading':
        return [this.renderHeading(block, options)]

      case 'paragraph':
        return [this.renderParagraph(block, options)]

      case 'list':
        return this.renderList(block, options)

      case 'table':
        return [this.renderTable(block, options)]

      case 'image':
        return [this.renderImage(block, options)]

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
   * @param {object} _options - 选项
   * @returns {Paragraph} DOCX段落
   * @private
   */
  renderHeading(block, _options) {
    const { level, text, id } = block

    // 映射标题级别
    const headingLevelMap = {
      1: HeadingLevel.HEADING_1,
      2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3,
      4: HeadingLevel.HEADING_4,
      5: HeadingLevel.HEADING_5,
      6: HeadingLevel.HEADING_6,
    }

    // 确保级别在有效范围内
    const validLevel = Math.min(Math.max(Number.parseInt(level) || 1, 1), 6)

    return new Paragraph({
      text,
      heading: headingLevelMap[validLevel],
      id,
      style: `Heading${validLevel}`,
    })
  }

  /**
   * 渲染段落
   * @param {ContentBlock} block - 段落块
   * @param {object} options - 选项
   * @returns {Paragraph} DOCX段落
   * @private
   */
  renderParagraph(block, options) {
    const { text, alignment } = block

    // 映射对齐方式
    const alignmentMap = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
      justify: AlignmentType.JUSTIFIED,
    }

    // 处理Markdown语法
    const textRuns = this.processMarkdownText(text, options)

    return new Paragraph({
      children: textRuns,
      alignment: alignmentMap[alignment] || AlignmentType.LEFT,
      style: 'Normal',
    })
  }

  /**
   * 处理Markdown文本
   * @param {string} text - 原始文本
   * @param {object} options - 选项
   * @returns {Array<TextRun>} TextRun数组
   * @private
   */
  processMarkdownText(text, options) {
    if (!text)
      return [new TextRun({ text: '' })]

    const runs = []
    const currentText = text

    // 处理粗体 **text**
    const boldRegex = /\*\*(.*?)\*\*/g
    let boldMatch
    let lastIndex = 0

    boldMatch = boldRegex.exec(currentText)
    while (boldMatch) {
      // 添加粗体前的普通文本
      if (boldMatch.index > lastIndex) {
        runs.push(new TextRun({
          text: currentText.substring(lastIndex, boldMatch.index),
          size: options.baseFontSize * 2,
        }))
      }

      // 添加粗体文本
      runs.push(new TextRun({
        text: boldMatch[1],
        bold: true,
        size: options.baseFontSize * 2,
      }))

      lastIndex = boldMatch.index + boldMatch[0].length
      boldMatch = boldRegex.exec(currentText)
    }

    // 添加剩余的文本
    if (lastIndex < currentText.length) {
      runs.push(new TextRun({
        text: currentText.substring(lastIndex),
        size: options.baseFontSize * 2,
      }))
    }

    // 如果没有匹配到任何Markdown语法，返回原始文本
    if (runs.length === 0) {
      runs.push(new TextRun({
        text,
        size: options.baseFontSize * 2,
      }))
    }

    return runs
  }

  /**
   * 渲染列表
   * @param {ContentBlock} block - 列表块
   * @param {object} options - 选项
   * @returns {Array<Paragraph>} DOCX段落数组
   * @private
   */
  renderList(block, options) {
    const { listType, items } = block
    const paragraphs = []

    // 确定列表类型
    const numbering = {
      reference: listType === 'ordered'
        ? 'ordered-list'
        : 'unordered-list',
    }

    // 处理每个列表项
    items.forEach((item, _index) => {
      const itemText = typeof item === 'string'
        ? item
        : item.text
      const itemLevel = typeof item === 'object' && item.level
        ? Math.min(item.level, 2)
        : 0

      // 处理Markdown语法
      const textRuns = this.processMarkdownText(itemText, options)

      // 创建列表项段落
      paragraphs.push(
        new Paragraph({
          children: textRuns,
          numbering: {
            ...numbering,
            level: itemLevel,
          },
        }),
      )
    })

    return paragraphs
  }

  /**
   * 渲染表格
   * @param {ContentBlock} block - 表格块
   * @param {object} options - 选项
   * @returns {Table} DOCX表格
   * @private
   */
  renderTable(block, options) {
    const { headers, rows } = block
    const tableRows = []
    const hasHeaders = headers && headers.length > 0

    // 创建表头行
    if (hasHeaders) {
      const headerCells = headers.map(header =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: header,
                  bold: true,
                  size: options.baseFontSize * 2,
                }),
              ],
              style: 'TableHeader',
            }),
          ],
          shading: {
            fill: 'F2F2F2',
          },
        }),
      )

      tableRows.push(new TableRow({ children: headerCells }))
    }

    // 创建数据行
    if (rows && rows.length > 0) {
      rows.forEach((rowData, rowIndex) => {
        const cells = rowData.map(cellData =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: String(cellData),
                    size: options.baseFontSize * 2,
                  }),
                ],
              }),
            ],
            shading: {
              fill: rowIndex % 2 === 1
                ? 'FFFFFF'
                : 'FAFAFA',
            },
          }),
        )

        tableRows.push(new TableRow({ children: cells }))
      })
    }

    // 创建表格
    return new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'AAAAAA',
        },
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'AAAAAA',
        },
        left: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'AAAAAA',
        },
        right: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'AAAAAA',
        },
        insideHorizontal: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'AAAAAA',
        },
        insideVertical: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: 'AAAAAA',
        },
      },
    })
  }

  /**
   * 渲染图片
   * @param {ContentBlock} block - 图片块
   * @param {object} options - 选项
   * @returns {Paragraph} DOCX段落
   * @private
   */
  renderImage(block, options) {
    const { src, width: imageWidth, height: imageHeight } = block

    try {
      // 处理base64图像
      if (src && src.startsWith('data:image/')) {
        const base64Data = src.split(',')[1]
        const { Buffer } = require('node:buffer')
        const imageBuffer = Buffer.from(base64Data, 'base64')

        // 计算图像尺寸
        const width = imageWidth || 400
        const height = imageHeight || 300

        // 创建图像段落
        return new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width,
                height,
              },
            }),
          ],
          alignment: AlignmentType.CENTER,
        })
      }

      // 如果不是base64图像，创建占位符
      return this.renderImagePlaceholder(block, options)
    }
    catch {
      // 如果图像处理失败，创建占位符
      return this.renderImagePlaceholder(block, options)
    }
  }

  /**
   * 渲染图片占位符
   * @param {ContentBlock} block - 图片块
   * @param {object} options - 选项
   * @returns {Paragraph} DOCX段落
   * @private
   */
  renderImagePlaceholder(block, options) {
    return new Paragraph({
      children: [
        new TextRun({
          text: `[图片: ${block.alt || '无描述'}]`,
          italics: true,
          size: options.baseFontSize * 2,
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  }
}
