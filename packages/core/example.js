import { Json2Docs } from './src/index.js';

// 创建 Json2Docs 实例
const json2docs = new Json2Docs();

// 示例配置
const config = {
  content: [
    { text: '欢迎使用 JSON2Docs', style: 'title' },
    { text: '这是一个强大的文档生成工具', margin: [0, 10, 0, 0] },
    {
      table: {
        headerRows: 1,
        body: [
          ['功能', '状态', '说明'],
          ['HTML 生成', '✅', '支持完整的 HTML DOM 输出'],
          ['PDF 生成', '✅', '基于 pdfmake 库'],
          ['DOCX 生成', '✅', '基于 docx 库']
        ]
      },
      margin: [0, 15, 0, 0]
    },
    { text: '特性列表：', style: 'subtitle', margin: [0, 20, 0, 10] },
    {
      ul: [
        '完全兼容 pdfmake 配置格式',
        '支持多种输出格式',
        '强大的样式转换引擎',
        '易于集成到现有项目'
      ]
    }
  ],
  styles: {
    title: {
      fontSize: 24,
      bold: true,
      color: '#2c3e50',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    subtitle: {
      fontSize: 16,
      bold: true,
      color: '#34495e'
    }
  },
  output: {
    format: 'html'
  }
};

// 生成文档
async function generateDocument() {
  try {
    console.log('🔄 正在生成文档...');

    const result = await json2docs.generate(config);

    if (result.success) {
      console.log('✅ 文档生成成功！');
      console.log('📄 格式:', result.format);
      console.log('📝 内容长度:', result.content.length);
      console.log('📊 生成时间:', result.metadata.generatedAt);

      // 在浏览器环境中显示 HTML 内容
      if (typeof window !== 'undefined') {
        document.body.innerHTML = result.content;
      } else {
        console.log('\n📄 HTML 内容预览:');
        console.log(result.content.substring(0, 500) + '...');
      }
    } else {
      console.log('❌ 文档生成失败:', result.error);
    }
  } catch (error) {
    console.error('❌ 发生错误:', error);
  }
}

// 运行示例
generateDocument();