// pages/children_detail/children_detail.js
import {
  children_model
} from 'children_detail-model.js';
var cy = require('../../utils/H_qjll/cy.js');
var PageUrl = require('../../utils/PageUrl.js');
var childDetailM = new children_model();
var app = getApp();
var Promise = require('../../utils/es6-promise.js');
var WxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childInfo: null,
    unspread: 0,
    show_spread_btn: 0,
    string_btn: '展开',
    style_btn: 'fa-angle-down',
    album: [],
    user: null,
    avatarUrl: '',
    showChatModal: 0,
    showViewAlbumModal: 0,
    currentUser: [],
    showChatBtn: true,
    showOtherBtns: false,
    canApp: false,
    canCollect: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let localCertifyed;
    //根据场景值，显示是否打开APP
    if (app.globalData.scene == 1036 || app.globalData.scene == 1069)
      that.setData({
        canApp: true
      })
    //解析二维码参数
    console.log(options)
    if (options.scene) {
      options = decodeURIComponent(options.scene);
      options = cy.parseUrl(options)
    }
    console.log(options)
    //来自聊天页
    if (options.from == "chat") {
      that.setData({
        showChatBtn: false
      })
    }
    //来自聊天页和列表页以外的
    if (options.from && options.from != 'chat') {
      that.setData({
        showOtherBtns: true
      })
    }
    //登陆，实名，信息
    cy.isLogined(that).then(cy.isLocalCertifyed).then(res => {
      localCertifyed = res;
      console.log(res)
      that.setData({
        identify: options.identify
      })
      if (options.identify == 1) {
        that.setData({
          child_id: options.child_id
        })
        return that._getChildDetail(options)
      }
      if (options.identify == 2) {
        that.setData({
          matcher_id: options.child_id
        })
        return that._getMatcherDetail(options)
      }
    }).then(res => {
      console.log(res.parent.id, that.data.userinfo.id)
      //是否为本人
      if (options.identify == 1 && res.parent.id == that.data.userinfo.id) {
        that.setData({
          showChatBtn: false,
          "childInfo.have_saw": 1,
          canCollect: false
        })
      }
      //实名浏览分享信息
      if (options.from == 1 && !localCertifyed && res.parent.certification == 1) {
        wx.showModal({
          title: '提醒',
          content: '对方已完成实名认证，您需要完成实名认证才能继续',
          showCancel: false,
          confirmText: '前去认证',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/mine/index/index',
              })
            }
          }
        })
      }
      //实名绑定红娘
      if (options.from == 2) {
        if (localCertifyed) {
          wx.showToast({
            title: '绑定成功',
          })
        } else {
          wx.showModal({
            title: '提醒',
            content: '您需要完成实名认证才能与红娘绑定',
            showCancel: false,
            confirmText: '前去认证',
            success(result) {
              if (result.confirm) {
                wx.switchTab({
                  url: '/pages/mine/index/index',
                })
              }
            }
          })
        }
      }
    }).catch(function(reason) {
      log('Failed: ' + reason);
    })
    return;
  },



  launchAppError: function(e) {
    console.log(e.detail.errMsg)
    wx.previewImage({
      urls: ['https://qingjia.oss-cn-hangzhou.aliyuncs.com/basePicture/miniapp_index.jpg'],
    })
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 收藏
   */
  _collectChild() {
    var that = this;
    if (that.data.childInfo.is_collected) {
      wx.showToast({
        title: '您已收藏',
        icon: 'none'
      })
      return;
    }
    if (that.data.identify == 1) {
      var child_id = that.data.child_id;
      var parent_id = that.data.childInfo.parent.id;
    } else {
      var child_id = null;
      var parent_id = that.data.matcher_id;
    }
    childDetailM._collect(parent_id, child_id, (res) => {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '收藏成功',
        })
        that.setData({
          'childInfo.is_collected': 1
        })
      }
    })

  },
  /**
   * 红娘详情
   */
  _getMatcherDetail(options) {
    var that = this;
    console.log(654)
    var matcher_id = options.child_id;
    return childDetailM._getMatcherDetail(matcher_id).then(res => {
      return new Promise(function(resolve, reject) {
        console.log(res)
        if (res.status == 1) {
          console.log(1)
          that.data.avatarUrl = res.data.avatarUrl;
          if (!res.data.user_profile) {
            that.data.show_spread_btn = 0;
          } else if (res.data.user_profile.length > 44) {
            that.data.unspread = 1;
            that.data.show_spread_btn = 1;
          }
          wx.setNavigationBarTitle({
            title: res.data.name
          })
          that.setData({
            unspread: that.data.unspread,
            show_spread_btn: that.data.show_spread_btn,
            childInfo: res.data,
            user: res.data
          });
          resolve(res.data);
        } else {
          reject(456);
        }
      });

    })





  },

  /**
   * 孩子详情
   */
  _getChildDetail: function(options) {
    var that = this;
    var child_id = options.child_id;

    return childDetailM._getChildDetail(child_id).then(res => {
      console.log(res)

      return new Promise(function(resolve, reject) {
        console.log(res)
        if (res.status == 1) {
          that.data.album = res.data.album;
          that.data.avatarUrl = res.data.parent.avatarUrl;
          if (!res.data.personal_profile) {
            that.data.show_spread_btn = 0;
          } else if (res.data.personal_profile.length > 44) {
            that.data.unspread = 1;
            that.data.show_spread_btn = 1;
          }
          wx.setNavigationBarTitle({
            title: res.data.parent.name
          })
          that.setData({
            unspread: that.data.unspread,
            show_spread_btn: that.data.show_spread_btn,
            childInfo: res.data,
            user: res.data.parent
          });
          resolve(res.data)
        } else {
          reject(456);
        }
      });

    })

  },

  _spread: function(e) {
    this.setData({
      unspread: !this.data.unspread,
      string_btn: this.data.unspread ? '收起' : '展开',
      style_btn: this.data.unspread ? 'fa-angle-up' : 'fa-angle-down',
    });
  },
  /**
   * 去聊天
   */
  _goChat: function(e) {
    var that = this;
    if (that.data.identify == 1) {
      var child_id = this.data.childInfo.id;

      var have_contacted = this.data.childInfo.have_contacted;
      //测试屏蔽
      if (!have_contacted) {
        cy.updateLocalInfo(this)
        this.setData({
          showChatModal: 1
        });
        return;
      }
      var myname = wx.getStorageInfoSync('myUsername');
      var nameList = {
        myName: myname,
        your: that.data.user.tel + '_' + that.data.user.id,
      }
      wx.navigateTo({
        url: '../msg/chat/chat?username=' + JSON.stringify(nameList) + '&user_name=' + that.data.user.name + '&avatarUrl=' + that.data.avatarUrl + '&user_id=' + child_id + '&identity=1',
      })
      return;
    }
    if (that.data.identify == 2) {
      var user_id = this.data.childInfo.id;
      var child_id = null;
      wx.showToast({
        title: '',
        icon: 'loading'
      })
      childDetailM._buyChatChance(user_id, child_id, (res) => {
        wx.hideToast();
        if (res.status) {
          var myname = wx.getStorageInfoSync('myUsername');
          var nameList = {
            myName: myname,
            your: that.data.user.tel + '_' + that.data.user.id,
          }
          wx.navigateTo({
            url: '../msg/chat/chat?username=' + JSON.stringify(nameList) + '&user_name=' + that.data.user.name + '&avatarUrl=' + that.data.avatarUrl + '&user_id=' + user_id + '&identity=2',
          })
          return;
        }
      })
    }

  },
  /**
   * 要聊天
   */
  _chat: function(e) {
    var that = this;
    var child_id = this.data.childInfo.id;
    var user_id = this.data.childInfo.parent.id;
    wx.showToast({
      title: '',
      icon: 'loading'
    })
    that.setData({
      showChatModal: !that.data.showChatModal
    })
    childDetailM._buyChatChance(user_id, child_id, (res) => {
      wx.hideToast();
      if (res.status) {

        this.data.childInfo.have_contacted = 1;
        var myname = wx.getStorageInfoSync('myUsername');
        var nameList = {
          myName: myname,
          your: this.data.user.tel + '_' + this.data.user.id,
        }
        that._goChat()

        return;
      }
      this._toChargeModal();
      return;
    });

  },
  _previewImage: function(e) {
    var have_saw = this.data.childInfo.have_saw;
    if (!have_saw) {
      cy.updateLocalInfo(this)
      this.setData({
        showViewAlbumModal: 1
      });
      return;
    }
    var url = e.currentTarget.dataset.url;
    var urls = [];
    for (var i = 0; i < this.data.album.length; i++) {
      urls[i] = this.data.album[i]['image_url']
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 看相册
   */
  _viewAlbum: function() {
    var child_id = this.data.childInfo.id;
    var user_id = this.data.childInfo.parent.id;
    wx.showToast({
      title: '',
      icon: 'loading'
    })
    this.setData({
      showViewAlbumModal: !this.data.showViewAlbumModal
    });
    childDetailM._buyViewChance(user_id, child_id, (res) => {
      wx.hideToast();
      if (res.status) {
        this.data.childInfo.have_saw = 1;
        this.data.showViewAlbumModal = 0;
        var urls = [];
        for (var i = 0; i < this.data.album.length; i++) {
          urls[i] = this.data.album[i]['image_url']
        }
        wx.previewImage({
          current: urls[0], // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
        })
        return;
      }
      this._toChargeModal();
    });
  },

  _toChargeModal: function() {
    wx.showModal({
      title: '',
      showCancel: 'false',
      content: '您的汤团余额不足，立即去充值吧！',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../mine/charge/charge',
          })
        }
      }
    })
  },

  _toggleChatModal: function() {
    this.setData({
      showChatModal: !this.data.showChatModal
    });
  },

  _toggleViewChatModal: function() {
    this.setData({
      showViewAlbumModal: !this.data.showViewAlbumModal
    });
  },

  _getMoreCoin: function() {
    wx.navigateTo({
      url: '../mine/charge/charge',
    })
  }
})