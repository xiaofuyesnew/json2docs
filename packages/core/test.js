import { Json2Docs } from './src/index.js';

// 测试配置
const testConfig = {
  content: [
    { text: 'JSON2Docs 测试文档', style: 'header' },
    { text: '这是一个测试文档，用于验证核心功能', margin: [0, 10, 0, 0] },
    {
      table: {
        headerRows: 1,
        body: [
          ['姓名', '年龄', '职业'],
          ['张三', '25', '工程师'],
          ['李四', '30', '设计师'],
          ['王五', '28', '产品经理']
        ]
      },
      margin: [0, 10, 0, 0]
    },
    { text: '项目列表：', style: 'subheader', margin: [0, 20, 0, 10] },
    {
      ul: [
        '核心转换引擎',
        'HTML DOM 生成',
        'PDF 文档生成',
        'DOCX 文档生成'
      ]
    },
    { text: '技术栈：', style: 'subheader', margin: [0, 20, 0, 10] },
    {
      ol: [
        'JavaScript ES6+',
        'pdfmake 库',
        'docx 库',
        'Vite 构建工具'
      ]
    }
  ],
  styles: {
    header: {
      fontSize: 24,
      bold: true,
      color: '#2c3e50',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      color: '#34495e',
      margin: [0, 10, 0, 5]
    }
  },
  output: {
    format: 'html'
  }
};

// 测试函数
async function testCore() {
  console.log('🚀 开始测试 JSON2Docs 核心功能...\n');

  const json2docs = new Json2Docs();

  try {
    // 测试 HTML 生成
    console.log('📄 测试 HTML 生成...');
    const htmlResult = await json2docs.generate({
      ...testConfig,
      output: { format: 'html' }
    });

    if (htmlResult.success) {
      console.log('✅ HTML 生成成功');
      console.log('📝 HTML 内容长度:', htmlResult.content.length);
      console.log('📊 元数据:', htmlResult.metadata);
    } else {
      console.log('❌ HTML 生成失败:', htmlResult.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试配置验证
    console.log('🔍 测试配置验证...');
    const invalidConfig = { content: 'invalid' };
    const validationResult = await json2docs.generate(invalidConfig);

    if (!validationResult.success) {
      console.log('✅ 配置验证正常工作');
      console.log('❌ 验证错误:', validationResult.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试 PDF 生成（仅在有 filename 选项时）
    console.log('📄 测试 PDF 生成...');
    try {
      const pdfResult = await json2docs.generate({
        ...testConfig,
        output: {
          format: 'pdf',
          options: { filename: 'test-document.pdf' }
        }
      });

      if (pdfResult.success) {
        console.log('✅ PDF 生成成功');
        console.log('📁 输出路径:', pdfResult.outputPath);
      } else {
        console.log('❌ PDF 生成失败:', pdfResult.error);
      }
    } catch (error) {
      console.log('⚠️  PDF 生成跳过（可能缺少依赖）:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试 DOCX 生成（仅在有 filename 选项时）
    console.log('📄 测试 DOCX 生成...');
    try {
      const docxResult = await json2docs.generate({
        ...testConfig,
        output: {
          format: 'docx',
          options: { filename: 'test-document.docx' }
        }
      });

      if (docxResult.success) {
        console.log('✅ DOCX 生成成功');
        console.log('📁 输出路径:', docxResult.outputPath);
      } else {
        console.log('❌ DOCX 生成失败:', docxResult.error);
      }
    } catch (error) {
      console.log('⚠️  DOCX 生成跳过（可能缺少依赖）:', error.message);
    }

    console.log('\n🎉 测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testCore();