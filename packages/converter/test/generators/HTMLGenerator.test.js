/**
 * HTMLGenerator类的单元测试
 */

import { describe, expect, it } from 'vitest'

import { DocumentConverterError } from '../../src/core/errors.js'
import { HTMLGenerator } from '../../src/generators/HTMLGenerator.js'
import { DocumentModel } from '../../src/models/DocumentModel.js'

describe('hTMLGenerator', () => {
  describe('构造函数', () => {
    it('应该使用默认选项创建实例', () => {
      const generator = new HTMLGenerator()

      expect(generator).toBeInstanceOf(HTMLGenerator)
      expect(generator.options).toEqual({
        fullDocument: true,
        inlineStyles: true,
        prettyPrint: false,
        classPrefix: 'json-doc-',
      })
    })

    it('应该使用自定义选项创建实例', () => {
      const options = {
        fullDocument: false,
        inlineStyles: false,
        prettyPrint: true,
        classPrefix: 'custom-',
      }
      const generator = new HTMLGenerator(options)

      expect(generator.options).toEqual(options)
    })

    it('应该合并默认选项和自定义选项', () => {
      const options = { fullDocument: false }
      const generator = new HTMLGenerator(options)

      expect(generator.options).toEqual({
        fullDocument: false,
        inlineStyles: true,
        prettyPrint: false,
        classPrefix: 'json-doc-',
      })
    })
  })

  describe('generate', () => {
    it('应该生成完整的HTML文档', async () => {
      const generator = new HTMLGenerator()
      const documentData = new DocumentModel({
        metadata: {
          title: 'Test Document',
          author: 'Test Author',
          description: 'Test Description',
        },
        content: [
          {
            type: 'heading',
            level: 1,
            text: 'Hello World',
          },
          {
            type: 'paragraph',
            text: 'This is a test paragraph.',
          },
        ],
      })

      const result = await generator.generate(documentData)

      expect(result.format).toBe('html')
      expect(result.data).toContain('<!DOCTYPE html>')
      expect(result.data).toContain('<title>Test Document</title>')
      expect(result.data).toContain('<meta name="author" content="Test Author">')
      expect(result.data).toContain('<h1 class="json-doc-heading json-doc-h1">Hello World</h1>')
      expect(result.data).toContain('<p class="json-doc-paragraph json-doc-align-left">This is a test paragraph.</p>')
    })

    it('应该生成HTML片段', async () => {
      const generator = new HTMLGenerator({ fullDocument: false })
      const documentData = new DocumentModel({
        content: [
          {
            type: 'heading',
            level: 2,
            text: 'Test Heading',
          },
        ],
      })

      const result = await generator.generate(documentData)

      expect(result.format).toBe('html')
      expect(result.data).not.toContain('<!DOCTYPE html>')
      expect(result.data).toContain('<h2 class="json-doc-heading json-doc-h2">Test Heading</h2>')
    })

    it('应该处理无效的文档数据', async () => {
      const generator = new HTMLGenerator()

      await expect(generator.generate()).rejects.toThrow(DocumentConverterError)
    })

    it('应该使用自定义类前缀', async () => {
      const generator = new HTMLGenerator({ classPrefix: 'custom-' })
      const documentData = new DocumentModel({
        content: [
          {
            type: 'paragraph',
            text: 'Custom class test.',
          },
        ],
      })

      const result = await generator.generate(documentData)

      expect(result.data).toContain('class="custom-paragraph custom-align-left"')
    })
  })

  describe('renderContentBlock', () => {
    it('应该渲染标题块', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'heading',
        level: 3,
        text: 'Test Heading',
        id: 'test-id',
      }

      const html = generator.renderContentBlock(block, { classPrefix: 'json-doc-' })

      expect(html).toContain('<h3 id="test-id" class="json-doc-heading json-doc-h3">Test Heading</h3>')
    })

    it('应该渲染段落块', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'paragraph',
        text: 'Test paragraph with **bold** and *italic*.',
        alignment: 'center',
      }

      const html = generator.renderContentBlock(block, { classPrefix: 'json-doc-' })

      expect(html).toContain('<p class="json-doc-paragraph json-doc-align-center">')
      expect(html).toContain('Test paragraph with <strong>bold</strong> and <em>italic</em>.')
    })

    it('应该渲染无序列表块', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'list',
        listType: 'unordered',
        items: [
          'Item 1',
          { text: 'Item 2', level: 1 },
          'Item 3',
        ],
      }

      const html = generator.renderContentBlock(block, { classPrefix: 'json-doc-' })

      expect(html).toContain('<ul class="json-doc-list json-doc-unordered-list">')
      expect(html).toContain('<li class="json-doc-list-item">Item 1</li>')
      expect(html).toContain('<li class="json-doc-list-item" style="margin-left: 20px;">Item 2</li>')
      expect(html).toContain('<li class="json-doc-list-item">Item 3</li>')
    })

    it('应该渲染有序列表块', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'list',
        listType: 'ordered',
        items: ['Item 1', 'Item 2'],
      }

      const html = generator.renderContentBlock(block, { classPrefix: 'json-doc-' })

      expect(html).toContain('<ol class="json-doc-list json-doc-ordered-list">')
    })

    it('应该渲染表格块', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'table',
        headers: ['Name', 'Age'],
        rows: [
          ['Alice', '30'],
          ['Bob', '25'],
        ],
      }

      const html = generator.renderContentBlock(block, { classPrefix: 'json-doc-' })

      expect(html).toContain('<table class="json-doc-table">')
      expect(html).toContain('<th class="json-doc-table-header">Name</th>')
      expect(html).toContain('<td class="json-doc-table-cell">Alice</td>')
      expect(html).toContain('<td class="json-doc-table-cell">25</td>')
    })

    it('应该渲染图片块', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'image',
        src: 'image.jpg',
        alt: 'Test Image',
        width: 300,
        height: 200,
      }

      const html = generator.renderContentBlock(block, { classPrefix: 'json-doc-' })

      expect(html).toContain('<figure class="json-doc-figure">')
      expect(html).toContain('<img src="image.jpg" alt="Test Image" width="300" height="200" class="json-doc-image">')
      expect(html).toContain('<figcaption class="json-doc-caption">Test Image</figcaption>')
    })

    it('应该处理不支持的内容块类型', () => {
      const generator = new HTMLGenerator()
      const block = {
        type: 'unknown',
      }

      expect(() => generator.renderContentBlock(block, { classPrefix: 'json-doc-' })).toThrow(DocumentConverterError)
    })
  })

  describe('processText', () => {
    it('应该处理Markdown语法', () => {
      const generator = new HTMLGenerator()
      const text = 'Normal **bold** *italic* `code` [link](https://example.com)'

      const processed = generator.processText(text)

      expect(processed).toBe('Normal <strong>bold</strong> <em>italic</em> <code>code</code> <a href="https://example.com">link</a>')
    })

    it('应该转义HTML特殊字符', () => {
      const generator = new HTMLGenerator()
      const text = 'Text with <script> & "quotes" and \'apostrophes\''

      const processed = generator.processText(text)

      expect(processed).toContain('Text with &lt;script&gt; &amp; &quot;quotes&quot; and &#039;apostrophes&#039;')
    })
  })

  describe('escapeHtml', () => {
    it('应该转义HTML特殊字符', () => {
      const generator = new HTMLGenerator()
      const text = '<div>&"\'</div>'

      const escaped = generator.escapeHtml(text)

      expect(escaped).toBe('&lt;div&gt;&amp;&quot;&#039;&lt;/div&gt;')
    })

    it('应该处理空值', () => {
      const generator = new HTMLGenerator()

      expect(generator.escapeHtml()).toBe('')
      expect(generator.escapeHtml(null)).toBe('')
      expect(generator.escapeHtml('')).toBe('')
    })
  })

  describe('generateCssStyles', () => {
    it('应该生成CSS样式', () => {
      const generator = new HTMLGenerator()
      const styles = {
        fonts: {
          default: 'Arial, sans-serif',
          heading: 'Georgia, serif',
        },
        colors: {
          text: '#333',
          background: '#fff',
          heading: '#000',
        },
        sizes: {
          baseFontSize: '16px',
          h1: '2em',
        },
        spacing: {
          lineHeight: 1.5,
          paragraphSpacing: '1em',
        },
      }

      const css = generator.generateCssStyles(styles, { classPrefix: 'json-doc-' })

      expect(css).toContain('font-family: Arial, sans-serif;')
      expect(css).toContain('color: #333;')
      expect(css).toContain('font-size: 16px;')
      expect(css).toContain('.json-doc-h1 { font-size: 2em; }')
    })
  })

  describe('集成测试', () => {
    it('应该正确转换完整的文档', async () => {
      const generator = new HTMLGenerator()
      const documentData = new DocumentModel({
        metadata: {
          title: 'Complete Test Document',
          author: 'Test Author',
          description: 'Test Description',
        },
        content: [
          {
            type: 'heading',
            level: 1,
            text: 'Document Title',
            id: 'title',
          },
          {
            type: 'paragraph',
            text: 'This is an introduction paragraph with **bold** and *italic* text.',
            alignment: 'justify',
          },
          {
            type: 'heading',
            level: 2,
            text: 'Section 1',
          },
          {
            type: 'list',
            listType: 'unordered',
            items: [
              'Item 1',
              { text: 'Item 1.1', level: 1 },
              'Item 2',
            ],
          },
          {
            type: 'table',
            headers: ['Name', 'Value'],
            rows: [
              ['Item A', '100'],
              ['Item B', '200'],
            ],
          },
          {
            type: 'image',
            src: 'test.jpg',
            alt: 'Test Image',
            width: 400,
          },
        ],
        styles: {
          fonts: {
            default: 'Roboto, sans-serif',
            heading: 'Montserrat, sans-serif',
          },
          colors: {
            text: '#444',
            background: '#fafafa',
            heading: '#222',
          },
        },
      })

      const result = await generator.generate(documentData)

      // 验证基本结构
      expect(result.format).toBe('html')
      expect(result.data).toContain('<!DOCTYPE html>')
      expect(result.data).toContain('<title>Complete Test Document</title>')

      // 验证内容
      expect(result.data).toContain('<h1 id="title" class="json-doc-heading json-doc-h1">Document Title</h1>')
      expect(result.data).toContain('<p class="json-doc-paragraph json-doc-align-justify">This is an introduction paragraph with <strong>bold</strong> and <em>italic</em> text.</p>')
      expect(result.data).toContain('<h2 class="json-doc-heading json-doc-h2">Section 1</h2>')
      expect(result.data).toContain('<ul class="json-doc-list json-doc-unordered-list">')
      expect(result.data).toContain('<table class="json-doc-table">')
      expect(result.data).toContain('<img src="test.jpg" alt="Test Image" width="400" class="json-doc-image">')

      // 验证样式
      expect(result.data).toContain('font-family: Roboto, sans-serif;')
      expect(result.data).toContain('color: #444;')
    })
  })
})
