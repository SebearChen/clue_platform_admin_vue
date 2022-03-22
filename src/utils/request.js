import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// import { CODE_MAP } from '@/config/constants'
//
// const CODE_MAP = require('@/config/code-map')

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 200) {

      const msg = typeof res.msg === 'object' ? res.msg.message : msg
      Message({
        // message: '操作失败a: ' + CODE_MAP[res.code] || 'Error',
        message: res.message || '服务器异常...',
        type: 'error',
        duration: 2000
      })

      // if (res.code === 401) {
      //   location.href = '#/login'
      // }

      if (res.code === 401 || res.code === 403) {
        // to re-login
        // MessageBox.confirm('账号已注销，您可以取消停留在该页，或重新登录。', '确认注销', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
        setTimeout(()=>{
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        },2000)
      }
      return Promise.reject(new Error(res.message || '服务器异常...'))
    } else {
      return res
    }
  },
  error => {
    console.log('===> err: ')
    // let eMsg = error.message
    let eMsg = error.response.data.message?error.response.data.message:'服务器异常...'
    if (error.response && error.response.status === 403) {
      eMsg = '您无权限访问此页面'
    }
    Message({
      message: eMsg,
      type: 'error',
      duration: 5 * 1000
    })
    // this.$router.push({ name: 'Dashboard' })
    return Promise.reject(error)
  }
)

export default service
