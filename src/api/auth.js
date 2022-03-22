import request from '@/utils/request'

export function getUrl() {
  return request({
    url: '/auth/url',
    method: 'get'
  })
}

export function login(st) {
  return request({
    url: '/auth/authorize',
    method: 'get',
    params: { st }
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
