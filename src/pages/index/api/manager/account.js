import request from '@/utils/request'

export function saveUserDetail(user) {
  return request({
    url: `/api/user/save`,
    method: 'post',
    data: user
  })
}

export function getUserDetail(uid) {
  return request({
    url: `/api/user/detail/${uid}`,
    method: 'get'
  })
}

export function getUserPage(data) {
  return request({
    url: `/api/user/page`,
    method: 'post',
    data: data
  })
}

export function modifyUserStatus(uid, status) {
  return request({
    url: `/api/user/${uid}/${status}`,
    method: 'post'
  })
}

export function accountExists(params) {
  return request({
    url: '/api/user/exists',
    method: 'get',
    params: params
  })
}

export function changePassword(data) {
  return request({
    url: `/api/user/pwd`,
    method: 'post',
    data: data
  })
}
