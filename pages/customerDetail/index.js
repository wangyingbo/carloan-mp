// pages/customerDetail/index.js
import {createApiRequest} from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollLeft:0,
    TabCur: 'baseInfo',
    tabConfig: [
      {
        name: '基本信息',
        key: 'baseInfo'
      },
      {
        name: '工作信息',
        key: 'workInfo'
      },
      {
        name: '车辆信息',
        key: 'carInfo'
      },
      {
        name: '联系人信息',
        key: 'contactInfo'
      },
    ],
    customerDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {customerId} = options;
    this.fetchCustomerDetail(customerId);
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
  fetchCustomerDetail: function(customerId) {
    console.log(customerId);
    if(!customerId) return;
    createApiRequest({
      url: '/credit/customer/queryDetail',
      data: {
        customerId
      }
    }).then((data) => {
      console.log(data);
      this.setData({
        customerDetail: data
      })
    });
  },
  tabSelect: function(e) {
    const {currentTarget:{dataset}} = e;
    this.setData({
      TabCur: dataset.id
    })
  }
});