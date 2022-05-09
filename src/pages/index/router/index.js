import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/pages/index/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/pages/index/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/pages/index/views/home/index'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'pwd',
        name: 'pwd',
        component: () => import('@/pages/index/views/home/pwd'),
        meta: { title: '修改登录密码' },
        hidden: true
      }
    ]
  }
]

export const asyncRouterMap = [ 
  {
    path:'/manager',
    component: Layout,
    redirect: '/manager/user',
    name: 'manager',
    meta: { title: '系统管理', icon: 'manager', roles: 1028 },
    children: [
      {
        path: 'enterprise',
        name: 'enterprise',
        component: () => import('../views/manager/enterprise/index'),
        meta: { title: '企业管理', icon: 'enterprise', roles: 1024 }
      },
      {
        path: 'org',
        name: 'org',
        component: () => import('../views/manager/org/index'),
        meta: { title: '单位管理', icon: 'org', roles: 1024 }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../views/manager/user/index'),
        meta: { title: '用户管理', icon: 'user', roles: 4 }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('../views/manager/role/index'),
        meta: { title: '角色管理', icon: 'role', roles: 4 }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('../views/manager/menu/index'),
        meta: { title: '菜单管理', icon: 'test', roles: 4 }
      },
      {
        path: 'position',
        name: 'position',
        component: () => import('../views/manager/position/index'),
        meta: { title: '岗位管理', icon: 'form', roles: 4 }
      },
      {
        path: 'businesstype',
        name: 'businesstype',
        component: () => import('../views/manager/businesstype/index'),
        meta: { title: '业态管理', icon: 'form', roles: 4 }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode : 'hash',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
