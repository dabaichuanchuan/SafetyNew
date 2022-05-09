import request from '@/utils/request'

export function saveEnterprise(entity) {
  return request({
    url: `/api/enterprise/save`,
    method: 'post',
    data: entity
  })
}

export function getEnterpriseDetail(bid) {
  return request({
    url: `/api/enterprise/detail/${bid}`,
    method: 'get'
  })
}

export function getEnterprisePage(data) {
  return request({
    url: `/api/enterprise/page`,
    method: 'post',
    data: data
  })
}

export function getEnterpriseList(data) {
  return request({
    url: `/api/enterprise/list`,
    method: 'post',
    data: data
  })
}

