import axios from 'axios'
// let base = process.env.API_ROOT
// let base = 'http://127.0.0.1:3000'
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('userId') != undefined) {
      config.headers.Authorization = localStorage.getItem('userId')
    } else {

    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  }
)

let base = ''
let root = '/apis'
/*
*  封装异步请求方法getApi
*  url，success参数必须
*  @params url 接口名称
*  @params params 接口参数对象
*  @params success 成功回调
*  @params error 错误回调
* */
export const getApi = function (url, type, params, success, error) {
  if (typeof type != 'string') {
    error = success
    success = params
    params = type
    type = ''
  }
  if (typeof params == 'function') {
    error = success
    success = params
    params = {}
  }
  type = type.toLowerCase()
  if (type == 'get' || type == 'put') {
    type = type
  } else {
    type = 'post'
  }
  if (type == 'get') {
    axios.get(base + root + '/' + url, {params: params}).then(success, error);
  } else {
    axios({
      method: type,
      url: base + root + '/' + url,
      data: params
    }).then(success, error);
  }
}
export {root}

export const config = {
  logout: 'logout'
}
