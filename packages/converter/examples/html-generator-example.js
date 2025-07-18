/**
 * HTMLGenerator使用示例
 */

import { HTMLGenerator } from '../src/generators/HTMLGenerator.js'
import { DocumentModel } from '../src/models/DocumentModel.js'

// 创建示例JSON文档
const jsonDocument = {
  metadata: {
    title: '示例文档',
    author: '开发者',
    description: 'HTMLGenerator示例',
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: '文档标题',
      id: 'doc-title',
    },
    {
      type: 'paragraph',
      text: '这是一个**粗体**和*斜体*文本的段落示例。这里有一个[链接](https://example.com)。',
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
      text: '图片示例',
    },
    {
      type: 'image',
      src: 'https://via.placeholder.com/300x200',
      alt: '示例图片',
      width: 300,
      height: 200,
    },
  ],
  styles: {
    fonts: {
      default: 'Roboto, sans-serif',
      heading: 'Montserrat, sans-serif',
    },
    colors: {
      text: '#333333',
      background: '#ffffff',
      heading: '#000000',
      link: '#0066cc',
    },
    sizes: {
      baseFontSize: '16px',
      h1: '2em',
      h2: '1.5em',
    },
    spacing: {
      lineHeight: 1.6,
      paragraphSpacing: '1.2em',
    },
  },
}

// 使用HTMLGenerator生成HTML
async function generateHTML() {
  try {
    // 创建文档模型
    const documentModel = new DocumentModel(jsonDocument)

    // 创建HTML生成器
    const htmlGenerator = new HTMLGenerator({
      prettyPrint: true,
      classPrefix: 'doc-',
    })

    // 生成HTML
    const result = await htmlGenerator.generate(documentModel)

    console.log('HTML生成成功:')
    console.log(result.data)

    // 获取Blob对象（用于浏览器环境下载）
    const blob = result.toBlob()
    console.log('Blob MIME类型:', blob.type)

    // 获取推荐的文件名
    console.log('推荐文件名:', result.getFileName())

    return result
  }
  catch (error) {
    console.error('HTML生成失败:', error)
    throw error
  }
}

// 执行示例
generateHTML().catch(console.error)
