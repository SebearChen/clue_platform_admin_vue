import request from '@/utils/request'

export function search(account) {
  return request({
    url: '/zeus/user/search?account='+account,
    method: 'get'
  })
}

export function getList(query) {
  return request({
    url: '/zeus/user',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/zeus/user/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/zeus/user',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/zeus/user/' + data.id,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/zeus/user/' + id,
    method: 'delete'
  })
}
