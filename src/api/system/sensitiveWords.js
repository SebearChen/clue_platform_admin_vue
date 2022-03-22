import request from '@/utils/request'

export function getKeywordsList(params) {
  return request({
    url: '/keywords',
    method: 'get',
    params
  })
}

export function delKeywordsList(ids){
    return request({
        url: '/keywords/batchDelete',
        method: 'delete',
        data: ids   
    })
}

export function createKeywords(params){
    return request({
        url: '/keywords/batchAdd',
        method: 'post',
        data: params   
    })
}