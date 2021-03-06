import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
export function getFollowerList(query) {
  return request({
    url: '/zeus/user/search',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: { id }
  })
}

export function create(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/user/delete',
    method: 'get',
    params: { id }
  })
}
