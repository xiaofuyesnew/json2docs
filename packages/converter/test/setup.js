// Vitest 测试环境设置
import { expect, vi } from 'vitest'

// Mock console methods in tests
globalThis.console = {
  ...console,
  // 在测试中静默 console.log
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// 添加测试辅助函数
export function createTestDocument() {
  return {
    version: '1.0',
    metadata: {
      title: '测试文档',
      author: '测试作者',
      created: new Date().toISOString().split('T')[0],
      description: '这是一个测试文档',
    },
    content: [
      {
        type: 'heading',
        level: 1,
        text: '测试标题',
      },
      {
        type: 'paragraph',
        text: '这是一个测试段落。',
      },
    ],
    styles: {},
  }
}
expect.extend({
  toBeValidDocument(received) {
    const isValid = received
      && typeof received === 'object'
      && typeof received.version === 'string'
      && typeof received.metadata === 'object'
      && Array.isArray(received.content)

    if (isValid) {
      return {
        message: () => `expected ${received} not to be a valid document`,
        pass: true,
      }
    }
    else {
      return {
        message: () => `expected ${received} to be a valid document`,
        pass: false,
      }
    }
  },
})
