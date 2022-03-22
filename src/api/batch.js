import request from '@/utils/request'

export function getFirmAll() {
  return request({
    url: '/firm/all',
    method: 'get',
  })
}

export function getDock(id) {
  return request({
    url: `/dock/byFirmId/${id}`,
    method: 'get',
  })
}

export function getActivity(params) {
  return request({
    url: '/activity/byDockId',
    method: 'get',
    params
  })
}

export function getDownload(params) {
  return request({
    url: '/activity/download',
    method: 'get',
    params
  })
}
export function batchExport(params) {

  return new Promise(r => {
      let querys = []
      Object.keys(params).forEach(key => {
          if (params[key]&&key!='page'&&key!="pageSize") {
              querys.push(`${key}=${params[key]}`)
          }
      });
      r(`${process.env.VUE_APP_BASE_API_WHOLE}/enroll/batchExport?${querys.join('&')}`)
  })
}
