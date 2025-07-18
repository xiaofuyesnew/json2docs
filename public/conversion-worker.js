// Web Worker for document conversion to avoid blocking main thread
self.addEventListener('message', async (event) => {
  const { type, data } = event.data

  try {
    switch (type) {
      case 'CONVERT_DOCUMENT':
        await handleDocumentConversion(data)
        break
      case 'VALIDATE_JSON':
        await handleJsonValidation(data)
        break
      default:
        throw new Error(`Unknown message type: ${type}`)
    }
  }
  catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  }
})

async function handleDocumentConversion({ jsonDocument, format, options = {} }) {
  // Import converter library dynamically
  const { DocumentConverter } = await import('/packages/converter/src/index.js')

  const converter = new DocumentConverter(options)

  // Report progress
  self.postMessage({
    type: 'PROGRESS',
    progress: 10,
    status: '初始化转换器...',
  })

  try {
    // Validate document first
    self.postMessage({
      type: 'PROGRESS',
      progress: 25,
      status: '验证文档格式...',
    })

    // For large documents, process in chunks
    const isLargeDocument = JSON.stringify(jsonDocument).length > 100000 // 100KB threshold

    if (isLargeDocument) {
      await processLargeDocument(converter, jsonDocument, format)
    }
    else {
      await processRegularDocument(converter, jsonDocument, format)
    }
  }
  catch (error) {
    self.postMessage({
      type: 'CONVERSION_ERROR',
      error: {
        message: error.message,
        code: error.code || 'CONVERSION_FAILED',
      },
    })
  }
}

async function processRegularDocument(converter, jsonDocument, format) {
  self.postMessage({
    type: 'PROGRESS',
    progress: 50,
    status: '解析文档结构...',
  })

  const result = await converter.convert(jsonDocument, format)

  self.postMessage({
    type: 'PROGRESS',
    progress: 90,
    status: '生成输出文件...',
  })

  self.postMessage({
    type: 'CONVERSION_SUCCESS',
    result: {
      format: result.format,
      data: result.data,
      metadata: result.metadata,
      timestamp: result.timestamp,
    },
  })
}

async function processLargeDocument(converter, jsonDocument, format) {
  self.postMessage({
    type: 'PROGRESS',
    progress: 30,
    status: '处理大型文档...',
  })

  // Import streaming processor
  const { StreamProcessor } = await import('/src/utils/streamProcessor.js')

  // Create stream processor with progress reporting
  const streamProcessor = new StreamProcessor({
    chunkSize: 50,
    batchDelay: 10,
    onProgress: (progressData) => {
      const progress = 30 + (progressData.progress / 100) * 50 // 30-80% range
      self.postMessage({
        type: 'PROGRESS',
        progress,
        status: `流式处理: ${progressData.currentChunk}/${progressData.totalChunks} 块`,
      })
    },
  })

  try {
    // Process document using streaming
    const result = await streamProcessor.processLargeDocument(
      jsonDocument,
      async (chunkDocument) => {
        return await converter.convert(chunkDocument, format)
      },
    )

    self.postMessage({
      type: 'PROGRESS',
      progress: 90,
      status: '完成流式处理...',
    })

    self.postMessage({
      type: 'CONVERSION_SUCCESS',
      result: {
        format,
        data: result.data || result,
        metadata: result.metadata || {},
        timestamp: new Date().toISOString(),
      },
    })
  }
  catch (error) {
    self.postMessage({
      type: 'CONVERSION_ERROR',
      error: {
        message: `流式处理失败: ${error.message}`,
        code: 'STREAMING_FAILED',
      },
    })
  }
}

async function handleJsonValidation({ jsonText, validateSchema = true }) {
  self.postMessage({
    type: 'VALIDATION_START',
  })

  try {
    // Basic JSON parsing
    const parsedJson = JSON.parse(jsonText)

    if (validateSchema) {
      // Perform schema validation
      const { DocumentValidator } = await import('/packages/converter/src/utils/validator.js')
      const validator = new DocumentValidator()
      const validationResult = validator.validate(parsedJson)

      self.postMessage({
        type: 'VALIDATION_SUCCESS',
        result: validationResult,
      })
    }
    else {
      self.postMessage({
        type: 'VALIDATION_SUCCESS',
        result: {
          valid: true,
          errors: [],
          warnings: [],
        },
      })
    }
  }
  catch (error) {
    self.postMessage({
      type: 'VALIDATION_ERROR',
      error: {
        message: error.message,
        type: 'JSON_PARSE_ERROR',
      },
    })
  }
}
