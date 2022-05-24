import request from '@/utils/request'

export function saveDictType(entity) {
  return request({
    url: `/api/dict/save`,
    method: 'post',
    data: entity
  })
}

export function getDictTypeDetail(bid) {
  return request({
    url: `/api/dict/detail/${bid}`,
    method: 'get'
  })
}

export function getDictTypePage(data) {
  return request({
    url: `/api/dict/page`,
    method: 'post',
    data: data
  })
}

export function getDictTypeListForEnterprise() {
  return request({
    url: `/api/dict/listForEnterprise`,
    method: 'post',
  })
}

export function saveDictData(entity) {
  return request({
    url: `/api/dict/datasave`,
    method: 'post',
    data: entity
  })
}

export function getDictDataDetail(bid) {
  return request({
    url: `/api/dict/datadetail/${bid}`,
    method: 'get'
  })
}

export function getDictDataPage(data) {
  return request({
    url: `/api/dict/datapage`,
    method: 'post',
    data: data
  })
}

export function getDictDataList(data) {
  return request({
    url: `/api/dict/datalist`,
    method: 'post',
    data: data
  })
}
