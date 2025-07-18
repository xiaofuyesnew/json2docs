<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },
  message: {
    type: String,
    default: '',
  },
  overlay: {
    type: Boolean,
    default: false,
  },
})

const spinnerClass = computed(() => {
  const baseClass = 'i-svg-spinners-180-ring-with-bg text-blue-600'

  switch (props.size) {
    case 'sm':
      return `${baseClass} h-4 w-4`
    case 'lg':
      return `${baseClass} h-8 w-8`
    default:
      return `${baseClass} h-6 w-6`
  }
})
</script>

<template>
  <div class="loading-indicator">
    <div v-if="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
        <div :class="spinnerClass" />
        <div v-if="message" class="mt-4 text-gray-700">
          {{ message }}
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center">
      <div :class="spinnerClass" />
      <div v-if="message" class="ml-3 text-gray-700">
        {{ message }}
      </div>
    </div>
  </div>
</template>
