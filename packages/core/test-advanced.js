import { Json2Docs } from './src/index.js';

// 高级测试配置
const advancedConfig = {
  content: [
    { text: 'JSON2Docs 高级功能测试', style: 'title' },
    { text: '测试各种高级功能和选项', style: 'subtitle' },
    {
      stack: [
        { text: '堆叠内容 1', style: 'normal' },
        { text: '堆叠内容 2', style: 'highlight' },
        {
          columns: [
            { text: '列 1', style: 'column' },
            { text: '列 2', style: 'column' }
          ]
        }
      ],
      margin: [0, 10, 0, 0]
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: '功能', style: 'tableHeader' },
            { text: '状态', style: 'tableHeader' },
            { text: '说明', style: 'tableHeader' }
          ],
          ['样式缓存', '✅', '提高性能'],
          ['配置预处理', '✅', '自动应用默认样式'],
          ['统计信息', '✅', '文档内容分析'],
          ['样式验证', '✅', '配置质量检查']
        ]
      },
      margin: [0, 15, 0, 0]
    },
    { text: '支持的样式属性：', style: 'subtitle', margin: [0, 20, 0, 10] },
    {
      ul: [
        'fontSize - 字体大小',
        'font - 字体名称',
        'bold - 粗体',
        'italic - 斜体',
        'color - 颜色',
        'alignment - 对齐方式',
        'margin - 外边距',
        'padding - 内边距',
        'background - 背景色',
        'border - 边框',
        'lineHeight - 行高',
        'textDecoration - 文本装饰'
      ]
    }
  ],
  styles: {
    title: {
      fontSize: 28,
      bold: true,
      color: '#2c3e50',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    subtitle: {
      fontSize: 18,
      bold: true,
      color: '#34495e',
      margin: [0, 15, 0, 10]
    },
    normal: {
      fontSize: 14,
      color: '#2c3e50'
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
  },
  output: {
    format: 'html'
  }
};

// 高级测试函数
async function testAdvancedFeatures() {
  console.log('🚀 开始测试 JSON2Docs 高级功能...\n');

  // 创建实例并设置选项
  const json2docs = new Json2Docs({
    defaultFontSize: 14,
    defaultFont: 'Arial',
    enableSourceMap: true
  });

  try {
    // 测试选项设置
    console.log('⚙️  测试选项设置...');
    console.log('当前选项:', json2docs.getOptions());

    json2docs.setOptions({ defaultFontSize: 16 });
    console.log('更新后选项:', json2docs.getOptions());

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试格式支持检查
    console.log('🔍 测试格式支持检查...');
    console.log('支持的格式:', json2docs.getSupportedFormats());
    console.log('HTML 支持:', json2docs.isFormatSupported('html'));
    console.log('PDF 支持:', json2docs.isFormatSupported('pdf'));
    console.log('DOCX 支持:', json2docs.isFormatSupported('docx'));
    console.log('TXT 支持:', json2docs.isFormatSupported('txt'));

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试样式验证
    console.log('🎨 测试样式验证...');
    const styleValidation = json2docs.validateStyles(advancedConfig.styles);
    console.log('样式验证结果:', styleValidation);

    if (styleValidation.warnings.length > 0) {
      console.log('⚠️  样式警告:', styleValidation.warnings);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试文档统计
    console.log('📊 测试文档统计...');
    const stats = json2docs.getDocumentStats(advancedConfig);
    console.log('文档统计:', stats);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试支持的样式属性
    console.log('🎯 测试支持的样式属性...');
    const supportedProps = json2docs.getSupportedStyleProperties();
    console.log('支持的样式属性:', supportedProps);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试颜色验证
    console.log('🌈 测试颜色验证...');
    const testColors = ['#ff0000', '#00ff00', 'rgb(0,0,255)', 'invalid-color'];
    testColors.forEach(color => {
      console.log(`${color}: ${json2docs.isValidColor(color) ? '✅' : '❌'}`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试配置预处理
    console.log('🔧 测试配置预处理...');
    const processedConfig = json2docs.preprocessConfig(advancedConfig);
    console.log('预处理后的配置包含默认样式:', !!processedConfig.styles.default);
    console.log('默认样式:', processedConfig.styles.default);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试样式缓存
    console.log('💾 测试样式缓存...');
    const startTime = Date.now();
    const styleMap1 = json2docs.buildStyleMap(advancedConfig.styles);
    const time1 = Date.now() - startTime;

    const startTime2 = Date.now();
    const styleMap2 = json2docs.buildStyleMap(advancedConfig.styles);
    const time2 = Date.now() - startTime2;

    console.log(`首次构建样式映射: ${time1}ms`);
    console.log(`缓存构建样式映射: ${time2}ms`);
    console.log('缓存效果:', time1 > time2 ? '✅ 缓存生效' : '❌ 缓存未生效');

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试文档生成
    console.log('📄 测试高级文档生成...');
    const result = await json2docs.generate(advancedConfig);

    if (result.success) {
      console.log('✅ 高级文档生成成功');
      console.log('📝 HTML 内容长度:', result.content.length);
      console.log('📊 详细元数据:', result.metadata);

      // 显示生成的 HTML 预览
      console.log('\n📄 HTML 内容预览:');
      console.log(result.content.substring(0, 800) + '...');
    } else {
      console.log('❌ 高级文档生成失败:', result.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试缓存清理
    console.log('🧹 测试缓存清理...');
    json2docs.clearStyleCache();
    console.log('✅ 样式缓存已清理');

    console.log('\n🎉 高级功能测试完成！');

  } catch (error) {
    console.error('❌ 高级测试过程中发生错误:', error);
  }
}

// 运行高级测试
testAdvancedFeatures();