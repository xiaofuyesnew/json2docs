/**
 * 文档样式模型
 */

export class StylesModel {
  /**
   * 创建样式模型
   * @param {object} data - 样式数据
   */
  constructor(data = {}) {
    // 字体设置
    this.fonts = data.fonts || {
      default: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      monospace: 'Courier New, monospace',
    }

    // 颜色设置
    this.colors = data.colors || {
      text: '#333333',
      background: '#ffffff',
      heading: '#000000',
      link: '#0066cc',
    }

    // 尺寸设置
    this.sizes = data.sizes || {
      baseFontSize: '16px',
      h1: '2em',
      h2: '1.5em',
      h3: '1.17em',
      h4: '1em',
      h5: '0.83em',
      h6: '0.67em',
    }

    // 间距设置
    this.spacing = data.spacing || {
      lineHeight: 1.5,
      paragraphSpacing: '1em',
      listItemSpacing: '0.5em',
    }

    // 保留其他自定义样式
    Object.keys(data).forEach((key) => {
      if (!['fonts', 'colors', 'sizes', 'spacing'].includes(key)) {
        this[key] = data[key]
      }
    })
  }
}
