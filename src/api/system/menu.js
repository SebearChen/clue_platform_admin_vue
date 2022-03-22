import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/zeus/menu',
    method: 'get',
    params: query
  })
}

export function getParents() {
  return request({
    url: '/zeus/menu/parents',
    method: 'get'
  })
}

export function getOne(id) {
  return request({
    url: '/zeus/menu/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/zeus/menu',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/zeus/menu/' + data.id,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/zeus/menu/' + id,
    method: 'delete'
  })
}
