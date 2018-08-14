// pages/home/home.js
import {
  matcherModel
} from 'matcher-model.js';
var cy = require('../../utils/H_qjll/cy.js');
var matcherM = new matcherModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    page: 1,
    ChildrenList: [],
    LoadingMore: true,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!wx.getStorageSync('token')) {
      cy.promptNotLoggedIn();
      return;
    }
    if (!this.data.ChildrenList.length) {
      this._getChildreList();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page = 1;
    this.setData({
      loading: true
    })
    this.data.ChildrenList = [];
    this._getChildreList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++;
    this.setData({
      LoadingMore: false
    });
    this._getChildreList();
  },


  _getChildreList: function() {
    var that=this;
    var page = that.data.page;
    matcherM._getRecommondChildren(page, (res) => {
      if (res.status == 1) {
        wx.stopPullDownRefresh();
        var data = res.data.data;
        if (data.length > 0) {
          that.data.ChildrenList.push.apply(that.data.ChildrenList, data);
          that.setData({
            loading: false,
            LoadingMore: true,
            noMore: false,
            ChildrenList: that.data.ChildrenList
          });
        } else {
          that.setData({
            loading: false,
            noMore: true,
            LoadingMore: true,
          })
        }
      }
    });
  },
})