import request from '@/utils/request'

export function getConfigList(params) {
  return request({
    url: '/zeus/systemConfig',
    method: 'get',
    params
  })
}

export function getConfigOne(id) {
  return request({
    url: `/zeus/systemConfig/edit/${id}`,
    method: 'get'
  })
}

export function updateConfig(params) {
  return request({
    url: `/zeus/systemConfig/edit/${params.id}`,
    method: 'post',
    data: params
  })
}

export function addConfig(params) {
  return request({
    url: '/zeus/systemConfig/add',
    method: 'post',
    data: params
  })
}

export function deleteConfig(ids) {
  return request({
    url: `/zeus/systemConfig/${ids}`,
    method: 'delete'
  })
}

