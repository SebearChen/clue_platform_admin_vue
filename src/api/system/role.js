import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/zeus/role',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/zeus/role/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/zeus/role',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/zeus/role/' + data.id,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/zeus/role/' + id,
    method: 'delete'
  })
}
