import request from '@/utils/request'

export function savePositionDetail(position) {
  return request({
    url: `/api/position/save`,
    method: 'post',
    data: position
  })
}

export function getPositionDetail(bid) {
  return request({
    url: `/api/position/detail/${bid}`,
    method: 'get'
  })
}

export function getPositionPage(data) {
  return request({
    url: `/api/position/page`,
    method: 'post',
    data: data
  })
}

