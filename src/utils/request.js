import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { existsToken, getToken } from '@/utils/token'
import { refresh } from '@/utils/identity'

const service = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000 * 60 * 2 //2分钟
})

service.interceptors.request.use(config => {
  if (existsToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken().access_token
  }
  return config
}, errors => Promise.reject(errors))

let refreshing = false
const queue = []

service.interceptors.response.use(
  response => {
    const data = response.data
    if (data && data.hasOwnProperty('code')) {
      if ('-3' == data.code) {
        const conf = response.config
        if (!refreshing) {
          refreshing = true
          return new Promise((resolve, reject) => {
            console.log('开始刷新票证...')
            refresh().then(token => {
              console.log('刷新票证成功')
              queue.forEach(fun => setTimeout(() => fun(token), 1))
              queue.splice(0, queue.length)
              service(conf).then(resolve).catch(reject)
            }).catch(err => {
              MessageBox.alert('登录认证错误，将返回登录页', '认证错误', {
                showClose: false
              }).then(reject)
            }).then(() => refreshing = false)
          })
        } else {
          if(10 < queue.length) {
            Message.error({
              message: '系统正在处理中，请稍后再试',
              duration: 3 * 1000
            })
            return Promise.reject('系统正在处理中，请稍后再试')
          } else {
            console.log('进入请求等待队列', queue.length + 1)
          }
          return new Promise(resolve => {
            queue.push((token) => {
              resolve(service(conf))
            })
          })
        }
      } else if(0 <= data.code) {
        return Promise.resolve(data)
      } else {
        if(data.message) {
          Message.error({
            message: data.message,
            duration: 3 * 1000
          })
        }
        return Promise.reject(data)
      }
    }
    return Promise.resolve(data)
  },
  errors => {
    let message
    if(errors.response && errors.response.data) {
      const data = errors.response.data
      message = data.message || data.error_description || data.error
    }
    Message.error({
      message: message || errors.message,
      duration: 3 * 1000
    })
    return Promise.reject(errors)
  }
)
export default service
