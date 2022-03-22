import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/zeus/log',
    method: 'get',
    params
  })
}
