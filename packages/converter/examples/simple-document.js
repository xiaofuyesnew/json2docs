/**
 * 简单文档示例
 */

export const simpleDocument = {
  version: '1.0',
  metadata: {
    title: '简单文档示例',
    author: 'JSON2Docs Team',
    created: '2025-07-24',
    description: '这是一个简单的文档示例',
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: '文档标题',
      id: 'document-title',
    },
    {
      type: 'paragraph',
      text: '这是一个简单的段落示例。JSON2Docs可以将JSON结构化文档数据转换为HTML、PDF和DOCX格式。',
      alignment: 'left',
    },
    {
      type: 'heading',
      level: 2,
      text: '功能列表',
      id: 'features',
    },
    {
      type: 'list',
      listType: 'unordered',
      items: [
        { text: 'HTML转换', level: 0 },
        { text: '支持DOM输出', level: 1 },
        { text: '支持样式定制', level: 1 },
        { text: 'PDF转换', level: 0 },
        { text: '使用pdf-lib库', level: 1 },
        { text: 'DOCX转换', level: 0 },
        { text: '使用docx库', level: 1 },
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: '数据表格',
      id: 'data-table',
    },
    {
      type: 'table',
      headers: ['格式', '库', '特点'],
      rows: [
        ['HTML', '原生DOM', '浏览器兼容'],
        ['PDF', 'pdf-lib', '无需服务器'],
        ['DOCX', 'docx', 'Word兼容'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: '示例图片',
      id: 'example-image',
    },
    {
      type: 'image',
      src: 'https://via.placeholder.com/300x200',
      alt: '示例图片',
      width: 300,
      height: 200,
    },
    {
      type: 'paragraph',
      text: '这是文档的结尾。感谢使用JSON2Docs！',
      alignment: 'center',
    },
  ],
  styles: {
    fonts: {
      default: 'Arial, sans-serif',
      heading: 'Georgia, serif',
      monospace: 'Courier New, monospace',
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
      h3: '1.17em',
      h4: '1em',
      h5: '0.83em',
      h6: '0.67em',
    },
    spacing: {
      lineHeight: 1.5,
      paragraphSpacing: '1em',
      listItemSpacing: '0.5em',
    },
  },
}
