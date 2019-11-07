import {getRandomStr} from './index'
import Notify from '../components/vant-weapp/dist/notify/notify';

const baseUrl = 'http://116.62.152.199:8035';

export function createApiRequest(options) {
  const {method = 'POST', url, callback, data = {}, checkToken = true} = options;
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method: method,
      data: {
        tenantId: '0001',
        terminalType: '1',
        serialId: getRandomStr(),
        token: checkToken ? wx.getStorageSync('token') : null,
        ...data
      },
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const code = response.data.code;
          if (code === "000000") {
            const result = response.data.data;
            resolve(result);
          } else {
            Notify(response.data.message || '请求错误');
          }
        } else if (response.statusCode === 401) {
          Notify('登录超时，请重新登录');
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      },
      fail: (response) => {
        const errMsg = response.errMsg || '请求错误';
        Notify(errMsg);
        reject();
      },
      complete: () => {
        callback && callback();
      }
    })
  })
}
