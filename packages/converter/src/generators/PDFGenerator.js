/**
 * PDF格式生成器
 */

import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib'

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'
import { ConversionResult } from '../models/ConversionResult.js'

import { BaseGenerator } from './BaseGenerator.js'

export class PDFGenerator extends BaseGenerator {
  /**
   * 创建PDF生成器
   * @param {object} options - 生成器选项
   */
  constructor(options = {}) {
    super(options)

    // PDF生成器特定选项
    this.options = {
      // 页面大小
      pageSize: PageSizes.A4,
      // 页面边距（上、右、下、左）
      margins: { top: 50, right: 50, bottom: 50, left: 50 },
      // 默认字体
      defaultFont: StandardFonts.Helvetica,
      // 标题字体
      headingFont: StandardFonts.HelveticaBold,
      // 基础字体大小
      baseFontSize: 12,
      // 行高（相对于字体大小）
      lineHeight: 1.5,
      // 段落间距（相对于字体大小）
      paragraphSpacing: 1.2,
      // 覆盖默认选项
      ...options,
    }
  }

  /**
   * 生成PDF输出
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

      // 创建PDF文档
      const pdfDoc = await PDFDocument.create()

      // 设置文档元数据
      this.setDocumentMetadata(pdfDoc, documentData.metadata)

      // 添加第一页
      let currentPage = pdfDoc.addPage(mergedOptions.pageSize)

      // 获取页面尺寸
      const { width, height } = currentPage.getSize()

      // 计算可用内容区域
      const contentArea = {
        x: mergedOptions.margins.left,
        y: mergedOptions.margins.bottom,
        width: width - mergedOptions.margins.left - mergedOptions.margins.right,
        height: height - mergedOptions.margins.top - mergedOptions.margins.bottom,
        maxY: height - mergedOptions.margins.top,
      }

      // 当前Y坐标（从顶部开始）
      let currentY = height - mergedOptions.margins.top

      // 嵌入标准字体
      const defaultFont = await pdfDoc.embedFont(mergedOptions.defaultFont)
      const headingFont = await pdfDoc.embedFont(mergedOptions.headingFont)

      // 渲染内容
      for (const block of documentData.content) {
        // 检查是否需要新页面
        const blockHeight = this.estimateBlockHeight(block, contentArea.width, mergedOptions)
        if (currentY - blockHeight < contentArea.y) {
          currentPage = pdfDoc.addPage(mergedOptions.pageSize)
          currentY = height - mergedOptions.margins.top
        }

        // 渲染内容块
        currentY = await this.renderContentBlock(
          currentPage,
          block,
          {
            x: contentArea.x,
            y: currentY,
            width: contentArea.width,
            defaultFont,
            headingFont,
            ...mergedOptions,
          },
        )

        // 添加块间距
        currentY -= mergedOptions.baseFontSize * mergedOptions.paragraphSpacing
      }

      // 生成PDF字节数组
      const pdfBytes = await pdfDoc.save()

      // 返回转换结果
      return new ConversionResult('pdf', pdfBytes, {
        documentTitle: documentData.metadata.title,
        pageCount: pdfDoc.getPageCount(),
      })
    }
    catch (error) {
      if (error instanceof DocumentConverterError) {
        throw error
      }

      throw new DocumentConverterError(
        `PDF生成失败: ${error.message}`,
        ERROR_CODES.CONVERSION_FAILED,
        { originalError: error },
      )
    }
  }

  /**
   * 设置PDF文档元数据
   * @param {PDFDocument} pdfDoc - PDF文档对象
   * @param {MetadataModel} metadata - 文档元数据
   * @private
   */
  setDocumentMetadata(pdfDoc, metadata) {
    if (metadata.title)
      pdfDoc.setTitle(metadata.title)
    if (metadata.author)
      pdfDoc.setAuthor(metadata.author)
    if (metadata.subject)
      pdfDoc.setSubject(metadata.subject)
    if (metadata.keywords)
      pdfDoc.setKeywords(metadata.keywords.split(','))
    if (metadata.description)
      pdfDoc.setSubject(metadata.description)
    if (metadata.creator)
      pdfDoc.setCreator(metadata.creator)
    else pdfDoc.setCreator('JSON2Docs Converter')
    if (metadata.producer)
      pdfDoc.setProducer(metadata.producer)
    else pdfDoc.setProducer('JSON2Docs PDF Generator')
    // Note: pdf-lib doesn't have setCreationDate method
  }

  /**
   * 估算内容块高度
   * @param {ContentBlock} block - 内容块
   * @param {number} width - 可用宽度
   * @param {object} options - 选项
   * @returns {number} 估算高度
   * @private
   */
  estimateBlockHeight(block, width, options) {
    const { baseFontSize, lineHeight } = options
    const lineHeightPx = baseFontSize * lineHeight

    switch (block.type) {
      case 'heading': {
        const level = block.level || 1
        const fontSize = baseFontSize * (2.5 - (level * 0.3))
        return fontSize * lineHeight
      }

      case 'paragraph': {
        // 简单估算：假设每70个字符换行，计算行数
        const text = block.text || ''
        const charsPerLine = Math.floor(width / (baseFontSize * 0.6))
        const lines = Math.ceil(text.length / charsPerLine)
        return lines * lineHeightPx
      }

      case 'list': {
        const items = block.items || []
        return items.length * lineHeightPx * 1.2
      }

      case 'table': {
        const rows = (block.rows || []).length
        const headerRow = block.headers ? 1 : 0
        return (rows + headerRow) * lineHeightPx * 1.5
      }

      case 'image': {
        const height = block.height || 200
        return height + 30 // 图片高度加上说明文字空间
      }

      default:
        return lineHeightPx * 2
    }
  }

  /**
   * 渲染内容块
   * @param {PDFPage} page - PDF页面
   * @param {ContentBlock} block - 内容块
   * @param {object} options - 渲染选项
   * @returns {Promise<number>} 渲染后的Y坐标
   * @private
   */
  async renderContentBlock(page, block, options) {
    const { x, y, width, defaultFont, headingFont, baseFontSize } = options

    switch (block.type) {
      case 'heading':
        return this.renderHeading(page, block, { x, y, width, headingFont, baseFontSize })

      case 'paragraph':
        return this.renderParagraph(page, block, { x, y, width, defaultFont, baseFontSize })

      case 'list':
        return this.renderList(page, block, { x, y, width, defaultFont, baseFontSize })

      case 'table':
        return this.renderTable(page, block, { x, y, width, defaultFont, headingFont, baseFontSize })

      case 'image':
        return this.renderImage(page, block, { x, y, width })

      default:
        throw new DocumentConverterError(
          `不支持的内容块类型: ${block.type}`,
          ERROR_CODES.CONVERSION_FAILED,
        )
    }
  }

  /**
   * 渲染标题
   * @param {PDFPage} page - PDF页面
   * @param {ContentBlock} block - 标题块
   * @param {object} options - 渲染选项
   * @returns {number} 渲染后的Y坐标
   * @private
   */
  renderHeading(page, block, options) {
    const { x, y, headingFont, baseFontSize } = options
    const { level, text } = block

    // 根据标题级别计算字体大小
    const validLevel = Math.min(Math.max(Number.parseInt(level) || 1, 1), 6)
    const fontSize = baseFontSize * (2.5 - (validLevel * 0.3))

    // 绘制文本
    page.drawText(text, {
      x,
      y: y - fontSize,
      size: fontSize,
      font: headingFont,
      color: rgb(0, 0, 0),
    })

    return y - fontSize * 1.5
  }

  /**
   * 渲染段落
   * @param {PDFPage} page - PDF页面
   * @param {ContentBlock} block - 段落块
   * @param {object} options - 渲染选项
   * @returns {number} 渲染后的Y坐标
   * @private
   */
  renderParagraph(page, block, options) {
    const { x, y, width, defaultFont, baseFontSize } = options
    const { text, alignment } = block
    const lineHeight = baseFontSize * 1.5

    // 简单文本渲染，不支持复杂的文本布局
    // 在实际应用中，应该使用更复杂的文本布局算法
    const words = text.split(' ')
    let currentLine = ''
    let currentY = y

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const textWidth = defaultFont.widthOfTextAtSize(testLine, baseFontSize)

      if (textWidth > width && currentLine) {
        // 绘制当前行
        let textX = x
        if (alignment === 'center') {
          textX = x + (width - defaultFont.widthOfTextAtSize(currentLine, baseFontSize)) / 2
        }
        else if (alignment === 'right') {
          textX = x + width - defaultFont.widthOfTextAtSize(currentLine, baseFontSize)
        }

        page.drawText(currentLine, {
          x: textX,
          y: currentY - baseFontSize,
          size: baseFontSize,
          font: defaultFont,
          color: rgb(0, 0, 0),
        })

        currentLine = word
        currentY -= lineHeight
      }
      else {
        currentLine = testLine
      }
    }

    // 绘制最后一行
    if (currentLine) {
      let textX = x
      if (alignment === 'center') {
        textX = x + (width - defaultFont.widthOfTextAtSize(currentLine, baseFontSize)) / 2
      }
      else if (alignment === 'right') {
        textX = x + width - defaultFont.widthOfTextAtSize(currentLine, baseFontSize)
      }

      page.drawText(currentLine, {
        x: textX,
        y: currentY - baseFontSize,
        size: baseFontSize,
        font: defaultFont,
        color: rgb(0, 0, 0),
      })

      currentY -= lineHeight
    }

    return currentY
  }

  /**
   * 渲染列表
   * @param {PDFPage} page - PDF页面
   * @param {ContentBlock} block - 列表块
   * @param {object} options - 渲染选项
   * @returns {number} 渲染后的Y坐标
   * @private
   */
  renderList(page, block, options) {
    const { x, y, width, defaultFont, baseFontSize } = options
    const { listType, items } = block
    const lineHeight = baseFontSize * 1.5
    const bulletWidth = baseFontSize * 1.2

    let currentY = y

    items.forEach((item, index) => {
      const itemText = typeof item === 'string' ? item : item.text
      const itemLevel = typeof item === 'object' && item.level ? item.level : 0
      const indent = itemLevel * baseFontSize * 1.5
      const bulletX = x + indent
      const textX = bulletX + bulletWidth

      // 绘制项目符号或序号
      const bullet = listType === 'ordered' ? `${index + 1}.` : '•'
      page.drawText(bullet, {
        x: bulletX,
        y: currentY - baseFontSize,
        size: baseFontSize,
        font: defaultFont,
        color: rgb(0, 0, 0),
      })

      // 绘制列表项文本
      page.drawText(itemText, {
        x: textX,
        y: currentY - baseFontSize,
        size: baseFontSize,
        font: defaultFont,
        color: rgb(0, 0, 0),
        maxWidth: width - bulletWidth - indent,
      })

      currentY -= lineHeight
    })

    return currentY
  }

  /**
   * 渲染表格
   * @param {PDFPage} page - PDF页面
   * @param {ContentBlock} block - 表格块
   * @param {object} options - 渲染选项
   * @returns {number} 渲染后的Y坐标
   * @private
   */
  renderTable(page, block, options) {
    const { x, y, width, defaultFont, headingFont, baseFontSize } = options
    const { headers, rows } = block
    const lineHeight = baseFontSize * 1.5
    const cellPadding = 5
    const hasHeaders = headers && headers.length > 0

    // 计算列宽
    const columnCount = hasHeaders ? headers.length : (rows && rows[0] ? rows[0].length : 0)
    const columnWidth = width / columnCount

    let currentY = y

    // 绘制表头
    if (hasHeaders) {
      // 绘制表头背景
      page.drawRectangle({
        x,
        y: currentY - lineHeight,
        width,
        height: lineHeight,
        color: rgb(0.9, 0.9, 0.9),
      })

      // 绘制表头文本
      headers.forEach((header, index) => {
        page.drawText(header, {
          x: x + (index * columnWidth) + cellPadding,
          y: currentY - baseFontSize - cellPadding,
          size: baseFontSize,
          font: headingFont,
          color: rgb(0, 0, 0),
          maxWidth: columnWidth - (cellPadding * 2),
        })
      })

      currentY -= lineHeight

      // 绘制表头分隔线
      page.drawLine({
        start: { x, y: currentY },
        end: { x: x + width, y: currentY },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      })
    }

    // 绘制数据行
    if (rows && rows.length > 0) {
      rows.forEach((row, rowIndex) => {
        // 绘制行背景（交替颜色）
        if (rowIndex % 2 === 1) {
          page.drawRectangle({
            x,
            y: currentY - lineHeight,
            width,
            height: lineHeight,
            color: rgb(0.95, 0.95, 0.95),
          })
        }

        // 绘制单元格文本
        row.forEach((cell, cellIndex) => {
          page.drawText(String(cell), {
            x: x + (cellIndex * columnWidth) + cellPadding,
            y: currentY - baseFontSize - cellPadding,
            size: baseFontSize,
            font: defaultFont,
            color: rgb(0, 0, 0),
            maxWidth: columnWidth - (cellPadding * 2),
          })
        })

        currentY -= lineHeight

        // 绘制行分隔线
        page.drawLine({
          start: { x, y: currentY },
          end: { x: x + width, y: currentY },
          thickness: 0.5,
          color: rgb(0.8, 0.8, 0.8),
        })
      })
    }

    // 绘制表格边框
    page.drawRectangle({
      x,
      y: currentY,
      width,
      height: y - currentY,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
    })

    return currentY
  }

  /**
   * 渲染图片
   * @param {PDFPage} page - PDF页面
   * @param {ContentBlock} block - 图片块
   * @param {object} options - 渲染选项
   * @returns {Promise<number>} 渲染后的Y坐标
   * @private
   */
  async renderImage(page, block, options) {
    const { x, y, width } = options
    const { src, alt, width: imageWidth, height: imageHeight } = block

    // 注意：pdf-lib只支持嵌入JPG和PNG图像
    // 对于base64图像，需要先解码
    try {
      let imageBytes

      // 处理base64图像
      if (src.startsWith('data:image/')) {
        const base64Data = src.split(',')[1]
        imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
      }
      else {
        // 在实际应用中，这里应该处理从URL加载图像
        // 由于Node.js环境限制，这里只是一个占位实现
        throw new Error('仅支持base64编码的图像数据')
      }

      // 根据MIME类型嵌入图像
      let image
      if (src.includes('image/jpeg') || src.includes('image/jpg')) {
        image = await page.doc.embedJpg(imageBytes)
      }
      else if (src.includes('image/png')) {
        image = await page.doc.embedPng(imageBytes)
      }
      else {
        throw new Error('不支持的图像格式，仅支持JPG和PNG')
      }

      // 计算图像尺寸和位置
      const imgWidth = imageWidth || width * 0.8
      const imgHeight = imageHeight || (imgWidth * image.height / image.width)
      const imgX = x + (width - imgWidth) / 2

      // 绘制图像
      page.drawImage(image, {
        x: imgX,
        y: y - imgHeight,
        width: imgWidth,
        height: imgHeight,
      })

      // 如果有替代文本，绘制为图片说明
      if (alt) {
        const captionY = y - imgHeight - 20
        page.drawText(alt, {
          x: x + (width - page.doc.defaultFont.widthOfTextAtSize(alt, 10)) / 2,
          y: captionY,
          size: 10,
          color: rgb(0.4, 0.4, 0.4),
        })

        return captionY - 10
      }

      return y - imgHeight - 10
    }
    catch {
      // 如果图像处理失败，绘制错误占位符
      page.drawRectangle({
        x: x + (width - 100) / 2,
        y: y - 100,
        width: 100,
        height: 100,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 1,
      })

      page.drawText('图像加载失败', {
        x: x + (width - 80) / 2,
        y: y - 50,
        size: 12,
        color: rgb(0.5, 0.5, 0.5),
      })

      return y - 120
    }
  }
}
