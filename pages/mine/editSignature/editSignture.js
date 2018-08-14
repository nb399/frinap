// pages/mine/editSignature/editSignture.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:0,
    signature: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        signature: options.signature,
        length: options.signature?options.signature.length:0
      });
      
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
      length: this.data.length
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

  _getLength: function(e){
    this.setData({
      signature: e.detail.value,
      length: e.detail.value.length
    });
  },

  _getSignature: function(){
    if (this.data.signature.length < 15 || this.data.signature.length>500){
      wx.showModal({
        title: '提示',
        content: '不能少于15字多于500字',
        showCancel:false
      })
      return;
    }

    wx.setStorageSync('signature', this.data.signature);
    wx.navigateBack({
      url: '../children/children'
    });
  }
})