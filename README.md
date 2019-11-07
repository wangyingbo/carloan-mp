#### 车贷微信小程序原生语法实现。

##### 1. 效果截图

1. 登录界面

   ![登录页面](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG13.jpeg>)

2. 首页

   ![首页](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG14.jpeg>)

3. 订单列表页

   ![订单列表页](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG15.jpeg>)

4. 消息列表页

   ![消息列表页面](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG16.jpeg>)

5. 我的页面

   ![我的页面](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG17.jpeg>)

6. 修改密码页面

   ![修改密码](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG18.jpeg>)

7. 客户列表、客户详情页

   ![客户列表](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG19.jpeg>)

   ![客户详情](<https://github.com/ruralist-siyi/carloan-weixinapp/blob/master/images/uat/WechatIMG20.jpeg>)

##### 2. 部分代码

```javascript
// utils/request.js: 统一请求封装，基于promise
import {getRandomStr} from './index'
import Notify from '../components/vant-weapp/dist/notify/notify';

const baseUrl = 'http://47.98.239.167:8035';

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

// login方法
  login: function (e) {
    const {detail: {value}} = e;
    this.changeLoading();
    createApiRequest({
      url: '/auth/user/login',
      data: value,
      callback: this.changeLoading,
      checkToken: false
    }).then((data) => {
      if (data) {
        const {token} = data;
        wx.setStorageSync('token', token);
        wx.setStorageSync('userInfo', JSON.stringify(data));
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    })
  }
```

##### 3. 遇见的问题

1. 小程序中使用async、await，解决方法：https://segmentfault.com/a/1190000015691620>

2. 下拉刷新 onPullDownRefresh问题: https://developers.weixin.qq.com/community/develop/doc/000a6212a50a282e7c27ad2ff56800