/**
 * PDFGenerator使用示例
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { PDFGenerator } from '../src/generators/PDFGenerator.js'
import { DocumentModel } from '../src/models/DocumentModel.js'

// 获取当前文件目录
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 创建示例JSON文档
const jsonDocument = {
  metadata: {
    title: 'PDF示例文档',
    author: '开发者',
    description: 'PDFGenerator示例',
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: 'PDF文档标题',
      id: 'doc-title',
    },
    {
      type: 'paragraph',
      text: '这是一个PDF文档示例，展示了PDF生成器的功能。',
      alignment: 'justify',
    },
    {
      type: 'heading',
      level: 2,
      text: '列表示例',
    },
    {
      type: 'list',
      listType: 'unordered',
      items: [
        '无序列表项1',
        { text: '无序列表项1.1', level: 1 },
        { text: '无序列表项1.2', level: 1 },
        '无序列表项2',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: '有序列表示例',
    },
    {
      type: 'list',
      listType: 'ordered',
      items: [
        '有序列表项1',
        '有序列表项2',
        '有序列表项3',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: '表格示例',
    },
    {
      type: 'table',
      headers: ['名称', '数量', '单价'],
      rows: [
        ['产品A', '2', '¥100'],
        ['产品B', '1', '¥200'],
        ['产品C', '3', '¥50'],
      ],
    },
  ],
  styles: {
    fonts: {
      default: 'Helvetica',
      heading: 'Helvetica-Bold',
    },
    colors: {
      text: '#333333',
      background: '#ffffff',
      heading: '#000000',
    },
    sizes: {
      baseFontSize: '12pt',
      h1: '24pt',
      h2: '18pt',
    },
    spacing: {
      lineHeight: 1.5,
      paragraphSpacing: '12pt',
    },
  },
}

// 使用PDFGenerator生成PDF
async function generatePDF() {
  try {
    // 创建文档模型
    const documentModel = new DocumentModel(jsonDocument)

    // 创建PDF生成器
    const pdfGenerator = new PDFGenerator({
      baseFontSize: 12,
      margins: { top: 72, right: 72, bottom: 72, left: 72 }, // 1英寸边距
    })

    // 生成PDF
    const result = await pdfGenerator.generate(documentModel)

    console.log('PDF生成成功:')
    console.log('- 格式:', result.format)
    console.log('- 文档标题:', result.metadata.documentTitle)
    console.log('- 页数:', result.metadata.pageCount)

    // 保存到文件
    const outputPath = path.join(__dirname, 'output', 'example.pdf')

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, result.data)
    console.log(`PDF文件已保存到: ${outputPath}`)

    return result
  }
  catch (error) {
    console.error('PDF生成失败:', error)
    throw error
  }
}

// 执行示例
generatePDF().catch(console.error)
