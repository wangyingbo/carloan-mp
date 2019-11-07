// pages/message/message.js
import {createApiRequest} from "../../utils/request";

const regeneratorRuntime = require("../../utils/regenerator-runtime/runtime");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    row: 10,
    messageList: [],
    firstLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    this.setData({
      firstLoading: true
    });
    this.fetchMessageList(() => {
      this.setData({
        firstLoading: false
      });
    });
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
    this.setData({
      page: 1,
      row: 10,
    }, () => {
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      this.fetchMessageList(() => {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      });
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {page} = this.data;
    this.setData({
      page: page + 1,
      row: 10,
    }, () => {
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      this.fetchMessageList(() => {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchMessageList: function (callback) {
    const {page, row, messageList} = this.data;
    createApiRequest({
      url: '/credit/pushMsg/queryAllPushMsgForPage',
      data: {
        page,
        row
      },
    }).then((data) => {
      if (data === [] || !data) {
        return;
      } else {
        data = data.map((item) => {
          const matchArray = item.content.match(/【\S+】/g);
          return {
            ...item,
            content: item.content.replace(/【\S+】/g, ''),
            shortTitle: matchArray[0] ? matchArray[0] : '消息'
          }
        })
      }
      if (page === 1) {
        this.setData({
          messageList: data
        });
      } else {
        this.setData({
          messageList: [...messageList, ...data]
        });
      }

      callback && callback();
    })
  }
});