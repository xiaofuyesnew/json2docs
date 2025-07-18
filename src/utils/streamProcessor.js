// Streaming processor for large documents
export class StreamProcessor {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 50
    this.batchDelay = options.batchDelay || 10
    this.onProgress = options.onProgress || (() => {})
    this.onChunkProcessed = options.onChunkProcessed || (() => {})
  }

  // Process large array in chunks
  async processInChunks(items, processor) {
    const chunks = this.createChunks(items)
    const results = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]

      // Process chunk
      const chunkResult = await processor(chunk, i)
      results.push(chunkResult)

      // Report progress
      const progress = ((i + 1) / chunks.length) * 100
      this.onProgress({
        progress,
        currentChunk: i + 1,
        totalChunks: chunks.length,
        processedItems: (i + 1) * this.chunkSize,
      })

      // Notify chunk processed
      this.onChunkProcessed({
        chunkIndex: i,
        chunkResult,
        totalProcessed: results.length,
      })

      // Allow other tasks to run
      if (i < chunks.length - 1) {
        await this.delay(this.batchDelay)
      }
    }

    return results
  }

  // Create chunks from array
  createChunks(items) {
    const chunks = []
    for (let i = 0; i < items.length; i += this.chunkSize) {
      chunks.push(items.slice(i, i + this.chunkSize))
    }
    return chunks
  }

  // Process stream with backpressure handling
  async processStream(stream, processor) {
    const reader = stream.getReader()
    const results = []
    let totalProcessed = 0

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done)
          break

        // Process chunk
        const result = await processor(value, totalProcessed)
        results.push(result)
        totalProcessed++

        // Report progress
        this.onProgress({
          processedItems: totalProcessed,
          currentChunk: value,
        })

        // Allow other tasks to run
        await this.delay(this.batchDelay)
      }
    }
    finally {
      reader.releaseLock()
    }

    return results
  }

  // Create readable stream from array
  createReadableStream(items) {
    let index = 0

    return new ReadableStream({
      pull(controller) {
        if (index < items.length) {
          controller.enqueue(items[index++])
        }
        else {
          controller.close()
        }
      },
    })
  }

  // Process large JSON document in streaming fashion
  async processLargeDocument(document, processor) {
    if (!document.content || document.content.length <= this.chunkSize) {
      // Small document, process normally
      return await processor(document)
    }

    // Large document, process in chunks
    const contentChunks = this.createChunks(document.content)
    const processedChunks = []

    for (let i = 0; i < contentChunks.length; i++) {
      const chunk = contentChunks[i]

      // Create temporary document with chunk
      const chunkDocument = {
        ...document,
        content: chunk,
      }

      // Process chunk
      const chunkResult = await processor(chunkDocument)
      processedChunks.push(chunkResult)

      // Report progress
      const progress = ((i + 1) / contentChunks.length) * 100
      this.onProgress({
        progress,
        status: `处理块 ${i + 1}/${contentChunks.length}`,
        currentChunk: i + 1,
        totalChunks: contentChunks.length,
      })

      // Allow other tasks to run
      if (i < contentChunks.length - 1) {
        await this.delay(this.batchDelay)
      }
    }

    return this.mergeResults(processedChunks, document)
  }

  // Merge processed chunks back into single result
  // mergeResults(chunks, originalDocument) {
  mergeResults(chunks) {
    // This is a simplified merge - in real implementation,
    // you'd need format-specific merging logic
    if (chunks.length === 1) {
      return chunks[0]
    }

    // For now, just concatenate string results
    if (typeof chunks[0] === 'string') {
      return chunks.join('\n')
    }

    // For objects, merge properties
    if (typeof chunks[0] === 'object') {
      return chunks.reduce((merged, chunk) => {
        return { ...merged, ...chunk }
      }, {})
    }

    return chunks[0]
  }

  // Memory-efficient processing with cleanup
  async processWithMemoryManagement(items, processor, options = {}) {
    const maxMemoryUsage = options.maxMemoryUsage || 100 * 1024 * 1024 // 100MB
    const cleanupInterval = options.cleanupInterval || 10

    let processedCount = 0
    const results = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // Process item
      const result = await processor(item, i)
      results.push(result)
      processedCount++

      // Check memory usage and cleanup if needed
      if (processedCount % cleanupInterval === 0) {
        await this.performMemoryCleanup()

        // Check if we're approaching memory limit
        if (this.getMemoryUsage() > maxMemoryUsage) {
          console.warn('Memory usage high, forcing garbage collection')
          await this.forceGarbageCollection()
        }
      }

      // Report progress
      this.onProgress({
        progress: ((i + 1) / items.length) * 100,
        processedItems: processedCount,
        totalItems: items.length,
      })

      // Allow other tasks to run
      await this.delay(this.batchDelay)
    }

    return results
  }

  // Get current memory usage (if available)
  getMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize
    }
    return 0
  }

  // Perform memory cleanup
  async performMemoryCleanup() {
    // Clear any temporary variables
    // Force garbage collection if available
    if (window.gc) {
      window.gc()
    }

    // Allow time for cleanup
    await this.delay(5)
  }

  // Force garbage collection (development only)
  async forceGarbageCollection() {
    if (window.gc && import.meta.env.DEV) {
      window.gc()
      await this.delay(10)
    }
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Create processor with automatic chunking
  static createChunkedProcessor(processor, options = {}) {
    return new StreamProcessor(options).processInChunks.bind(
      new StreamProcessor(options),
    )
  }

  // Create memory-aware processor
  static createMemoryAwareProcessor(processor, options = {}) {
    return new StreamProcessor(options).processWithMemoryManagement.bind(
      new StreamProcessor(options),
    )
  }
}

// Utility functions for common streaming operations
export const streamUtils = {
  // Check if document is large enough to need streaming
  isLargeDocument(document, threshold = 50000) {
    return JSON.stringify(document).length > threshold
  },

  // Estimate processing time based on document size
  estimateProcessingTime(document) {
    const size = JSON.stringify(document).length
    const contentBlocks = document.content?.length || 0

    // Base time + size factor + complexity factor
    const baseTime = 1000 // 1 second base
    const sizeFactor = size / 10000 * 100 // 100ms per 10KB
    const complexityFactor = contentBlocks * 10 // 10ms per content block

    return baseTime + sizeFactor + complexityFactor
  },

  // Create progress reporter
  createProgressReporter(callback) {
    let lastReportTime = 0
    const reportInterval = 100 // Report every 100ms

    return (progress) => {
      const now = Date.now()
      if (now - lastReportTime >= reportInterval) {
        callback(progress)
        lastReportTime = now
      }
    }
  },
}

export default StreamProcessor
