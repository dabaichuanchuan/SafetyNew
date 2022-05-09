import Vue from 'vue'
import { login } from '@/utils/identity'
import { access, logout } from '@/api/client'
import { removeToken } from '@/utils/token'

function principal(roles) {
	this.roles = roles
	this.in = function (role) {
		return (this.roles & role) > 0
	},
	this.all = function (roles) {
		return (this.roles & roles) == roles
	},
	this.nin = function(role) {
		return !(this.roles & role)
	}
}

const user = {
  state: {
    account: '',
    avatar: '',
    detail: {},
    roles: [],
    principal: {}
  },

  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_DETAIL: (state, detail) => {
      Vue.set(state, 'detail', detail)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      Vue.set(state, 'roles', roles)
      Vue.set(state, 'principal', new principal(roles))
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const account = userInfo.account.trim()
      return login(account, userInfo.password)
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        access().then(res => {
          const data = res.data
          if (data && data.account) {
            commit('SET_ROLES', data.roles)
            commit('SET_ACCOUNT', data.account)
            commit('SET_AVATAR', data.avatar)
            commit('SET_DETAIL', data)
            resolve(data)
          } else {
            reject('获取用户信息错误!')
          }
        }).catch(reject)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return logout().catch(() => {}).then(() => {
        commit('SET_ACCOUNT', '')
        commit('SET_ROLES', [])
        removeToken()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_ACCOUNT', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user