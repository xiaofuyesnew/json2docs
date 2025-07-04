const fs = require('fs');
const path = require('path');

// 读取示例数据
const sampleData = JSON.parse(fs.readFileSync('./examples/sample-document.json', 'utf-8'));

// 简单的PDF生成测试（使用pdfmake）
async function testPdfGeneration() {
  try {
    console.log('正在测试PDF生成...');

    // 动态导入pdfmake
    const pdfMake = require('pdfmake/build/pdfmake');
    const pdfFonts = require('pdfmake/build/vfs_fonts');

    // 注册字体
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    // 创建PDF定义
    const docDefinition = createPdfDefinition(sampleData);

    // 确保输出目录存在
    const outputDir = './output';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 生成PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    const outputPath = path.join(outputDir, 'sample-document.pdf');

    pdfDoc.getBuffer((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ PDF文件已生成: ${outputPath}`);
      console.log('注意：由于缺少中文字体，中文可能显示为方框或乱码');
    });

  } catch (error) {
    console.error('PDF生成失败:', error.message);
  }
}

function createPdfDefinition(document) {
  const { metadata, style, content } = document;

  return {
    info: {
      title: metadata.title,
      author: metadata.author || '',
      subject: metadata.subject || '',
      keywords: metadata.keywords || [],
      creator: 'JSON2Docs',
      producer: 'JSON2Docs'
    },
    pageSize: style?.pageSize || 'A4',
    pageOrientation: style?.orientation || 'portrait',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      fontSize: parseInt(style?.fontSize || '12'),
      lineHeight: parseFloat(style?.lineHeight || '1.6'),
      color: style?.color || '#333333'
    },
    content: [
      // 标题页
      {
        text: metadata.title,
        style: 'documentTitle',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      // 元信息
      ...createMetadataSection(metadata),
      // 内容
      ...content.map(element => convertElement(element))
    ],
    styles: createStyles()
  };
}

function createMetadataSection(metadata) {
  const sections = [];

  if (metadata.author) {
    sections.push({
      text: `Author: ${metadata.author}`,
      style: 'metadata',
      alignment: 'center'
    });
  }

  if (metadata.subject) {
    sections.push({
      text: `Subject: ${metadata.subject}`,
      style: 'metadata',
      alignment: 'center'
    });
  }

  if (metadata.createdAt) {
    sections.push({
      text: `Created: ${metadata.createdAt}`,
      style: 'metadata',
      alignment: 'center'
    });
  }

  if (sections.length > 0) {
    sections.push({ text: '', margin: [0, 20] }); // 添加间距
  }

  return sections;
}

function convertElement(element) {
  switch (element.type) {
    case 'text':
      return {
        text: element.content,
        style: {
          fontSize: parseInt(element.fontSize || '12'),
          bold: element.fontWeight === 'bold',
          color: element.color || '#333333',
          alignment: element.textAlign || 'left'
        }
      };
    case 'heading':
      const headingStyles = {
        1: 'heading1',
        2: 'heading2',
        3: 'heading3',
        4: 'heading4',
        5: 'heading5',
        6: 'heading6'
      };
      return {
        text: element.content,
        style: headingStyles[element.level] || 'heading1',
        color: element.color || '#2c3e50',
        margin: [0, 20, 0, 10]
      };
    case 'paragraph':
      return {
        text: element.content,
        style: {
          alignment: element.textAlign || 'justify',
          lineHeight: parseFloat(element.lineHeight || '1.6'),
          margin: [0, 0, 0, 10]
        }
      };
    case 'list':
      return {
        ul: element.listType === 'unordered' ? element.items : undefined,
        ol: element.listType === 'ordered' ? element.items : undefined,
        style: {
          margin: [0, 0, 0, 10]
        }
      };
    case 'table':
      const body = [
        // 表头
        element.headers.map(header => ({
          text: header,
          style: 'tableHeader'
        })),
        // 数据行
        ...element.rows.map(row =>
          row.map(cell => ({
            text: cell,
            style: 'tableCell'
          }))
        )
      ];

      return {
        table: {
          headerRows: 1,
          widths: element.headers.map(() => '*'),
          body
        },
        style: {
          margin: [0, 10, 0, 10]
        }
      };
    case 'divider':
      return {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515, // A4宽度减去边距
            y2: 0,
            lineWidth: 1,
            lineColor: element.color || '#dddddd'
          }
        ],
        margin: [0, 20, 0, 20]
      };
    case 'container':
      const children = element.children.map(child => convertElement(child));
      return {
        stack: children,
        style: {
          margin: [0, 10, 0, 10]
        }
      };
    default:
      return { text: '' };
  }
}

function createStyles() {
  return {
    documentTitle: {
      fontSize: 24,
      bold: true,
      color: '#2c3e50',
      margin: [0, 0, 0, 30]
    },
    metadata: {
      fontSize: 10,
      color: '#7f8c8d',
      margin: [0, 5, 0, 5]
    },
    heading1: {
      fontSize: 20,
      bold: true,
      color: '#2c3e50',
      margin: [0, 20, 0, 10]
    },
    heading2: {
      fontSize: 18,
      bold: true,
      color: '#34495e',
      margin: [0, 15, 0, 8]
    },
    heading3: {
      fontSize: 16,
      bold: true,
      color: '#34495e',
      margin: [0, 12, 0, 6]
    },
    heading4: {
      fontSize: 14,
      bold: true,
      color: '#34495e',
      margin: [0, 10, 0, 5]
    },
    heading5: {
      fontSize: 12,
      bold: true,
      color: '#34495e',
      margin: [0, 8, 0, 4]
    },
    heading6: {
      fontSize: 11,
      bold: true,
      color: '#34495e',
      margin: [0, 6, 0, 3]
    },
    tableHeader: {
      bold: true,
      fontSize: 10,
      color: '#2c3e50',
      fillColor: '#f8f9fa',
      alignment: 'center'
    },
    tableCell: {
      fontSize: 10,
      color: '#333333'
    }
  };
}

// 运行测试
testPdfGeneration();