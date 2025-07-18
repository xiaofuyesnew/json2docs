<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'error',
    validator: value => ['error', 'warning', 'info', 'success'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: [String, Array],
    required: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['close'])

const typeClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-50 border border-red-200'
    case 'warning':
      return 'bg-yellow-50 border border-yellow-200'
    case 'info':
      return 'bg-blue-50 border border-blue-200'
    case 'success':
      return 'bg-green-50 border border-green-200'
    default:
      return 'bg-gray-50 border border-gray-200'
  }
})

const textClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'text-red-700'
    case 'warning':
      return 'text-yellow-700'
    case 'info':
      return 'text-blue-700'
    case 'success':
      return 'text-green-700'
    default:
      return 'text-gray-700'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'i-carbon-error-filled text-red-400 h-5 w-5'
    case 'warning':
      return 'i-carbon-warning-filled text-yellow-400 h-5 w-5'
    case 'info':
      return 'i-carbon-information-filled text-blue-400 h-5 w-5'
    case 'success':
      return 'i-carbon-checkmark-filled text-green-400 h-5 w-5'
    default:
      return 'i-carbon-information h-5 w-5'
  }
})

const buttonClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
    case 'warning':
      return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50'
    case 'info':
      return 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
    case 'success':
      return 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
    default:
      return 'bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-gray-600 focus:ring-offset-gray-50'
  }
})
</script>

<template>
  <div
    v-if="show"
    class="error-message mb-4 rounded-md p-3"
    :class="typeClass"
  >
    <div class="flex items-start">
      <div class="mt-0.5 flex-shrink-0">
        <div :class="iconClass" />
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium" :class="textClass">
          {{ title }}
        </h3>
        <div class="text-sm" :class="textClass">
          <p v-if="typeof message === 'string'">
            {{ message }}
          </p>
          <ul v-else-if="Array.isArray(message)" class="list-disc pl-5 space-y-1">
            <li v-for="(item, index) in message" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="buttonClass"
            @click="$emit('close')"
          >
            <span class="sr-only">关闭</span>
            <div class="i-carbon-close h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
