// pages/mine/editName/editName.js
import { editNameModel } from 'editName-model.js';
var editNameM = new editNameModel();
const Toast = require('../../../dist/toast/toast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getUsername();
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

  _getInputName: function(e){
    var name = e.detail.value;
    console.log(name);
    this.data.name = name;
  },

  _getUsername: function(){
    var user = wx.getStorageSync('userinfo');
    if(user){
      this.setData({
        name: user.name
      });
    }
  },

  _saveName: function(){
    if(!this.data.name){
      Toast({
        type: 'fail',
        message: '姓名未填写！',
        selector: '#zan-toast-test',
      });
      return;
    }
    if(this.data.name.length>10){
      Toast({
        type: 'fail',
        message: '最多十个字',
        selector: '#zan-toast-test',
      });
      return;
    }
    wx.showLoading({
      title: '',
    })
    editNameM._saveName(this.data.name, (res)=>{
      if(res.status==1){
        var user = wx.getStorageSync('userinfo');
        user.name = this.data.name;
        wx.setStorageSync('userinfo', user);
        wx.navigateBack({
          url: '../children/children'
        })
      }else{
        Toast({
          type: 'fail',
          message: '保存失败，请重试',
          selector: '#zan-toast-test',
        });
      }
      wx.hideLoading();
    });
  }
  
})