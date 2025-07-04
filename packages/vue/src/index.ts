import { generate, GenerateOptions, GenerateResult } from '@json2docs/core';
import { defineComponent, PropType, h } from 'vue';

export { generate, GenerateOptions, GenerateResult };

export default defineComponent({
  name: 'Json2DocsVueRenderer',
  props: {
    json: { type: Object as PropType<any>, required: true },
    options: { type: Object as PropType<GenerateOptions>, required: true }
  },
  setup(props) {
    // 这里只做结构示例，具体实现可后续完善
    const result = generate(props.json, props.options);
    return () => props.options.format === 'html'
      ? h('div', { innerHTML: result.data })
      : h('div', '暂不支持该格式的预览');
  }
});