import request from '@/utils/request'

export function saveDictionaryDetail(entity) {
  return request({
    url: `/api/dictionary/save`,
    method: 'post',
    data: entity
  })
}

export function getDictionaryDetail(bid) {
  return request({
    url: `/api/dictionary/detail/${bid}`,
    method: 'get'
  })
}

export function getDictionaryPage(data) {
  return request({
    url: `/api/dictionary/page`,
    method: 'post',
    data: data
  })
}

export function getDictionaryList(data) {
  return request({
    url: `/api/dictionary/list`,
    method: 'post',
    data: data
  })
}

