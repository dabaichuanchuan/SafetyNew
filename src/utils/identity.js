import axios from 'axios'
import { Message } from 'element-ui'
import { setToken, getToken } from '@/utils/token'

const config = {
  client_id: 'web.test.admin',
  client_secret: '123456'
}

const request = axios.create({
  baseURL: process.env.AUTH_URL,
  timeout: 1000 * 60 * 2
})

request.interceptors.request.use(config => {
  return config
}, error => console.error(error))

request.interceptors.response.use(
  response => {
    return response.data
  },
  errors => {
    let message
    if(errors.response && errors.response.data) {
      let { error, error_description } = errors.response.data
      message = error_description || error;
    }
    Message({
      message: message || '认证返回未知错误',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(errors)
  }
)

export function login(account, password) {
  return new Promise((resolve, reject) => {
    const data = Object.assign(config, {
      username: account,
      password: password,
      grant_type: 'password'
    })
    let params = new URLSearchParams()
    Object.keys(data).forEach(key => params.append(key, data[key]))
    request({
      url: '/connect/token',
      method: 'post',
      data: params
    }).then(res => {
      setToken(res)
      resolve(res)
    }).catch(reject)
  })
}

export function refresh() {
  return new Promise((resolve, reject) => {
    const data = Object.assign(config, {
      refresh_token: getToken().refresh_token,
      grant_type: 'refresh_token'
    })
    let params = new URLSearchParams()
    Object.keys(data).forEach(key => params.append(key, data[key]))
    request({
      url: '/connect/token',
      method: 'post',
      data: params
    }).then(res => {
      setToken(res)
      resolve(res)
    }).catch(reject)
  })
}