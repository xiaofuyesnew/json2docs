import { defineComponent } from 'vue';
import { BaseGenerator } from '@json2docs/core';

export default defineComponent({
  name: 'VueRenderer',
  props: {
    document: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localDocument: this.document
    };
  },
  watch: {
    document: {
      handler(newDoc) {
        this.localDocument = newDoc;
      },
      deep: true
    }
  },
  methods: {
    renderContentItem(item) {
      switch (item.type) {
        case 'text':
          return this.$createElement('p', item.content);
        case 'heading':
          return this.$createElement('h2', item.content);
        case 'list':
          return this.$createElement('ul',
            item.items?.map(listItem =>
              this.$createElement('li', listItem)
            )
          );
        default:
          return this.$createElement('div', item.content);
      }
    }
  },
  render() {
    const { localDocument } = this;

    if (!localDocument || !localDocument.metadata) {
      return this.$createElement('div', 'No document provided');
    }

    return this.$createElement('div', {
      class: 'json2docs-vue-renderer'
    }, [
      this.$createElement('h1', localDocument.metadata.title || 'Document'),
      this.$createElement('div', {
        class: 'content'
      }, localDocument.content?.map((item, index) =>
        this.$createElement('div', {
          key: index,
          class: 'content-item'
        }, [this.renderContentItem(item)])
      ))
    ]);
  }
});