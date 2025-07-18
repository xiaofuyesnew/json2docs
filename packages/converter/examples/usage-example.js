/**
 * 转换器库使用示例
 */
import { DocumentConverter } from '../src/index.js'

// 创建转换器实例
const converter = new DocumentConverter()

// 示例JSON文档
const jsonDocument = {
  version: '1.0',
  metadata: {
    title: '示例文档',
    author: '示例作者',
    created: '2025-07-24',
    description: '这是一个示例文档',
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: '示例标题',
    },
    {
      type: 'paragraph',
      text: '这是一个示例段落，展示了JSON文档转换器的基本用法。',
    },
    {
      type: 'list',
      listType: 'unordered',
      items: [
        { text: '列表项1', level: 0 },
        { text: '列表项2', level: 0 },
        { text: '嵌套列表项', level: 1 },
      ],
    },
    {
      type: 'table',
      headers: ['列1', '列2', '列3'],
      rows: [
        ['数据1', '数据2', '数据3'],
        ['数据4', '数据5', '数据6'],
      ],
    },
  ],
  styles: {},
}

// 转换为HTML
async function convertToHTML() {
  try {
    console.log('转换为HTML...')
    const result = await converter.convert(jsonDocument, 'html')
    console.log('HTML转换结果:')
    console.log(`${result.data.substring(0, 200)}...`)
  }
  catch (error) {
    console.error('HTML转换失败:', error)
  }
}

// 转换为PDF
async function convertToPDF() {
  try {
    console.log('\n转换为PDF...')
    const result = await converter.convert(jsonDocument, 'pdf')
    console.log('PDF转换结果: [二进制数据]')
    console.log(`PDF大小: ${result.data.byteLength} 字节`)
  }
  catch (error) {
    console.error('PDF转换失败:', error)
  }
}

// 转换为DOCX
async function convertToDOCX() {
  try {
    console.log('\n转换为DOCX...')
    const result = await converter.convert(jsonDocument, 'docx')
    console.log('DOCX转换结果: [二进制数据]')
    console.log(`DOCX大小: ${result.data.byteLength} 字节`)
  }
  catch (error) {
    console.error('DOCX转换失败:', error)
  }
}

// 运行示例
async function runExamples() {
  console.log('JSON文档转换器使用示例\n')

  await convertToHTML()
  await convertToPDF()
  await convertToDOCX()

  console.log('\n示例完成')
}

runExamples().catch(console.error)
