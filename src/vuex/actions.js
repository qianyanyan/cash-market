
import { getApi } from '../api/api'

export default {
  // 登陆后，获取用户信息
  getUser (context, value) {
    getApi('login', value.loginParams, function (res) {
      let val = {
        data: res,
        callback: value.callback
      }
      context.commit('changeUserId', val)
    })
  },
  // 获取首页信息
  getIndexInfo (context, value) {
    getApi('toIndex', value.userId, function (res) {
      let val = {
        data: res,
        callback: value.callback
      }
      context.commit('changeIndexInfo', val)
    })
  },
  


}
