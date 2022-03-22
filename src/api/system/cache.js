import request from '@/utils/request'

export function getCacheList(params) {
  return request({
    url: '/cache/list',
    method: 'get',
    params
  })
}

export function delCache(params) {
  return request({
    url: '/cache/delete',
    method: 'post',
    params
  })
}
