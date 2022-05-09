import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { existsToken } from '@/utils/token'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (existsToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 如果已登录还请求登录页面，转发到首页
    } else {
      if (!store.getters.account) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          store.dispatch('GenerateRoutes', store.getters.roles).then(() => { // 生成可访问的路由表
            store.getters.addRouters.forEach(r => router.addRoute(r)); // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败，请重新登录！')
            next({ path: '/login' })
            NProgress.done()
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})