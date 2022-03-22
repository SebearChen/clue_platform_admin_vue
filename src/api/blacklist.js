import request from '@/utils/request'

export function getBlacklistAll(params) {
  return request({
    url: '/blacklist',
    method: 'get',
    params
  })
}

// export function getFirmList(params) {
//   return request({
//     url: '/firm',
//     method: 'get',
//     params
//   })
// }
// export function getOneFirm(id) {
//   return request({
//     url: `/firm/${id}`,
//     method: 'get'
//   })
// }
export function createBlacklist(params) {
  return request({
    url: '/blacklist/batchAdd',
    method: 'post',
    data: params
  })
}
// export function updateFirm(data) {
//   const id = data.id
//   delete data.id
//   return request({
//     url: `/firm/${id}`,
//     method: 'post',
//     data
//   })
// }
export function delBlacklist(params) {
  return request({
    url: '/blacklist/batchDelete',
    method: 'delete',
    data: params
  })
}
