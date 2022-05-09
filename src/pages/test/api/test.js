import request from '@/utils/request'

export function getTestDetail(tid, params) {
  return request({
    url: `/api/test/${tid}`,
    method: 'get',
    params: params
  })
}

export function submitTestPaper(test) {
  return request({
    url: `/api/test/submit`,
    method: 'post',
    data: test
  })
}

export function getRankingList(tid) {
  return request({
    url: `/api/test/ranking/${tid}`,
    method: 'get'
  })
}

export function getTestResult(rid) {
  return request({
    url: `/api/test/result/${rid}`,
    method: 'get'
  })
}
