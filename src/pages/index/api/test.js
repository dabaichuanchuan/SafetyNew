import request from '@/utils/request'

export function saveTestDetail(test) {
  return request({
    url: `/api/test/save`,
    method: 'post',
    data: test
  })
}

export function copyTestDetail(tid) {
  return request({
    url: `/api/test/copy/${tid}`,
    method: 'post'
  })
}

export function getTestDetail(tid) {
  return request({
    url: `/api/test/detail/${tid}`,
    method: 'get'
  })
}

export function getTestPage(data) {
  return request({
    url: `/api/test/page`,
    method: 'post',
    data: data
  })
}

export function modifyTestStatus(tid, status) {
  return request({
    url: `/api/test/${tid}/${status}`,
    method: 'post'
  })
}


export function getTestResultPage(data) {
  return request({
    url: `/api/test/result/page`,
    method: 'post',
    data: data
  })
}

export function removeTestResult(tid) {
  return request({
    url: `/api/test/result/remove/${tid}`,
    method: 'post'
  })
}

export function genTestUrl(id) {
  if(process.env.NODE_ENV == 'development') {
    return `${process.env.SLEF_URL}/test.html#/?id=${id}`
  } else {
    return `${process.env.SLEF_URL}/${id}.aspx`
  }
}

export function downTestResult(data) {
  return request({
    url: `/api/test/result/download`,
    method: 'post',
    timeout: 1000 * 60 * 20, //20分钟
    data: data
  })
}

export function genRankingUrl(tid, embed) {
  return `${process.env.SLEF_URL}/test.html${embed?'?ts='+new Date().getTime():''}#/ranking?tid=${tid}`
}

export function genPaperUrl(id, args = {}, embed) {
  let params = new URLSearchParams()
  params.set('id', id)
  Object.keys(args).forEach(key => params.append(key, args[key]))
  return `${process.env.SLEF_URL}/test.html${embed?'?ts='+new Date().getTime():''}#/paper?${params.toString()}`
}
