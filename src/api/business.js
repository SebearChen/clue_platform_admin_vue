import request from '@/utils/request'

export function getFirmAll() {
  return request({
    url: '/firm/all',
    method: 'get'
  })
}

export function getFirmList(params) {
  return request({
    url: '/firm',
    method: 'get',
    params
  })
}
export function getOneFirm(id) {
  return request({
    url: `/firm/${id}`,
    method: 'get'
  })
}
export function createFirm(data) {
  return request({
    url: '/firm',
    method: 'post',
    data
  })
}
export function updateFirm(data) {
  const id = data.id
  delete data.id
  return request({
    url: `/firm/${id}`,
    method: 'post',
    data
  })
}
export function delFirm(id) {
  return request({
    url: `/firm/${id}`,
    method: 'delete'
  })
}
