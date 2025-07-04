#!/usr/bin/env node

import { Json2Docs, Document, GeneratorConfig } from './index';
import * as fs from 'fs-extra';
import * as path from 'path';

interface CliOptions {
  input: string;
  output: string;
  format: 'html' | 'pdf' | 'docx' | 'vue' | 'react';
  template?: string;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  try {
    const options = parseArgs(args);
    await generateDocument(options);
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
JSON2Docs - 结构化数据转换工具

用法:
  json2docs <input> [options]

参数:
  <input>    输入的JSON文件路径

选项:
  -o, --output <path>    输出文件路径
  -f, --format <format>  输出格式 (html|pdf|docx|vue|react) [默认: html]
  -t, --template <path>  模板文件路径
  -h, --help             显示帮助信息

示例:
  json2docs data.json -o output.html -f html
  json2docs data.json -o output.pdf -f pdf
  json2docs data.json -o component.vue -f vue
`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    input: '',
    output: '',
    format: 'html'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '-f':
      case '--format':
        const format = args[++i];
        if (!['html', 'pdf', 'docx', 'vue', 'react'].includes(format)) {
          throw new Error(`不支持的格式: ${format}`);
        }
        options.format = format as any;
        break;
      case '-t':
      case '--template':
        options.template = args[++i];
        break;
      default:
        if (!options.input) {
          options.input = arg;
        } else {
          throw new Error(`未知参数: ${arg}`);
        }
    }
  }

  if (!options.input) {
    throw new Error('请指定输入文件');
  }

  if (!options.output) {
    // 自动生成输出文件名
    const inputName = path.basename(options.input, path.extname(options.input));
    options.output = `./output/${inputName}.${options.format}`;
  }

  return options;
}

async function generateDocument(options: CliOptions) {
  console.log('正在读取输入文件...');

  // 读取JSON文件
  if (!await fs.pathExists(options.input)) {
    throw new Error(`输入文件不存在: ${options.input}`);
  }

  const jsonContent = await fs.readFile(options.input, 'utf-8');
  let document: Document;

  try {
    document = JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(`JSON解析失败: ${error.message}`);
  }

  // 验证文档结构
  if (!document.metadata || !document.metadata.title) {
    throw new Error('文档缺少必需的metadata.title字段');
  }

  if (!document.content || !Array.isArray(document.content)) {
    throw new Error('文档缺少必需的content数组字段');
  }

  console.log(`文档标题: ${document.metadata.title}`);
  console.log(`输出格式: ${options.format}`);
  console.log(`输出路径: ${options.output}`);

  // 创建生成器配置
  const config: GeneratorConfig = {
    outputFormat: options.format,
    outputPath: options.output,
    template: options.template
  };

  // 生成文档
  console.log('正在生成文档...');
  const json2docs = new Json2Docs();
  const result = await json2docs.generate(document, config);

  if (result.success) {
    console.log(`✅ 文档生成成功: ${result.outputPath}`);
  } else {
    throw new Error(`文档生成失败: ${result.error}`);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(error => {
    console.error('程序执行失败:', error.message);
    process.exit(1);
  });
}