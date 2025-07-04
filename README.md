# JSON2Docs - 结构化数据转换库

一个强大的npm库，用于将结构化JSON数据转换为多种格式（PDF、DOCX、HTML DOM），并提供Vue和React组件封装，让您可以在前端应用中直接渲染JSON数据。

## 项目概述

JSON2Docs 是一个强大的文档转换库，它提供：

### 核心功能

- **JSON转换引擎** - 将结构化JSON转换为多种格式
- **PDF生成** - 生成PDF文档
- **DOCX生成** - 生成Word文档
- **HTML生成** - 生成HTML DOM

### 前端组件

- **Vue组件** - 在Vue应用中直接渲染JSON数据
- **React组件** - 在React应用中直接渲染JSON数据

## 开发计划

### 阶段1：项目基础架构 ✅

- [x] 项目初始化
- [x] 设置项目结构
- [x] 配置开发环境
- [x] 创建基础配置文件
- [x] 定义JSON Schema设计
- [x] 设计文档模板格式
- [x] 创建示例数据
- [x] 创建核心生成器基类
- [x] 实现HTML DOM生成器

### 阶段2：核心转换引擎 🔄

- [x] HTML DOM生成器
  - [x] 实现JSON到HTML的转换
  - [x] 支持样式和布局
  - [x] 创建可配置的模板系统
- [ ] PDF生成器
  - [ ] 集成PDF生成库（如Puppeteer或jsPDF）
  - [ ] 实现HTML到PDF的转换
  - [ ] 支持页面布局和样式
- [ ] DOCX生成器
  - [ ] 集成DOCX生成库（如docx.js）
  - [ ] 实现JSON到DOCX的转换
  - [ ] 支持文档格式和样式

### 阶段3：前端组件生成 📋

- [ ] Vue SFC生成器
  - [ ] 生成Vue单文件组件
  - [ ] 支持响应式数据绑定
  - [ ] 实现组件样式和交互
- [ ] React组件生成器
  - [ ] 生成React函数组件
  - [ ] 支持Hooks和状态管理
  - [ ] 实现组件样式和交互

### 阶段4：工具和优化 📋

- [ ] CLI工具开发
  - [ ] 创建命令行接口
  - [ ] 支持批量转换
  - [ ] 添加配置选项
- [ ] 测试和文档
  - [ ] 编写单元测试
  - [ ] 创建API文档
  - [ ] 添加使用示例

## 当前任务

### 已完成 ✅

- 项目基础架构搭建
- HTML DOM生成器开发
- 示例文档生成测试

### 下一步

- PDF生成器开发

## 技术栈

- **Node.js** - 运行时环境
- **TypeScript** - 开发语言
- **Puppeteer/jsPDF** - PDF生成
- **docx.js** - DOCX生成
- **Vue 3** - Vue组件生成
- **React 18** - React组件生成

## 项目结构

```shell
json2docs/
├── src/
│   ├── core/           # 核心转换引擎
│   ├── generators/     # 各种格式生成器
│   ├── templates/      # 模板文件
│   └── utils/          # 工具函数
├── examples/           # 示例数据
├── tests/              # 测试文件
├── docs/               # 文档
└── dist/               # 构建输出
```

## 使用方法

待开发完成后补充...

## 贡献指南

待开发完成后补充...

## 许可证

MIT License

## 主要目标

- [ ] 核心 npm 库：结构化 JSON 转换为 PDF、DOCX、HTML
- [ ] Vue 组件：封装核心库，支持 JSON 渲染
- [ ] React 组件：封装核心库，支持 JSON 渲染

## 详细计划

### 1. 核心库

- [x] 设计 JSON Schema
- [x] 实现 toHtml(json)
- [x] 实现 toPdf(json)
- [ ] 实现 toDocx(json)
- [ ] 单元测试

### 2. Vue 组件

- [ ] Vue3 SFC，props: json
- [ ] 响应式渲染
- [ ] 支持主题/样式扩展

### 3. React 组件

- [ ] React18 FC，props: json
- [ ] 响应式渲染
- [ ] 支持主题/样式扩展

### 4. 文档与示例

- [ ] 用法文档
- [ ] 组件用例
