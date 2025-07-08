import { Json2Docs } from './src/index.js';
import fs from 'fs';
import path from 'path';

// 测试配置
const testConfig = {
  content: [
    { text: 'JSON2Docs PDF/DOCX 测试文档', style: 'title' },
    { text: '这是一个测试文档，用于验证 PDF 和 DOCX 生成功能', style: 'subtitle' },
    { text: '生成时间：' + new Date().toLocaleString('zh-CN'), style: 'normal' },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: '功能', style: 'tableHeader' },
            { text: '状态', style: 'tableHeader' },
            { text: '说明', style: 'tableHeader' }
          ],
          ['HTML 生成', '✅', '支持完整的 HTML DOM 输出'],
          ['PDF 生成', '🔄', '基于 pdfmake 库'],
          ['DOCX 生成', '🔄', '基于 docx 库']
        ]
      },
      margin: [0, 15, 0, 0]
    },
    { text: '项目特性：', style: 'subtitle', margin: [0, 20, 0, 10] },
    {
      ul: [
        '完全兼容 pdfmake 配置格式',
        '支持多种输出格式',
        '强大的样式转换引擎',
        '易于集成到现有项目',
        '高性能的缓存机制'
      ]
    },
    { text: '技术栈：', style: 'subtitle', margin: [0, 20, 0, 10] },
    {
      ol: [
        'JavaScript ES6+',
        'pdfmake 库 - PDF 生成',
        'docx 库 - DOCX 生成',
        'Vite 构建工具'
      ]
    },
    {
      stack: [
        { text: '堆叠内容示例', style: 'highlight' },
        { text: '这是第二层内容', style: 'normal' },
        {
          columns: [
            { text: '左侧列', style: 'column' },
            { text: '右侧列', style: 'column' }
          ]
        }
      ],
      margin: [0, 15, 0, 0]
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
      color: '#34495e',
      margin: [0, 15, 0, 10]
    },
    normal: {
      fontSize: 12,
      color: '#2c3e50',
      margin: [0, 5, 0, 0]
    },
    highlight: {
      fontSize: 14,
      bold: true,
      color: '#e74c3c',
      background: '#fdf2f2'
    },
    column: {
      fontSize: 12,
      color: '#7f8c8d',
      alignment: 'center'
    },
    tableHeader: {
      fontSize: 12,
      bold: true,
      color: '#ffffff',
      fillColor: '#34495e'
    }
  }
};

// 测试函数
async function testPdfDocx() {
  console.log('🚀 开始测试 PDF 和 DOCX 生成功能...\n');

  const json2docs = new Json2Docs();

  try {
    // 测试 PDF 生成
    console.log('📄 测试 PDF 生成...');
    try {
      const pdfResult = await json2docs.generate({
        ...testConfig,
        output: {
          format: 'pdf',
          options: {
            filename: 'test-document.pdf'
          }
        }
      });

      if (pdfResult.success) {
        console.log('✅ PDF 生成成功');
        console.log('📁 输出路径:', pdfResult.outputPath);
        console.log('📊 元数据:', pdfResult.metadata);

        // 检查文件是否存在
        if (pdfResult.outputPath && fs.existsSync(pdfResult.outputPath)) {
          const stats = fs.statSync(pdfResult.outputPath);
          console.log('📏 文件大小:', (stats.size / 1024).toFixed(2), 'KB');
        }
      } else {
        console.log('❌ PDF 生成失败:', pdfResult.error);
      }
    } catch (error) {
      console.log('⚠️  PDF 生成跳过（可能缺少依赖）:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试 DOCX 生成
    console.log('📄 测试 DOCX 生成...');
    try {
      const docxResult = await json2docs.generate({
        ...testConfig,
        output: {
          format: 'docx',
          options: {
            filename: 'test-document.docx'
          }
        }
      });

      if (docxResult.success) {
        console.log('✅ DOCX 生成成功');
        console.log('📁 输出路径:', docxResult.outputPath);
        console.log('📊 元数据:', docxResult.metadata);

        // 检查文件是否存在
        if (docxResult.outputPath && fs.existsSync(docxResult.outputPath)) {
          const stats = fs.statSync(docxResult.outputPath);
          console.log('📏 文件大小:', (stats.size / 1024).toFixed(2), 'KB');
        }
      } else {
        console.log('❌ DOCX 生成失败:', docxResult.error);
      }
    } catch (error) {
      console.log('⚠️  DOCX 生成跳过（可能缺少依赖）:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试无文件名的 PDF 生成（返回 buffer）
    console.log('📄 测试 PDF Buffer 生成...');
    try {
      const pdfBufferResult = await json2docs.generate({
        ...testConfig,
        output: {
          format: 'pdf'
        }
      });

      if (pdfBufferResult.success) {
        console.log('✅ PDF Buffer 生成成功');
        console.log('📏 Buffer 大小:', (pdfBufferResult.content.length / 1024).toFixed(2), 'KB');
        console.log('📊 元数据:', pdfBufferResult.metadata);
      } else {
        console.log('❌ PDF Buffer 生成失败:', pdfBufferResult.error);
      }
    } catch (error) {
      console.log('⚠️  PDF Buffer 生成跳过（可能缺少依赖）:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试无文件名的 DOCX 生成（返回 buffer）
    console.log('📄 测试 DOCX Buffer 生成...');
    try {
      const docxBufferResult = await json2docs.generate({
        ...testConfig,
        output: {
          format: 'docx'
        }
      });

      if (docxBufferResult.success) {
        console.log('✅ DOCX Buffer 生成成功');
        console.log('📏 Buffer 大小:', (docxBufferResult.content.length / 1024).toFixed(2), 'KB');
        console.log('📊 元数据:', docxBufferResult.metadata);
      } else {
        console.log('❌ DOCX Buffer 生成失败:', docxBufferResult.error);
      }
    } catch (error) {
      console.log('⚠️  DOCX Buffer 生成跳过（可能缺少依赖）:', error.message);
    }

    console.log('\n🎉 PDF/DOCX 测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testPdfDocx();