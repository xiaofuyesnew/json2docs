import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/converter',
    name: 'Converter',
    component: () => import('../views/Converter.vue'),
    meta: {
      title: '转换器',
    },
  },
  {
    path: '/examples',
    name: 'Examples',
    component: () => import(/* webpackChunkName: "examples" */ '../views/Examples.vue'),
    meta: {
      title: '示例',
    },
  },
  {
    path: '/docs',
    name: 'Docs',
    component: () => import(/* webpackChunkName: "docs" */ '../views/Docs.vue'),
    meta: {
      title: '文档',
    },
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import(/* webpackChunkName: "guide" */ '../views/Guide.vue'),
    meta: {
      title: '使用指南',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else {
      return { top: 0 }
    }
  },
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - JSON2Docs` : 'JSON2Docs'
  next()
})

export default router
