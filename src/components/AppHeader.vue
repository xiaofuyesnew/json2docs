<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const navItems = [
  { name: '首页', path: '/', exact: true },
  { name: '转换器', path: '/converter', exact: false },
  { name: '使用指南', path: '/guide', exact: false },
  { name: '示例', path: '/examples', exact: false },
  { name: '文档', path: '/docs', exact: false },
]
</script>

<template>
  <header class="app-header border-b bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 lg:px-8 sm:px-6">
      <div class="flex items-center justify-between py-4">
        <router-link to="/" class="flex items-center gap-2">
          <div class="i-carbon-document-pdf text-2xl text-blue-600" />
          <h1 class="text-2xl text-gray-900 font-bold">
            JSON2Docs
          </h1>
        </router-link>

        <!-- 桌面导航 -->
        <nav class="hidden gap-6 md:flex">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-600 font-medium hover:text-blue-600"
            active-class="text-blue-600"
            :exact="item.exact"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button
          class="text-gray-600 md:hidden hover:text-blue-600"
          @click="isMenuOpen = !isMenuOpen"
        >
          <div v-if="isMenuOpen" class="i-carbon-close text-xl" />
          <div v-else class="i-carbon-menu text-xl" />
        </button>
      </div>

      <!-- 移动端导航菜单 -->
      <div
        v-if="isMenuOpen"
        class="border-t py-4 md:hidden"
      >
        <div class="flex flex-col space-y-3">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="py-2 text-gray-600 font-medium hover:text-blue-600"
            active-class="text-blue-600"
            :exact="item.exact"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>
