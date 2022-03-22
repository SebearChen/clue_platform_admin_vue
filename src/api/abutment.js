import request from '@/utils/request'

export function getDockAll(params) {
  return request({
    url: '/dock/all',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: '/dock',
    method: 'get',
    params
  })
}
export function getOne(id) {
  return request({
    url: `/dock/${id}`,
    method: 'get'
  })
}
export function create(data) {
  return request({
    url: '/dock',
    method: 'post',
    data
  })
}
export function update(data) {
  const id = data.id
  delete data.id
  return request({
    url: `/dock/${id}`,
    method: 'post',
    data
  })
}
export function del(id) {
  return request({
    url: `/dock/${id}`,
    method: 'delete'
  })
}
