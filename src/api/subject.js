import request from '@/utils/request'

export function getLst(query) {
  return request({
    url: '/activity',
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/activity',
    method: 'post',
    data
  })
}

export function update(data) {
  const id = data.id
  delete data.id
  return request({
    url: `/activity/${id}`,
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/activity/${id}`,
    method: 'delete'
  })
}

export function activityDownload(params) {
  return new Promise(r => {
    let querys = []
    Object.keys(params).forEach(key => {
        if (params[key]) {
            querys.push(`${key}=${params[key]}`)
        }
    });
    r(`${process.env.VUE_APP_BASE_API_WHOLE}/activity/download?${querys.join('&')}`)
  })
}

export function activityDownloadBatch(params) {
  return new Promise(r => {
    let querys = []
    Object.keys(params).forEach(key => {
        if (params[key]) {
            querys.push(`${key}=${params[key]}`)
        }
    });
    r(`${process.env.VUE_APP_BASE_API_WHOLE}/activity/downloadBatch?${querys.join('&')}`)
  })
}

export function initSyncStatus(activityId) {
  return request({
    url: `/activity/initSyncStatus/${activityId}`,
    method: 'put'
  })
}
 