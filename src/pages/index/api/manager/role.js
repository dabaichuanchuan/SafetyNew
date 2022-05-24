import request from '@/utils/request'

export function saveRoleDetail(entity) {
  return request({
    url: `/api/role/save`,
    method: 'post',
    data: entity
  })
}

export function getRoleDetail(bid) {
  return request({
    url: `/api/role/detail/${bid}`,
    method: 'get'
  })
}

export function getRolePage(data) {
  return request({
    url: `/api/role/page`,
    method: 'post',
    data: data
  })
}

export function getRoleList(data) {
  return request({
    url: `/api/role/list`,
    method: 'post',
    data: data
  })
}

