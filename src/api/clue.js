import request from '@/utils/request'

export function getEnrollLsit(params) {
  return request({
    url: '/enroll',
    method: 'get',
    params
  })
}

export function getEnrollOne(id) {
    return request({
        url: `/enroll/${id}`,
        method: 'get'
    })
}

export function enrollImport(data, activityId) {
    return request({
        url: `/enroll/import/${activityId}`,
        method: 'post',
        data
    })
}
export function enrollExport(params) {

    return new Promise(r => {
        let querys = []
        Object.keys(params).forEach(key => {
            if (params[key]&&key!='page'&&key!="pageSize") {
                querys.push(`${key}=${params[key]}`)
            }
        });
        r(`${process.env.VUE_APP_BASE_API_WHOLE}/enroll/export?${querys.join('&')}`)
    })
}

export function del(id) {
    return request({
      url: '/enroll/' + id,
      method: 'delete'
    })
  }

export function batchDelete(ids){
    return request({
        url: '/enroll/batchDelete',
        method: 'delete',
        data: ids   
    })
}

export function batchAudit(status, ids){
    return request({
        url: `/enroll/batchAudit/${status}`,
        method: 'post',
        data: ids
    })
}

export function getEnrollRecover(params){
    return request({
        url: '/enrollRecover',
        methods: 'get',
        params
    })
}
export function getBatchRecover(ids){
    return request({
        url: '/enrollRecover/batchRecover',
        method: 'delete',
        data: ids
    })
}