#!/usr/bin/env node

import { Json2Docs } from '../../../packages/core/src/index.js';
import fs from 'fs-extra';
import path from 'path';

// 测试数据
const testConfigs = [
  {
    name: '基础文本测试',
    config: {
      content: [
        { text: '基础文本测试', style: 'header' },
        { text: '这是一个简单的文本测试。', margin: [0, 10, 0, 0] }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2c3e50'
        }
      },
      output: {
        format: 'html'
      }
    }
  },
  {
    name: '表格测试',
    config: {
      content: [
        { text: '表格测试', style: 'header' },
        {
          table: {
            body: [
              ['姓名', '年龄', '职业'],
              ['张三', '25', '工程师'],
              ['李四', '30', '设计师'],
              ['王五', '28', '产品经理']
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2c3e50',
          margin: [0, 0, 0, 20]
        }
      },
      output: {
        format: 'html'
      }
    }
  },
  {
    name: '列表测试',
    config: {
      content: [
        { text: '列表测试', style: 'header' },
        { text: '无序列表：', margin: [0, 10, 0, 5] },
        { ul: ['项目一', '项目二', '项目三'] },
        { text: '有序列表：', margin: [0, 20, 0, 5] },
        { ol: ['第一步', '第二步', '第三步'] }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2c3e50',
          margin: [0, 0, 0, 20]
        }
      },
      output: {
        format: 'html'
      }
    }
  },
  {
    name: '复杂文档测试',
    config: {
      content: [
        { text: '复杂文档测试', style: 'header' },
        { text: '这是一个包含多种元素的复杂文档测试。', margin: [0, 10, 0, 0] },
        { text: '包含标题、段落、列表和表格等多种元素。', margin: [0, 10, 0, 20] },
        { text: '功能特点：', style: 'subheader' },
        { ul: [
          '支持多种文档元素',
          '可自定义样式',
          '支持表格和列表',
          '响应式布局'
        ] },
        { text: '技术栈对比：', style: 'subheader', margin: [0, 20, 0, 10] },
        {
          table: {
            body: [
              ['技术', '优点', '缺点'],
              ['HTML', '简单易用', '样式有限'],
              ['PDF', '格式固定', '不易编辑'],
              ['DOCX', '可编辑', '依赖 Office']
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#2c3e50',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: '#34495e',
          margin: [0, 0, 0, 10]
        }
      },
      output: {
        format: 'html'
      }
    }
  }
];

async function runTests() {
  console.log('🚀 开始运行 JSON2Docs 基础功能测试...\n');

  const json2docs = new Json2Docs();
  const results = [];

  for (const test of testConfigs) {
    console.log(`📝 测试：${test.name}`);

    try {
      const result = await json2docs.generate(test.config);

      if (result.success) {
        console.log(`✅ 成功：${test.name}`);
        results.push({
          name: test.name,
          success: true,
          content: result.content
        });

        // 保存测试结果
        const outputDir = path.join(process.cwd(), 'test-output');
        await fs.ensureDir(outputDir);

        const filename = `${test.name.replace(/\s+/g, '-')}.html`;
        const filepath = path.join(outputDir, filename);

        await fs.writeFile(filepath, result.content, 'utf-8');
        console.log(`📁 输出文件：${filepath}`);

      } else {
        console.log(`❌ 失败：${test.name} - ${result.error}`);
        results.push({
          name: test.name,
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      console.log(`❌ 错误：${test.name} - ${error.message}`);
      results.push({
        name: test.name,
        success: false,
        error: error.message
      });
    }

    console.log('');
  }

  // 输出测试总结
  console.log('📊 测试总结：');
  console.log('='.repeat(50));

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  console.log(`总测试数：${totalCount}`);
  console.log(`成功：${successCount}`);
  console.log(`失败：${totalCount - successCount}`);
  console.log(`成功率：${((successCount / totalCount) * 100).toFixed(1)}%`);

  console.log('\n详细结果：');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (!result.success) {
      console.log(`   错误：${result.error}`);
    }
  });

  console.log('\n🎉 基础功能测试完成！');

  if (successCount === totalCount) {
    console.log('🎊 所有测试都通过了！');
    process.exit(0);
  } else {
    console.log('⚠️  部分测试失败，请检查错误信息。');
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  console.error('💥 测试运行失败：', error);
  process.exit(1);
});