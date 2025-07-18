/**
 * JSON文档验证工具
 */

import { DocumentConverterError, ERROR_CODES } from '../core/errors.js'

import { isEmpty } from './validation.js'

/**
 * 验证JSON文档格式
 */
export class DocumentValidator {
  /**
   * 验证文档是否符合规范
   * @param {object} jsonData - JSON文档数据
   * @throws {DocumentConverterError} 验证错误
   */
  static validate(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new DocumentConverterError(
        '无效的JSON文档',
        ERROR_CODES.INVALID_JSON,
      )
    }

    // 验证必需字段
    this.validateRequiredFields(jsonData, ['version', 'content'])

    // 验证版本
    this.validateVersion(jsonData.version)

    // 验证内容
    this.validateContent(jsonData.content)

    // 验证元数据（如果存在）
    if (jsonData.metadata) {
      this.validateMetadata(jsonData.metadata)
    }

    // 验证样式（如果存在）
    if (jsonData.styles) {
      this.validateStyles(jsonData.styles)
    }
  }

  /**
   * 验证必需字段
   * @param {object} obj - 要验证的对象
   * @param {string[]} requiredFields - 必需的字段列表
   * @throws {DocumentConverterError} 验证错误
   */
  static validateRequiredFields(obj, requiredFields) {
    const missingFields = requiredFields.filter(field => isEmpty(obj[field]))

    if (missingFields.length > 0) {
      throw new DocumentConverterError(
        `缺少必需字段: ${missingFields.join(', ')}`,
        ERROR_CODES.VALIDATION_ERROR,
        { missingFields },
      )
    }
  }

  /**
   * 验证版本
   * @param {string} version - 版本号
   * @throws {DocumentConverterError} 验证错误
   */
  static validateVersion(version) {
    if (typeof version !== 'string') {
      throw new DocumentConverterError(
        '版本必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    const versionPattern = /^\d+\.\d+(?:\.\d+)?$/
    if (!versionPattern.test(version)) {
      throw new DocumentConverterError(
        '无效的版本格式，应为 major.minor[.patch]',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }

  /**
   * 验证内容
   * @param {Array} content - 内容块数组
   * @throws {DocumentConverterError} 验证错误
   */
  static validateContent(content) {
    if (!Array.isArray(content)) {
      throw new DocumentConverterError(
        '内容必须是数组',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (content.length === 0) {
      throw new DocumentConverterError(
        '内容不能为空',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证每个内容块
    content.forEach((block, index) => {
      try {
        this.validateContentBlock(block)
      }
      catch (error) {
        throw new DocumentConverterError(
          `内容块 #${index + 1} 验证失败: ${error.message}`,
          ERROR_CODES.VALIDATION_ERROR,
          { blockIndex: index, originalError: error },
        )
      }
    })
  }

  /**
   * 验证内容块
   * @param {object} block - 内容块
   * @throws {DocumentConverterError} 验证错误
   */
  static validateContentBlock(block) {
    if (!block || typeof block !== 'object') {
      throw new DocumentConverterError(
        '内容块必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (!block.type) {
      throw new DocumentConverterError(
        '内容块必须指定类型',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 根据类型验证
    switch (block.type) {
      case 'heading':
        this.validateHeadingBlock(block)
        break

      case 'paragraph':
        this.validateParagraphBlock(block)
        break

      case 'list':
        this.validateListBlock(block)
        break

      case 'table':
        this.validateTableBlock(block)
        break

      case 'image':
        this.validateImageBlock(block)
        break

      default:
        throw new DocumentConverterError(
          `不支持的内容块类型: ${block.type}`,
          ERROR_CODES.VALIDATION_ERROR,
          { supportedTypes: ['heading', 'paragraph', 'list', 'table', 'image'] },
        )
    }
  }

  /**
   * 验证标题块
   * @param {object} block - 标题块
   * @throws {DocumentConverterError} 验证错误
   */
  static validateHeadingBlock(block) {
    this.validateRequiredFields(block, ['text', 'level'])

    if (typeof block.text !== 'string') {
      throw new DocumentConverterError(
        '标题文本必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (!Number.isInteger(block.level) || block.level < 1 || block.level > 6) {
      throw new DocumentConverterError(
        '标题级别必须是1-6之间的整数',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }

  /**
   * 验证段落块
   * @param {object} block - 段落块
   * @throws {DocumentConverterError} 验证错误
   */
  static validateParagraphBlock(block) {
    this.validateRequiredFields(block, ['text'])

    if (typeof block.text !== 'string') {
      throw new DocumentConverterError(
        '段落文本必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (block.alignment && !['left', 'center', 'right', 'justify'].includes(block.alignment)) {
      throw new DocumentConverterError(
        '无效的对齐方式，应为 left, center, right 或 justify',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }

  /**
   * 验证列表块
   * @param {object} block - 列表块
   * @throws {DocumentConverterError} 验证错误
   */
  static validateListBlock(block) {
    this.validateRequiredFields(block, ['items'])

    if (!Array.isArray(block.items) || block.items.length === 0) {
      throw new DocumentConverterError(
        '列表项必须是非空数组',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (block.listType && !['ordered', 'unordered'].includes(block.listType)) {
      throw new DocumentConverterError(
        '无效的列表类型，应为 ordered 或 unordered',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证每个列表项
    block.items.forEach((item, index) => {
      try {
        this.validateListItem(item)
      }
      catch (error) {
        throw new DocumentConverterError(
          `列表项 #${index + 1} 验证失败: ${error.message}`,
          ERROR_CODES.VALIDATION_ERROR,
          { itemIndex: index, originalError: error },
        )
      }
    })
  }

  /**
   * 验证列表项
   * @param {object} item - 列表项
   * @throws {DocumentConverterError} 验证错误
   */
  static validateListItem(item) {
    if (!item || typeof item !== 'object') {
      throw new DocumentConverterError(
        '列表项必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    this.validateRequiredFields(item, ['text'])

    if (typeof item.text !== 'string') {
      throw new DocumentConverterError(
        '列表项文本必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (item.level !== undefined && (!Number.isInteger(item.level) || item.level < 0)) {
      throw new DocumentConverterError(
        '列表项级别必须是非负整数',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }

  /**
   * 验证表格块
   * @param {object} block - 表格块
   * @throws {DocumentConverterError} 验证错误
   */
  static validateTableBlock(block) {
    this.validateRequiredFields(block, ['headers', 'rows'])

    if (!Array.isArray(block.headers) || block.headers.length === 0) {
      throw new DocumentConverterError(
        '表格标题必须是非空数组',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证标题
    block.headers.forEach((header, index) => {
      if (typeof header !== 'string') {
        throw new DocumentConverterError(
          `表格标题 #${index + 1} 必须是字符串`,
          ERROR_CODES.VALIDATION_ERROR,
        )
      }
    })

    if (!Array.isArray(block.rows)) {
      throw new DocumentConverterError(
        '表格行必须是数组',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证行
    block.rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) {
        throw new DocumentConverterError(
          `表格行 #${rowIndex + 1} 必须是数组`,
          ERROR_CODES.VALIDATION_ERROR,
        )
      }

      // 验证单元格
      row.forEach((cell, cellIndex) => {
        if (typeof cell !== 'string') {
          throw new DocumentConverterError(
            `表格单元格 (${rowIndex + 1}, ${cellIndex + 1}) 必须是字符串`,
            ERROR_CODES.VALIDATION_ERROR,
          )
        }
      })
    })
  }

  /**
   * 验证图片块
   * @param {object} block - 图片块
   * @throws {DocumentConverterError} 验证错误
   */
  static validateImageBlock(block) {
    this.validateRequiredFields(block, ['src'])

    if (typeof block.src !== 'string') {
      throw new DocumentConverterError(
        '图片源必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (block.alt !== undefined && typeof block.alt !== 'string') {
      throw new DocumentConverterError(
        '图片替代文本必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (block.width !== undefined && typeof block.width !== 'number' && typeof block.width !== 'string') {
      throw new DocumentConverterError(
        '图片宽度必须是数字或字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    if (block.height !== undefined && typeof block.height !== 'number' && typeof block.height !== 'string') {
      throw new DocumentConverterError(
        '图片高度必须是数字或字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }

  /**
   * 验证元数据
   * @param {object} metadata - 元数据
   * @throws {DocumentConverterError} 验证错误
   */
  static validateMetadata(metadata) {
    if (!metadata || typeof metadata !== 'object') {
      throw new DocumentConverterError(
        '元数据必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证标题（如果存在）
    if (metadata.title !== undefined && typeof metadata.title !== 'string') {
      throw new DocumentConverterError(
        '元数据标题必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证作者（如果存在）
    if (metadata.author !== undefined && typeof metadata.author !== 'string') {
      throw new DocumentConverterError(
        '元数据作者必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证创建日期（如果存在）
    if (metadata.created !== undefined) {
      if (typeof metadata.created !== 'string') {
        throw new DocumentConverterError(
          '元数据创建日期必须是字符串',
          ERROR_CODES.VALIDATION_ERROR,
        )
      }

      // 验证日期格式
      const datePattern = /^\d{4}-\d{2}-\d{2}$/
      if (!datePattern.test(metadata.created)) {
        throw new DocumentConverterError(
          '元数据创建日期格式无效，应为 YYYY-MM-DD',
          ERROR_CODES.VALIDATION_ERROR,
        )
      }
    }

    // 验证描述（如果存在）
    if (metadata.description !== undefined && typeof metadata.description !== 'string') {
      throw new DocumentConverterError(
        '元数据描述必须是字符串',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }
  }

  /**
   * 验证样式
   * @param {object} styles - 样式
   * @throws {DocumentConverterError} 验证错误
   */
  static validateStyles(styles) {
    if (!styles || typeof styles !== 'object') {
      throw new DocumentConverterError(
        '样式必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证字体（如果存在）
    if (styles.fonts !== undefined) {
      this.validateFonts(styles.fonts)
    }

    // 验证颜色（如果存在）
    if (styles.colors !== undefined) {
      this.validateColors(styles.colors)
    }

    // 验证尺寸（如果存在）
    if (styles.sizes !== undefined) {
      this.validateSizes(styles.sizes)
    }

    // 验证间距（如果存在）
    if (styles.spacing !== undefined) {
      this.validateSpacing(styles.spacing)
    }
  }

  /**
   * 验证字体
   * @param {object} fonts - 字体
   * @throws {DocumentConverterError} 验证错误
   */
  static validateFonts(fonts) {
    if (!fonts || typeof fonts !== 'object') {
      throw new DocumentConverterError(
        '字体必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证字体属性
    Object.entries(fonts).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        throw new DocumentConverterError(
          `字体属性 ${key} 必须是字符串`,
          ERROR_CODES.VALIDATION_ERROR,
        )
      }
    })
  }

  /**
   * 验证颜色
   * @param {object} colors - 颜色
   * @throws {DocumentConverterError} 验证错误
   */
  static validateColors(colors) {
    if (!colors || typeof colors !== 'object') {
      throw new DocumentConverterError(
        '颜色必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证颜色属性
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        throw new DocumentConverterError(
          `颜色属性 ${key} 必须是字符串`,
          ERROR_CODES.VALIDATION_ERROR,
        )
      }
    })
  }

  /**
   * 验证尺寸
   * @param {object} sizes - 尺寸
   * @throws {DocumentConverterError} 验证错误
   */
  static validateSizes(sizes) {
    if (!sizes || typeof sizes !== 'object') {
      throw new DocumentConverterError(
        '尺寸必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证尺寸属性
    Object.entries(sizes).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        throw new DocumentConverterError(
          `尺寸属性 ${key} 必须是字符串`,
          ERROR_CODES.VALIDATION_ERROR,
        )
      }
    })
  }

  /**
   * 验证间距
   * @param {object} spacing - 间距
   * @throws {DocumentConverterError} 验证错误
   */
  static validateSpacing(spacing) {
    if (!spacing || typeof spacing !== 'object') {
      throw new DocumentConverterError(
        '间距必须是对象',
        ERROR_CODES.VALIDATION_ERROR,
      )
    }

    // 验证间距属性
    Object.entries(spacing).forEach(([key, value]) => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new DocumentConverterError(
          `间距属性 ${key} 必须是字符串或数字`,
          ERROR_CODES.VALIDATION_ERROR,
        )
      }
    })
  }
}
