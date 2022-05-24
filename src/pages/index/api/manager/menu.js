import request from '@/utils/request'

export function saveMenu(entity) {
  return request({
    url: `/api/menu/save`,
    method: 'post',
    data: entity
  })
}

export function getMenuDetail(bid) {
    return request({
      url: `/api/menu/detail/${bid}`,
      method: 'get'
    })
  }

export function getMenuPage(data) {
  return request({
    url: `/api/menu/page`,
    method: 'post',
    data: data
  })
}

export function getMenuList(data) {
  return request({
    url: `/api/menu/list`,
    method: 'post',
    data: data
  })
}

export function getMenuParentList() {
    return request({
      url: `/api/menu/parentList`,
      method: 'post'
    })
  }
  
export function getMenuTypeEnumList() {
    return request({
      url: `/api/menu/menuTypeEnumList`,
      method: 'post'
    })
  }
  export function loadTree() {
    return request({
      url: `/api/menu/loadTree`,
      method: 'post'
    })
  }
