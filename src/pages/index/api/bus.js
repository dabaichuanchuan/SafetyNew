import request from '@/utils/request'

export function saveBusDetail(bus) {
  return request({
    url: `/api/bus/save`,
    method: 'post',
    data: bus
  })
}

export function getBusDetail(bid) {
  return request({
    url: `/api/bus/detail/${bid}`,
    method: 'get'
  })
}

export function getBusPage(data) {
  return request({
    url: `/api/bus/page`,
    method: 'post',
    data: data
  })
}

export function modifyBusStatus(bid, status) {
  return request({
    url: `/api/bus/${bid}/${status}`,
    method: 'post'
  })
}

export function getBusGuid(type) {
  return request({
    url: `/api/bus/guid/${type}`,
    method: 'get'
  })
}
