import { DocumentConverter, DocumentConverterError, ERROR_CODES } from '@json2docs/converter'
import { defineStore } from 'pinia'
import workerService from '../services/workerService.js'

// 创建转换器实例（作为fallback）
const converter = new DocumentConverter()

export const useDocumentStore = defineStore('document', {
  state: () => ({
    jsonDocument: null,
    selectedFormat: 'html',
    convertedResult: null,
    isConverting: false,
    errors: [],
    // 新增缓存 Map，key 为 hash(json)+format
    resultCache: new Map(),
    // 转换进度状态
    conversionProgress: 0,
    conversionStatus: '',
    // 性能统计
    performanceStats: {
      lastConversionTime: 0,
      averageConversionTime: 0,
      totalConversions: 0,
      workerUsed: false,
    },
  }),

  getters: {
    hasDocument: state => !!state.jsonDocument,
    hasResult: state => !!state.convertedResult,
    hasErrors: state => state.errors.length > 0,
  },

  actions: {
    setJsonDocument(data) {
      this.jsonDocument = data
      this.convertedResult = null
      this.errors = []
    },

    setSelectedFormat(format) {
      this.selectedFormat = format
    },

    async convertDocument() {
      if (!this.jsonDocument) {
        this.errors = ['没有可转换的文档数据']
        return
      }

      this.isConverting = true
      this.errors = []
      this.conversionProgress = 0
      this.conversionStatus = '准备转换...'

      // 计算缓存 key
      const cacheKey = hashJsonAndFormat(this.jsonDocument, this.selectedFormat)
      if (this.resultCache.has(cacheKey)) {
        this.convertedResult = this.resultCache.get(cacheKey)
        this.isConverting = false
        this.conversionProgress = 100
        this.conversionStatus = '从缓存加载完成'
        return
      }

      const startTime = performance.now()

      try {
        // 检查文档大小决定是否使用 Worker
        const documentSize = JSON.stringify(this.jsonDocument).length
        const useWorker = documentSize > 50000 && workerService.isWorkerAvailable() // 50KB threshold

        let result
        if (useWorker) {
          // 使用 Web Worker 进行转换
          this.performanceStats.workerUsed = true
          result = await workerService.convertDocument(
            this.jsonDocument,
            this.selectedFormat,
            {
              onProgress: (progressData) => {
                this.conversionProgress = progressData.progress
                this.conversionStatus = progressData.status
              },
            },
          )
        }
        else {
          // 使用主线程转换（小文档）
          this.performanceStats.workerUsed = false
          result = await this.convertDocumentMainThread()
        }

        this.convertedResult = result
        // 缓存结果
        this.resultCache.set(cacheKey, result)

        // 更新性能统计
        const conversionTime = performance.now() - startTime
        this.updatePerformanceStats(conversionTime)

        this.conversionProgress = 100
        this.conversionStatus = '转换完成'
      }
      catch (error) {
        this.handleConversionError(error)
        this.convertedResult = null
      }
      finally {
        this.isConverting = false
        // 延迟清除进度状态
        setTimeout(() => {
          this.conversionProgress = 0
          this.conversionStatus = ''
        }, 2000)
      }
    },

    // 主线程转换方法（用于小文档或 Worker 不可用时）
    async convertDocumentMainThread() {
      // 模拟进度更新
      this.conversionProgress = 25
      this.conversionStatus = '验证文档格式...'
      await new Promise(resolve => setTimeout(resolve, 100))

      this.conversionProgress = 50
      this.conversionStatus = '解析文档结构...'
      await new Promise(resolve => setTimeout(resolve, 100))

      this.conversionProgress = 75
      this.conversionStatus = '生成输出文件...'
      await new Promise(resolve => setTimeout(resolve, 100))

      // 使用转换器库进行转换
      const result = await converter.convert(
        this.jsonDocument,
        this.selectedFormat,
      )

      return result
    },

    // 处理转换错误
    handleConversionError(error) {
      if (error instanceof DocumentConverterError) {
        // 根据错误代码提供更友好的错误信息
        switch (error.code) {
          case ERROR_CODES.INVALID_JSON:
            this.errors = [
              '❌ 无效的JSON文档格式',
              `详细信息: ${error.message}`,
              '💡 建议: 请检查JSON文档的结构是否符合规范',
            ]
            break

          case ERROR_CODES.UNSUPPORTED_FORMAT:
            this.errors = [
              `❌ 不支持的输出格式: ${this.selectedFormat}`,
              `✅ 支持的格式: ${error.details?.supportedFormats?.join(', ') || 'html, pdf, docx'}`,
              '💡 建议: 请选择支持的输出格式',
            ]
            break

          case ERROR_CODES.VALIDATION_ERROR:
            this.errors = [
              '❌ 文档验证失败',
              `详细信息: ${error.message}`,
              '💡 建议: 请检查JSON文档的内容块格式是否正确',
            ]
            break

          case ERROR_CODES.CONVERSION_FAILED:
          default:
            this.errors = [
              `❌ 转换失败 (${error.code})`,
              `错误信息: ${error.message}`,
              ...(error.details?.originalError ? [`原始错误: ${error.details.originalError.message}`] : []),
              '💡 建议: 请检查文档内容是否包含不支持的元素或格式',
            ]
        }
      }
      else {
        this.errors = [
          '❌ 转换过程中发生未知错误',
          error.message || '请稍后重试或联系技术支持',
          '💡 建议: 请检查网络连接和文档格式',
        ]
      }
    },

    // 更新性能统计
    updatePerformanceStats(conversionTime) {
      this.performanceStats.lastConversionTime = conversionTime
      this.performanceStats.totalConversions++

      // 计算平均转换时间
      const total = this.performanceStats.totalConversions
      const current = this.performanceStats.averageConversionTime
      this.performanceStats.averageConversionTime
        = (current * (total - 1) + conversionTime) / total
    },

    clearResult() {
      this.convertedResult = null
    },

    clearErrors() {
      this.errors = []
    },

    resetAll() {
      this.jsonDocument = null
      this.convertedResult = null
      this.errors = []
      this.isConverting = false
    },
  },
})

// 工具函数：hash json+format
function hashJsonAndFormat(json, format) {
  // 简单 hash，可用 JSON.stringify+format
  const str = `${JSON.stringify(json)}:${format}`
  let hash = 0
  let i
  let chr
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash
    hash = hash + chr
    hash = hash | 0
  }
  return hash.toString()
}
