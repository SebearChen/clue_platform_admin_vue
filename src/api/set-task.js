import request from '@/utils/request'

export function getOne(query) {
    return request({
      url: '/dockTask',
      method: 'get',
      params: query
    })
}

export function save(data) {
  return request({
    url: `/dockTask`,
    method: 'post',
    data
  })
}

