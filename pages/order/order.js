// pages/order/order.js
import {createApiRequest} from "../../utils/request";
import {dateFormat, getBatchDictValue} from "../../utils/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    row: 10,
    orderList: [],
    searchData: null,
    firstLoading: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      firstLoading: true
    });
    this.fetchOrderList(() => {
      this.setData({
        firstLoading: false
      });
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.loading) {
      return false;
    }
    this.setData({
      page: 1,
      row: 10,
      loading: true
    }, () => {
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      this.fetchOrderList(() => {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
        this.setData({
          loading: false
        });
      });
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loading) {
      return false;
    }
    const {page} = this.data;
    this.setData({
      page: page + 1,
      row: 10,
      loading: true
    }, () => {
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      this.fetchOrderList(() => {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
        this.setData({
          loading: false
        })
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchOrderList: function (callback, search = false) {
    const {page, row, orderList, searchData} = this.data;
    createApiRequest({
      url: '/credit/application/queryApplicationForPage',
      data: {
        page,
        row,
        keyword: search ? searchData : null
      },
    }).then((data) => {
      if (data === [] || !data) {
        return;
      } else {
        data = data.map((item) => {
          return {
            ...item,
            _applicationTime: dateFormat(item.applicationTime, 'YYYY-MM-DD hh:mm:ss'),
            ...getBatchDictValue(item, [
              'dictProductType',
              'dictApplicationStatus'
            ]),
          }
        })
      }
      if (page === 1) {
        this.setData({
          orderList: data
        });
      } else {
        this.setData({
          orderList: [...orderList, ...data]
        });
      }
      callback && callback();
    })
  },

  searchValueOnChange: function (e) {
    this.setData({
      searchData: e.detail.value
    })
  },

  search:function () {
    this.setData({
      page: 1,
      row: 10,
      firstLoading: true
    },() => {
      this.fetchOrderList(() => {
        this.setData({
          firstLoading: false
        });
      },true)
    })
  }
});