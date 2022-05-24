import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout'
import { loadTree } from "../api/manager/menu";

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
    path: '/test',
    component: Layout,
    redirect: '/test/index',
    name: 'test',
    meta: { title: '考试管理', icon: 'test', roles: 3 },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('../views/test/index'),
        meta: { title: '试卷列表', icon: 'test-paper', roles: 3 }
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('../views/test/detail'),
        meta: { title: '试卷编制', icon: 'test-detail', keepAlive: false, roles: 1 }
      },
      {
        path: 'link',
        name: 'link',
        component: () => import('../views/test/link'),
        meta: { title: '链接与二维码' },
        hidden: true
      },
      {
        path: 'result',
        name: 'result',
        component: () => import('../views/test/result'),
        meta: { title: '下载成绩' },
        hidden: true
      },
      {
        path: 'ranking',
        name: 'ranking',
        component: () => import('../views/test/ranking'),
        meta: { title: '考试排名' },
        hidden: true
      }
    ]
  },
  {
    path: '/manager',
    component: Layout,
    redirect: '/manager/enterprise',
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
        path: 'business',
        name: 'business',
        component: () => import('../views/manager/business/index'),
        meta: { title: '业态管理', icon: 'form', roles: 4 }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('../views/manager/role/index'),
        meta: { title: '角色管理', icon: 'role', roles: 4 }
      },
      {
        path: 'position',
        name: 'position',
        component: () => import('../views/manager/position/index'),
        meta: { title: '岗位管理', icon: 'position', roles: 4 }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../views/manager/user/index'),
        meta: { title: '用户管理', icon: 'user', roles: 4 }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('../views/manager/menu/index'),
        meta: { title: '菜单管理', icon: 'menu', roles: 4 }
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('../views/manager/dictionary/index'),
        meta: { title: '字典管理', icon: 'form', roles: 4 }
      }
    ]
  }
  , { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'hash',
  loadTree: [],
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
