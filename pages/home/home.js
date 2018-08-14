// pages/home/home.js
import { homeModel } from 'home-model.js';
var homeM = new homeModel();
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
  onLoad: function (options) {
    this._getChildreList();
  },

 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
  onReachBottom: function () {
    this.data.page++;
    this.setData({
      LoadingMore: false
    });
    this._getChildreList();
  },


  _getChildreList: function() {
    var that=this;
    var page = this.data.page;
    homeM._getRecommondChildren(page, (res) => {
      if (res.status == 1) {
        wx.stopPullDownRefresh();
        var data = res.data.data;
        if(data.length>0){
          this.data.ChildrenList.push.apply(this.data.ChildrenList, data);
          this.setData({
            loading: false,
            noMore: false,
            LoadingMore: true,
            ChildrenList: this.data.ChildrenList
          });
        }else{
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