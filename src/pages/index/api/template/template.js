import request from '@/utils/request'

export function saveTemplate(entity) {
  return request({
    url: `/api/template/save`,
    method: 'post',
    data: entity
  })
}

export function getTemplateDetail(bid) {
  return request({
    url: `/api/template/detail/${bid}`,
    method: 'get'
  })
}

export function getTemplatePage(data) {
  return request({
    url: `/api/template/page`,
    method: 'post',
    data: data
  })
}

export function getTemplateList(data) {
  return request({
    url: `/api/template/list`,
    method: 'post',
    data: data
  })
}

export function getTemplateClassList(data) {
    return request({
      url: `/api/template/templateClassList`,
      method: 'post',
      data: data
    })
  }

