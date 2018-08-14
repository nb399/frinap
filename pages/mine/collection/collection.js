// pages/mine/collection/collection.js
import {collectionModel} from 'collection-model.js';
var collectionM=new collectionModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    collectionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that._loadData();
  },
  _loadData(){
    var that=this;
    collectionM._getCollectionList((res) => {
      console.log(res)
      that.setData({
        collectionList: res.data,
        loading: false
      })
    })  
  },
  _deleteCollectChild(e) {
    var that = this;
    var collection_id = e.currentTarget.dataset.collection_id;
    var currentIndex = e.currentTarget.dataset.index;
    wx.showModal({
      title:'取消收藏',
      content: '确定不再收藏“' + that.data.collectionList[currentIndex].user.name+'”了吗？',
      success(res){
        if(res.confirm){
          collectionM._deleteCollect(collection_id, (res) => {
            let collectionArr = that.data.collectionList;
            collectionArr.splice(currentIndex, 1)
            that.setData({
              collectionList: collectionArr
            })
          })
        }
      }
    })

  },
  _childDetail: function (e) {
    var person = e.currentTarget.dataset.person;
    if (person.user.identity==1){
      var identity=1;
      var child_id=person.child.id
    }
    else{
      var identity = 2;
      var child_id = person.user.id
    }
    wx.navigateTo({
      url: '../../children_detail/children_detail?child_id=' + child_id + '&identify=' + identity,
    })
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
  var that=this;
  that.setData({
    collectionList:[],
    loading:true
  })
  that._loadData()
  wx.stopPullDownRefresh()
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
  
  }
})