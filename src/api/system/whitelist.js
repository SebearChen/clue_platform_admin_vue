import request from '@/utils/request'

export function getWhitelistAll(params) {
  return request({
    url: '/whitelist',
    method: 'get',
    params
  })
}

export function createWhitelist(params) {
  return request({
    url: '/whitelist/add',
    method: 'post',
    data: params
  })
}

export function delWhitelist(params) {
  return request({
    url: '/whitelist/batchDelete',
    method: 'delete',
    data: params
  })
}
