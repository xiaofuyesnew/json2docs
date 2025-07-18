/**
 * DOCXGenerator使用示例
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DOCXGenerator } from '../src/generators/DOCXGenerator.js'
import { DocumentModel } from '../src/models/DocumentModel.js'

// 获取当前文件目录
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 创建示例JSON文档
const jsonDocument = {
  metadata: {
    title: 'DOCX示例文档',
    author: '开发者',
    description: 'DOCXGenerator示例',
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: 'DOCX文档标题',
      id: 'doc-title',
    },
    {
      type: 'paragraph',
      text: '这是一个DOCX文档示例，展示了DOCX生成器的功能。这段文字包含**粗体**文本。',
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
    {
      type: 'heading',
      level: 2,
      text: '不同级别标题示例',
    },
    {
      type: 'heading',
      level: 3,
      text: '三级标题',
    },
    {
      type: 'paragraph',
      text: '这是三级标题下的段落。',
    },
    {
      type: 'heading',
      level: 4,
      text: '四级标题',
    },
    {
      type: 'paragraph',
      text: '这是四级标题下的段落。',
    },
  ],
  styles: {
    fonts: {
      default: 'Arial',
      heading: 'Arial',
    },
    colors: {
      text: '#333333',
      background: '#ffffff',
      heading: '#000000',
    },
    sizes: {
      baseFontSize: '11pt',
      h1: '24pt',
      h2: '18pt',
    },
    spacing: {
      lineHeight: 1.15,
      paragraphSpacing: '8pt',
    },
  },
}

// 使用DOCXGenerator生成DOCX
async function generateDOCX() {
  try {
    // 创建文档模型
    const documentModel = new DocumentModel(jsonDocument)

    // 创建DOCX生成器
    const docxGenerator = new DOCXGenerator({
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
      includeHeaderFooter: true,
      includePageNumbers: true,
    })

    // 生成DOCX
    const result = await docxGenerator.generate(documentModel)

    console.log('DOCX生成成功:')
    console.log('- 格式:', result.format)
    console.log('- 文档标题:', result.metadata.documentTitle)

    // 保存到文件
    const outputPath = path.join(__dirname, 'output', 'example.docx')

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, result.data)
    console.log(`DOCX文件已保存到: ${outputPath}`)

    return result
  }
  catch (error) {
    console.error('DOCX生成失败:', error)
    throw error
  }
}

// 执行示例
generateDOCX().catch(console.error)
