<script setup>
// 使用setup语法糖
</script>

<template>
  <div class="py-12 text-center">
    <div class="mb-4 text-6xl text-gray-300 font-bold">
      404
    </div>
    <h2 class="mb-4 text-2xl text-gray-900 font-bold">
      页面未找到
    </h2>
    <p class="mb-8 text-gray-600">
      您访问的页面不存在或已被移除。
    </p>
    <router-link to="/" class="btn btn-primary">
      返回首页
    </router-link>
  </div>
</template>
