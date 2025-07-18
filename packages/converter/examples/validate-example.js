/**
 * 文档验证示例
 */
import { DocumentValidator, documentSchema } from '../src/index.js'

// 创建验证器实例
const validator = new DocumentValidator()

// 有效的JSON文档
const validDocument = {
  version: '1.0',
  metadata: {
    title: '有效文档',
    author: '示例作者',
    created: '2025-07-24',
    description: '这是一个有效的文档',
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: '示例标题',
    },
    {
      type: 'paragraph',
      text: '这是一个段落。',
    },
  ],
  styles: {},
}

// 无效的JSON文档 - 缺少必要字段
const invalidDocument1 = {
  version: '1.0',
  // 缺少metadata
  content: [
    {
      type: 'heading',
      level: 1,
      text: '示例标题',
    },
  ],
}

// 无效的JSON文档 - 内容块类型错误
const invalidDocument2 = {
  version: '1.0',
  metadata: {
    title: '无效文档',
    author: '示例作者',
  },
  content: [
    {
      type: 'unknown-type', // 未知类型
      text: '这是一个无效的内容块。',
    },
  ],
  styles: {},
}

// 验证文档
function validateDocument(doc, name) {
  console.log(`\n验证文档: ${name}`)
  try {
    const result = validator.validate(doc)
    if (result.valid) {
      console.log('✅ 文档有效')
    }
    else {
      console.log('❌ 文档无效:')
      console.log(result.errors)
    }
  }
  catch (error) {
    console.error('验证过程出错:', error)
  }
}

// 运行示例
function runExamples() {
  console.log('JSON文档验证示例\n')

  console.log('文档模式:')
  console.log(`${JSON.stringify(documentSchema, null, 2).substring(0, 200)}...`)

  validateDocument(validDocument, '有效文档')
  validateDocument(invalidDocument1, '无效文档1 (缺少metadata)')
  validateDocument(invalidDocument2, '无效文档2 (未知内容类型)')

  console.log('\n示例完成')
}

runExamples()
