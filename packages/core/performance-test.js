import { Json2Docs } from './src/index.js';

// 性能测试配置
const performanceConfig = {
  content: Array.from({ length: 100 }, (_, i) => ({
    text: `这是第 ${i + 1} 个测试段落，用于测试性能表现。`,
    style: i % 3 === 0 ? 'title' : i % 3 === 1 ? 'subtitle' : 'normal',
    margin: [0, 5, 0, 0]
  })),
  styles: {
    title: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    subtitle: {
      fontSize: 14,
      bold: true,
      color: '#34495e'
    },
    normal: {
      fontSize: 12,
      color: '#2c3e50'
    }
  },
  output: {
    format: 'html'
  }
};

// 性能测试函数
async function performanceTest() {
  console.log('🚀 开始性能测试...\n');

  const json2docs = new Json2Docs();

  try {
    // 测试样式缓存性能
    console.log('💾 测试样式缓存性能...');

    const iterations = 1000;
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      json2docs.buildStyleMap(performanceConfig.styles);
      const endTime = performance.now();
      totalTime += (endTime - startTime);
    }

    const avgTime = totalTime / iterations;
    console.log(`平均样式映射构建时间: ${avgTime.toFixed(3)}ms`);
    console.log(`总时间: ${totalTime.toFixed(2)}ms (${iterations} 次迭代)`);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试文档生成性能
    console.log('📄 测试文档生成性能...');

    const generateStartTime = performance.now();
    const result = await json2docs.generate(performanceConfig);
    const generateEndTime = performance.now();

    const generateTime = generateEndTime - generateStartTime;
    console.log(`文档生成时间: ${generateTime.toFixed(2)}ms`);
    console.log(`生成的内容长度: ${result.content.length} 字符`);
    console.log(`内容项数量: ${performanceConfig.content.length}`);
    console.log(`平均每项处理时间: ${(generateTime / performanceConfig.content.length).toFixed(3)}ms`);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试内存使用
    console.log('🧠 测试内存使用...');

    const memoryUsage = process.memoryUsage();
    console.log('内存使用情况:');
    console.log(`  RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试并发性能
    console.log('⚡ 测试并发性能...');

    const concurrentTests = 10;
    const concurrentStartTime = performance.now();

    const promises = Array.from({ length: concurrentTests }, () =>
      json2docs.generate(performanceConfig)
    );

    const concurrentResults = await Promise.all(promises);
    const concurrentEndTime = performance.now();

    const concurrentTime = concurrentEndTime - concurrentStartTime;
    console.log(`并发测试时间: ${concurrentTime.toFixed(2)}ms`);
    console.log(`并发数量: ${concurrentTests}`);
    console.log(`平均每个请求时间: ${(concurrentTime / concurrentTests).toFixed(2)}ms`);
    console.log(`成功请求数: ${concurrentResults.filter(r => r.success).length}`);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试大文档性能
    console.log('📚 测试大文档性能...');

    const largeConfig = {
      ...performanceConfig,
      content: Array.from({ length: 1000 }, (_, i) => ({
        text: `大文档第 ${i + 1} 段内容，包含更多的文本内容用于测试大文档的处理性能。`,
        style: i % 5 === 0 ? 'title' : i % 5 === 1 ? 'subtitle' : 'normal',
        margin: [0, 3, 0, 0]
      }))
    };

    const largeStartTime = performance.now();
    const largeResult = await json2docs.generate(largeConfig);
    const largeEndTime = performance.now();

    const largeTime = largeEndTime - largeStartTime;
    console.log(`大文档生成时间: ${largeTime.toFixed(2)}ms`);
    console.log(`大文档内容长度: ${largeResult.content.length} 字符`);
    console.log(`大文档内容项数量: ${largeConfig.content.length}`);
    console.log(`大文档平均每项处理时间: ${(largeTime / largeConfig.content.length).toFixed(3)}ms`);

    console.log('\n🎉 性能测试完成！');

  } catch (error) {
    console.error('❌ 性能测试过程中发生错误:', error);
  }
}

// 运行性能测试
performanceTest();