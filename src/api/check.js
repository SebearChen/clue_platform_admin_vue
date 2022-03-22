import request from '@/utils/request'

export function check() {
  return request({
    url: '/zeus/check',
    method: 'get'  
  })
}
