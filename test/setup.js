// Vitest 测试环境设置
import { vi } from 'vitest'

// Mock console methods in tests
globalThis.console = {
  ...console,
  // 在测试中静默 console.log
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
