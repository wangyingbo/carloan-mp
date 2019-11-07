// pages/login/login.js
import {createApiRequest} from '../../utils/request.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeLoading: function () {
    this.setData({
      loading: !this.data.loading
    })
  },
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
});