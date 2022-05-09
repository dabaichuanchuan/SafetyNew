import request from '@/utils/request'

export function saveBusinesstypeDetail(entity) {
  return request({
    url: `/api/businesstype/save`,
    method: 'post',
    data: entity
  })
}

export function getBusinesstypeDetail(id) {
  return request({
    url: `/api/businesstype/detail/${id}`,
    method: 'get'
  })
}

export function getBusinesstypePage(data) {
  return request({
    url: `/api/businesstype/page`,
    method: 'post',
    data: data
  })
}

export function getBusinesstypeList() {
  return request({
    url: `/api/businesstype/list`,
    method: 'post'
  })
}
export function modifyBusinesstypeFlag(bid, flag) {
  return request({
    url: `/api/businesstype/${bid}/${flag}`,
    method: 'post'
  })
}
