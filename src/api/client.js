import request from '@/utils/request'

export function access() {
  return request({
    url: '/api/client/access',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/client/logout',
    method: 'post'
  })
}
