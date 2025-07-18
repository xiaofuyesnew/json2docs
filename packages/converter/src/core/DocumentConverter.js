/**
 * 文档转换器核心类
 * 负责将JSON文档转换为不同的输出格式
 */

import { DOCXGenerator } from '../generators/DOCXGenerator.js'
import { HTMLGenerator } from '../generators/HTMLGenerator.js'
import { PDFGenerator } from '../generators/PDFGenerator.js'
import { ConversionResult } from '../models/ConversionResult.js'
import { DocumentModel } from '../models/DocumentModel.js'
import { DocumentValidator } from '../utils/validator.js'

import { DocumentConverterError, ERROR_CODES } from './errors.js'

/**
 * 默认转换选项
 * @type {object}
 */
const DEFAULT_OPTIONS = {
  // 通用选项
  validateInput: true,
  preserveStyles: true,

  // HTML选项
  includeStyles: true,
  prettyPrint: false,

  // PDF选项
  pageSize: 'A4',
  pageOrientation: 'portrait',
  pageMargins: [40, 40, 40, 40], // [left, top, right, bottom]

  // DOCX选项
  compatibility: true,
  includeChartData: true,
}

/**
 * 文档转换器类
 */
export class DocumentConverter {
  /**
   * 创建文档转换器实例
   * @param {object} options - 转换器选项
   */
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.initGenerators()
  }

  /**
   * 初始化生成器
   * @private
   */
  initGenerators() {
    this.generators = {
      html: new HTMLGenerator(this.options),
      pdf: new PDFGenerator(this.options),
      docx: new DOCXGenerator(this.options),
    }
  }

  /**
   * 转换JSON文档到指定格式
   * @param {object} jsonData - JSON文档数据
   * @param {string} outputFormat - 输出格式 (html, pdf, docx)
   * @param {object} options - 转换选项
   * @returns {Promise<ConversionResult>} 转换结果
   * @throws {DocumentConverterError} 转换错误
   */
  async convert(jsonData, outputFormat, options = {}) {
    try {
      // 验证输入格式
      if (this.options.validateInput) {
        this.validateJsonDocument(jsonData)
      }

      // 检查输出格式是否支持
      if (!this.getSupportedFormats().includes(outputFormat)) {
        throw new DocumentConverterError(
          `不支持的输出格式: ${outputFormat}`,
          ERROR_CODES.UNSUPPORTED_FORMAT,
          { supportedFormats: this.getSupportedFormats() },
        )
      }

      // 创建文档模型
      const documentModel = new DocumentModel(jsonData)

      // 获取对应的生成器
      const generator = this.generators[outputFormat]

      // 合并选项
      const mergedOptions = { ...this.options, ...options }

      // 生成输出
      const result = await generator.generate(documentModel, mergedOptions)

      // 如果生成器已经返回了 ConversionResult，直接返回
      if (result instanceof ConversionResult) {
        return result
      }

      // 否则创建新的转换结果
      return new ConversionResult(outputFormat, result, {
        documentTitle: documentModel.metadata?.title || 'Untitled Document',
        timestamp: new Date().toISOString(),
        documentVersion: documentModel.version,
        generatorOptions: mergedOptions,
      })
    }
    catch (error) {
      if (error instanceof DocumentConverterError) {
        throw error
      }

      throw new DocumentConverterError(
        `转换失败: ${error.message}`,
        ERROR_CODES.CONVERSION_FAILED,
        { originalError: error },
      )
    }
  }

  /**
   * 批量转换JSON文档到多种格式
   * @param {object} jsonData - JSON文档数据
   * @param {string[]} outputFormats - 输出格式数组
   * @param {object} options - 转换选项
   * @returns {Promise<object>} 转换结果映射
   * @throws {DocumentConverterError} 转换错误
   */
  async convertMultiple(jsonData, outputFormats, options = {}) {
    // 验证输入格式（只验证一次）
    if (this.options.validateInput) {
      this.validateJsonDocument(jsonData)
    }

    // 验证输出格式
    const supportedFormats = this.getSupportedFormats()
    const unsupportedFormats = outputFormats.filter(format => !supportedFormats.includes(format))

    if (unsupportedFormats.length > 0) {
      throw new DocumentConverterError(
        `不支持的输出格式: ${unsupportedFormats.join(', ')}`,
        ERROR_CODES.UNSUPPORTED_FORMAT,
        { supportedFormats, unsupportedFormats },
      )
    }

    // 创建文档模型（只创建一次）
    const documentModel = new DocumentModel(jsonData)

    // 转换结果映射
    const results = {}
    const errors = {}

    // 并行转换
    await Promise.all(outputFormats.map(async (format) => {
      try {
        // 获取对应的生成器
        const generator = this.generators[format]

        // 合并选项
        const mergedOptions = { ...this.options, ...options }

        // 生成输出
        const result = await generator.generate(documentModel, mergedOptions)

        // 创建转换结果
        results[format] = new ConversionResult(format, result, {
          documentTitle: documentModel.metadata?.title || 'Untitled Document',
          timestamp: new Date().toISOString(),
          documentVersion: documentModel.version,
          generatorOptions: mergedOptions,
        })
      }
      catch (error) {
        errors[format] = error instanceof DocumentConverterError
          ? error
          : new DocumentConverterError(
            `转换到${format}格式失败: ${error.message}`,
            ERROR_CODES.CONVERSION_FAILED,
            { originalError: error },
          )
      }
    }))

    // 如果所有转换都失败，抛出错误
    if (Object.keys(results).length === 0 && Object.keys(errors).length > 0) {
      throw new DocumentConverterError(
        '所有格式转换都失败',
        ERROR_CODES.CONVERSION_FAILED,
        { errors },
      )
    }

    // 返回结果和错误
    return {
      results,
      errors: Object.keys(errors).length > 0 ? errors : null,
    }
  }

  /**
   * 验证JSON文档格式
   * @param {object} jsonData - JSON文档数据
   * @throws {DocumentConverterError} 验证错误
   */
  validateJsonDocument(jsonData) {
    DocumentValidator.validate(jsonData)
  }

  /**
   * 获取支持的输出格式列表
   * @returns {string[]} 支持的格式列表
   */
  getSupportedFormats() {
    return Object.keys(this.generators)
  }

  /**
   * 获取默认选项
   * @returns {object} 默认选项
   */
  getDefaultOptions() {
    return { ...DEFAULT_OPTIONS }
  }

  /**
   * 设置选项
   * @param {object} options - 新选项
   */
  setOptions(options) {
    this.options = { ...this.options, ...options }
    this.initGenerators()
  }

  /**
   * 重置选项为默认值
   */
  resetOptions() {
    this.options = { ...DEFAULT_OPTIONS }
    this.initGenerators()
  }
}
