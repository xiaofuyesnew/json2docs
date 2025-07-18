// Web Worker service for managing document conversion workers
class WorkerService {
  constructor() {
    this.worker = null
    this.isWorkerSupported = typeof Worker !== 'undefined'
    this.currentTask = null
  }

  // Initialize worker
  initWorker() {
    if (!this.isWorkerSupported) {
      console.warn('Web Workers not supported in this environment')
      return false
    }

    try {
      this.worker = new Worker('/conversion-worker.js')
      this.setupWorkerListeners()
      return true
    }
    catch (error) {
      console.error('Failed to initialize worker:', error)
      return false
    }
  }

  // Setup worker event listeners
  setupWorkerListeners() {
    if (!this.worker)
      return

    this.worker.addEventListener('message', (event) => {
      const { type, ...data } = event.data

      if (this.currentTask && this.currentTask.callbacks[type]) {
        this.currentTask.callbacks[type](data)
      }

      // Handle task completion
      if (type === 'CONVERSION_SUCCESS' || type === 'CONVERSION_ERROR' || type === 'VALIDATION_SUCCESS' || type === 'VALIDATION_ERROR') {
        this.currentTask = null
      }
    })

    this.worker.addEventListener('error', (error) => {
      console.error('Worker error:', error)
      if (this.currentTask && this.currentTask.callbacks.ERROR) {
        this.currentTask.callbacks.ERROR({ error: error.message })
      }
      this.currentTask = null
    })
  }

  // Convert document using worker
  async convertDocument(jsonDocument, format, options = {}) {
    return new Promise((resolve, reject) => {
      // Fallback to main thread if worker not available
      if (!this.worker) {
        return this.convertDocumentMainThread(jsonDocument, format, options)
          .then(resolve)
          .catch(reject)
      }

      // Cancel any existing task
      if (this.currentTask) {
        this.currentTask.callbacks.ERROR({ error: 'Task cancelled by new request' })
      }

      // Setup task callbacks
      this.currentTask = {
        callbacks: {
          PROGRESS: options.onProgress || (() => {}),
          CONVERSION_SUCCESS: (data) => {
            resolve(data.result)
          },
          CONVERSION_ERROR: (data) => {
            reject(new Error(data.error.message))
          },
          ERROR: (data) => {
            reject(new Error(data.error.message))
          },
        },
      }

      // Send task to worker
      this.worker.postMessage({
        type: 'CONVERT_DOCUMENT',
        data: {
          jsonDocument,
          format,
          options,
        },
      })
    })
  }

  // Validate JSON using worker
  async validateJson(jsonText, validateSchema = true) {
    return new Promise((resolve, reject) => {
      // Fallback to main thread if worker not available
      if (!this.worker) {
        return this.validateJsonMainThread(jsonText, validateSchema)
          .then(resolve)
          .catch(reject)
      }

      // Setup task callbacks
      this.currentTask = {
        callbacks: {
          VALIDATION_START: () => {},
          VALIDATION_SUCCESS: (data) => {
            resolve(data.result)
          },
          VALIDATION_ERROR: (data) => {
            reject(new Error(data.error.message))
          },
          ERROR: (data) => {
            reject(new Error(data.error.message))
          },
        },
      }

      // Send task to worker
      this.worker.postMessage({
        type: 'VALIDATE_JSON',
        data: {
          jsonText,
          validateSchema,
        },
      })
    })
  }

  // Fallback: Convert document on main thread
  async convertDocumentMainThread(jsonDocument, format, options = {}) {
    const { DocumentConverter } = await import('@json2docs/converter')
    const converter = new DocumentConverter(options)

    // Simulate progress for consistency
    if (options.onProgress) {
      options.onProgress({ progress: 25, status: '验证文档格式...' })
      await new Promise(resolve => setTimeout(resolve, 100))

      options.onProgress({ progress: 50, status: '解析文档结构...' })
      await new Promise(resolve => setTimeout(resolve, 100))

      options.onProgress({ progress: 75, status: '生成输出文件...' })
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const result = await converter.convert(jsonDocument, format)

    if (options.onProgress) {
      options.onProgress({ progress: 100, status: '转换完成' })
    }

    return result
  }

  // Fallback: Validate JSON on main thread
  async validateJsonMainThread(jsonText, validateSchema = true) {
    try {
      const parsedJson = JSON.parse(jsonText)

      if (validateSchema) {
        // Import validator dynamically to avoid blocking
        const { DocumentValidator } = await import('@json2docs/converter')
        const validator = new DocumentValidator()
        return validator.validate(parsedJson)
      }

      return {
        valid: true,
        errors: [],
        warnings: [],
      }
    }
    catch (error) {
      throw new Error(`JSON解析错误: ${error.message}`)
    }
  }

  // Terminate worker
  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      this.currentTask = null
    }
  }

  // Check if worker is available
  isWorkerAvailable() {
    return !!this.worker
  }
}

// Create singleton instance
export const workerService = new WorkerService()

// Initialize worker when service is imported
if (typeof window !== 'undefined') {
  workerService.initWorker()
}

export default workerService
