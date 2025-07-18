<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  itemHeight: {
    type: Number,
    default: 50,
  },
  containerHeight: {
    type: Number,
    default: 400,
  },
  buffer: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['scroll'])

const containerRef = ref(null)
const scrollTop = ref(0)
const containerScrollHeight = ref(0)

// Calculate visible range
const visibleRange = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight)
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight)
  const end = start + visibleCount

  return {
    start: Math.max(0, start - props.buffer),
    end: Math.min(props.items.length, end + props.buffer),
  }
})

// Calculate visible items
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return props.items.slice(start, end).map((item, index) => ({
    ...item,
    index: start + index,
    top: (start + index) * props.itemHeight,
  }))
})

// Calculate total height
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Calculate offset for visible items
const offsetY = computed(() => visibleRange.value.start * props.itemHeight)

// Handle scroll
function handleScroll(event) {
  scrollTop.value = event.target.scrollTop
  emit('scroll', {
    scrollTop: scrollTop.value,
    visibleRange: visibleRange.value,
  })
}

// Scroll to specific item
function scrollToItem(index) {
  if (containerRef.value) {
    const targetScrollTop = index * props.itemHeight
    containerRef.value.scrollTop = targetScrollTop
    scrollTop.value = targetScrollTop
  }
}

// Update container scroll height
function updateScrollHeight() {
  if (containerRef.value) {
    containerScrollHeight.value = containerRef.value.scrollHeight
  }
}

// Watch for items changes
watch(() => props.items.length, () => {
  nextTick(updateScrollHeight)
})

onMounted(() => {
  updateScrollHeight()
})

// Expose methods
defineExpose({
  scrollToItem,
  scrollTop: () => scrollTop.value,
  visibleRange: () => visibleRange.value,
})
</script>

<template>
  <div
    ref="containerRef"
    class="virtual-scroll-container"
    :style="{ height: `${containerHeight}px`, overflow: 'auto' }"
    @scroll="handleScroll"
  >
    <!-- Spacer for total height -->
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <!-- Visible items container -->
      <div
        class="virtual-scroll-items"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="item in visibleItems"
          :key="item.index"
          class="virtual-scroll-item"
          :style="{
            height: `${itemHeight}px`,
            position: 'absolute',
            top: `${item.top - offsetY}px`,
            left: 0,
            right: 0,
          }"
        >
          <slot :item="item" :index="item.index">
            <!-- Default item rendering -->
            <div class="flex items-center px-4 py-2">
              {{ item }}
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Loading indicator for large lists -->
    <div
      v-if="items.length > 1000"
      class="virtual-scroll-info"
      style="position: sticky; bottom: 0; background: rgba(0,0,0,0.1); padding: 4px 8px; font-size: 12px; color: #666;"
    >
      显示 {{ visibleRange.start + 1 }}-{{ Math.min(visibleRange.end, items.length) }} / {{ items.length }} 项
      (虚拟滚动已启用)
    </div>
  </div>
</template>

<style scoped>
.virtual-scroll-container {
  position: relative;
}

.virtual-scroll-items {
  position: relative;
}

.virtual-scroll-item {
  box-sizing: border-box;
}

/* Smooth scrolling */
.virtual-scroll-container {
  scroll-behavior: smooth;
}

/* Custom scrollbar for better UX */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
