import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/test/views/index'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '',
      name: 'test',
      component: () => import('@/pages/test/views/index')
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/pages/test/views/ranking')
    },
    {
      path: '/paper',
      name: 'paper',
      component: () => import('@/pages/test/views/paper')
    }
  ]
})
