import request from '@/utils/request'

export function saveOrg(entity) {
  return request({
    url: `/api/organization/save`,
    method: 'post',
    data: entity
  })
}

export function getOrgPage(data) {
  return request({
    url: `/api/organization/page`,
    method: 'post',
    data: data
  })
}

export function getOrgList(data) {
  return request({
    url: `/api/organization/list`,
    method: 'post',
    data: data
  })
}

export function getOrgTreeList(data) {
  return request({
    url: `/api/organization/orgTreeList`,
    method: 'post',
    data: data
  })
}

export function searchOrgTreeList(data) {
  return request({
    url: `/api/organization/searchOrgTreeList`,
    method: 'post',
    data: data
  })
}

export function getOrgSelectList(data) {
  return request({
    url: `/api/organization/getOrgSelectList`,
    method: 'post',
    data: data
  })
}

export function getCitySelectList(data) {
  return request({
    url: `/api/organization/getCitySelectList`,
    method: 'post',
    data: data
  })
}

export function orgDelete(data) {
  return request({
    url: `/api/organization/delete`,
    method: 'post',
    data: data
  })
}

