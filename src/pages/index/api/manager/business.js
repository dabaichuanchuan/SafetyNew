import request from '@/utils/request'

export function saveBusinessDetail(entity) {
  return request({
    url: `/api/business/save`,
    method: 'post',
    data: entity
  })
}

export function getBusinessDetail(id) {
  return request({
    url: `/api/business/detail/${id}`,
    method: 'get'
  })
}

export function getBusinessPage(data) {
  return request({
    url: `/api/business/page`,
    method: 'post',
    data: data
  })
}

export function getBusinessList() {
  return request({
    url: `/api/business/list`,
    method: 'post'
  })
}
