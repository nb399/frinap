// pages/msg/index/index.js
import { indexModel } from 'index-model.js';
var cy = require('../../../utils/H_qjll/cy.js');
var indexM = new indexModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childInfo: null,
    unspread: 0,
    show_spread_btn: 0,
    string_btn: '展开',
    style_btn: 'fa-angle-up',
    user: null,
    avatarUrl: '',
    showChatModal: 0,
    userinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    cy.updateLocalInfo(this)
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
    this._getContactedList();
    let msgCount = wx.getStorageSync('msgCount');

    if (msgCount > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: msgCount.toString()
      })
    } else {
      wx.hideTabBarRedDot({
        index: 2
      })
    }
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
    this._getContactedList();
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
  _chat: function (e) {
    var that = this;
    var child_id;
    var current = that.data.currentChat;
    var chatList = that.data.chatList;
    var currentChat = chatList[current];
    if (currentChat.child)
      child_id = currentChat.child.id
    else
      child_id = null

    var user_id = currentChat.user.id;
    wx.showToast({
      title: '',
      icon: 'loading'
    })
    indexM._buyChatChance(user_id, child_id, (res) => {
      wx.hideToast();
      if (res.status) {

        var myname = wx.getStorageInfoSync('myUsername');
        var msgCount = wx.getStorageSync('msgCount');
        var haveNewList = wx.getStorageSync('haveNewList');
        if (haveNewList.length - 1 > current || haveNewList.length - 1 == current) {
          msgCount = msgCount - haveNewList[current];
          wx.setStorageSync('msgCount', msgCount);
          haveNewList[current] = 0;
          wx.setStorageSync('haveNewList', haveNewList);
          if (msgCount > 0) {
            wx.setTabBarBadge({
              index: 2,
              text: msgCount.toString()
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2
            })
          }
        }

        cy.updateLocalInfo(that)
        that._toggleChatModal();
        chatList[current].havePayed = 1
        that.setData({
          chatList: chatList
        })

        var nameList = {
          myName: myname,
          your: currentChat.user.tel + '_' + currentChat.user.id,
        }
        var show_id = currentChat.user.identity == 2 ? currentChat.user.id : currentChat.child.id
        wx.navigateTo({
          url: '/pages/msg/chat/chat?username=' + JSON.stringify(nameList) + '&user_name=' + currentChat.user.name + '&avatarUrl=' + currentChat.user.avatarUrl + '&user_id=' + show_id + '&identity=' + currentChat.user.identity,
        })
        return;
      }
      this._toChargeModal();
      return;
    });

  },
  _toChargeModal: function () {
    var that = this;
    wx.showModal({
      title: '',
      showCancel: 'false',
      content: '您的汤团余额不足，立即去充值吧！',
      success: function (res) {
        if (res.confirm) {
          that._toggleChatModal();
          wx.navigateTo({
            url: '/pages/mine/charge/charge',
          })
        }
      }
    })
  },
  _getContactedList: function () {
    var that = this;
    var id_list = wx.getStorageSync('chatList');
    console.log(id_list)
    if (!id_list) {
      that.setData({
        chatList: [],
      });
      return;
    }
    var id_str = id_list.join(",");
    setInterval(function () {
      that.setData({
        haveNewList: wx.getStorageSync('haveNewList'),
        lastTime: wx.getStorageSync('lastTime'),
        lastDialog: wx.getStorageSync('lastDialog'),
      });
    }, 1000);
    indexM._getContactedList(id_str, (res) => {

      that.setData({
        chatList: res.data,
      });
      wx.stopPullDownRefresh();
    })
  },

  _toggleChatModal: function () {
    this.setData({
      showChatModal: !this.data.showChatModal
    });
  },
  _getMoreCoin: function () {
    var that = this;
    that._toggleChatModal();
    wx.navigateTo({
      url: '/pages/mine/charge/charge',
    })
  },
  _goChat: function (e) {
    var index = e.currentTarget.dataset.idx;
    var userInfo = this.data.chatList[index];
    if (!userInfo.havePayed && userInfo.user.identity != 2) {
      this.setData({
        currentChat: index,
        showChatModal: 1
      });
      return;
    }
    var myname = wx.getStorageInfoSync('myUsername');
    var msgCount = wx.getStorageSync('msgCount');
    var haveNewList = wx.getStorageSync('haveNewList');
    console.log(haveNewList)
    if (haveNewList.length - 1 > index || haveNewList.length - 1 == index) {
      msgCount = msgCount - haveNewList[index];
      wx.setStorageSync('msgCount', msgCount);
      haveNewList[index] = 0;
      wx.setStorageSync('haveNewList', haveNewList);
      if (msgCount > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: msgCount.toString()
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2
        })
      }
    }


    var nameList = {
      myName: myname,
      your: userInfo.user.tel + '_' + userInfo.user.id,
    }
    var show_id = userInfo.user.identity == 2 ? userInfo.user.id : userInfo.child.id
    wx.navigateTo({
      url: '/pages/msg/chat/chat?username=' + JSON.stringify(nameList) + '&user_name=' + userInfo.user.name + '&avatarUrl=' + userInfo.user.avatarUrl + '&user_id=' + show_id + '&identity=' + userInfo.user.identity,
    })
  }
})