// pages/mine/index/index.js
import {
  indexModel
} from 'index-model.js';
require('../../../utils/strophe.js');
var WebIM = require('../../../utils/WebIM.js').default;
import {
  config
} from '../../../utils/config.js';
var cy = require('../../../utils/H_qjll/cy.js');
var indexM = new indexModel();
const Toast = require('../../../dist/toast/toast');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRegisterModal: false,
    showUploadModal: false,
    userInfo: null,
    tel: '',
    code: '',
    isLogin: false,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    //选择的默认头像
    selectedAvatar: -1,
    selectedUrl: '',
    uploadAvatarUrl: null,
    certifiedData: [{
      text: '未认证',
      color: '#777'
    }, {
      text: '已认证',
      color: '#7f7cf7'
    }, {
      text: '审核中',
      color: '#777'
    }, {
      text: '认证失败',
      color: '#f25d8e'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (wx.getStorageSync('token')) {
      this._getUserInfo();
    }
    console.log(app.globalData.saveTempPage)
    wx.login({
      success(res) {
        that.setData({
          loginCode: res.code
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var userInfo = wx.getStorageSync('userinfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    } else {
      this.setData({
        userInfo: '',
        isLogin: false,
      });
    }
    if (userInfo && userInfo.certification == 2) {
      this._getUserInfo((res) => {
        1691
        if (res == 1) {
          Toast({
            message: `+50 \n 认证成功`,
            selector: '#zan-toast-test',
            image: '/images/icon/coin.png',
            timeout: 2000
          });
        }
        if (res == 3) {
          Toast({
            message: `实名认证失败~\n请重新认证!`,
            selector: '#zan-toast-test',
            timeout: 2000
          });
        }
      });
    }
  },

/**
 * 解释汤团
 */
  _whatTangTuan() {
    wx.showModal({
      title: '汤团',
      content: '在部分功能中需要使用汤团',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  /**
   * 个人信息
   */
  _getUserInfo: function(cb) {
    var that = this;
    indexM._getUserInfo((res) => {
      if (res.status == 1) {
        cb && cb(res.data.certification)
        wx.setStorageSync('userinfo', res.data);
        that.setData({
          isLogin: true,
          userInfo: res.data
        });
      }
    });
  },

  //发送验证码模态框开关
  _toggleRegisterModal: function() {
    this.setData({
      showRegisterModal: !this.data.showRegisterModal,
    });
  },

  //验证码倒计时
  _getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      console.log();
      if (currentTime == 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  //发送验证码
  _getVerificationCode: function(e) {
    var tel = this.data.tel;
    if (!cy.isPoneAvailable(tel)) {
      return false;
    }
    indexM._getVerifyCode(tel, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: '发送成功！',
          icon: 'success',
          duration: 777
        })
      }
    });
    this._getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  /**
   * 微信电话登陆
   */
  _getPhoneNumber: function(e) {
    console.log(e)
    var that = this;
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.showLoading({
        title: '正在登陆',
      })
      indexM._getTokenTirect(that.data.loginCode, encryptedData, iv, (res) => {
        wx.login({
          success(res) {
            that.setData({
              loginCode: res.code
            })
          }
        })
        if (res.status == 1) {
          wx.hideLoading();
          var data = res.data;
          that._loginOk(data);
        }
      });
    }
  },
  /**
   * 获得输入手机号
   */
  _getInputNumber: function(e) {
    var tel = e.detail.value;
    this.data.tel = tel;
  },
  /**
   * 获得输入验证码
   */
  _getInputCode: function(e) {
    var code = e.detail.value;
    this.data.code = code;
  },

  /**
   * 成功登陆
   */
  _loginOk(data) {
    var that = this;
    if (data.identity == 2) {
      wx.showToast({
        title: '此号码已注册为红娘',
        icon: "none"
      })
    } else {
      wx.setStorageSync('default_avatarurl', data.default_avatar);
      wx.setStorageSync('token', data.token);
      wx.setStorageSync('userinfo', data);
      wx.setStorageSync('hxname', data.tel + '_' + data.id);
      app._hxlogin();
      this.setData({
        isLogin: true,
        userInfo: data
      });
      that._getUserInfo();

      if (!data.openid) {
        indexM._postCode(that.data.loginCode, res => {})
      }



      if (!data.integrity_basic) {
        app.globalData.savePageForLogin = null
        wx.redirectTo({
          url: '/pages/guide/guide',
        })
        return;
      }
      if (app.globalData.savePageForLogin) {
        wx.redirectTo({
          url: app.globalData.savePageForLogin,
        })
        app.globalData.savePageForLogin = null
        return;
      }
    }
  },
  /**
   * 手机号登陆
   */
  _getTokenFormServer: function() {
    var that = this;
    if (!cy.isPoneAvailable(that.data.tel))
      return false;
    if (!this.data.code) {
      wx.showToast({
        title: '验证不能为空！',
        icon: 'none'
      });
      return false;
    }
    indexM._getToken(this.data.tel, this.data.code, (res) => {
      wx.hideLoading();
      if (res.status == 1) {
        that._loginOk(res.data);
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    });
  },

  //完善孩子信息
  _completeChildrenInfo: function() {
    wx.navigateTo({
      url: '../children/children',
    })
  },
  /**
   * 切换账号
   */
  _switchAccount: function() {
    wx.showModal({
      title: '切换账号',
      content: '是否清除缓存，切换账号',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.removeTabBarBadge({
            index: 2
          })
          WebIM.conn.close()
          wx.reLaunch({
            url: '/pages/mine/index/index',
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  /**上传模态框的开关 */
  _toggleUploadModal: function() {
    if (!this.data.showUploadModal) {
      this._getDefaultAvatarUrl();
    }
    this.setData({
      showUploadModal: !this.data.showUploadModal
    });
  },
  /**
   * 获取系统头像
   */
  _getDefaultAvatarUrl: function() {
    this.setData({
      defaultAvatarUrl: wx.getStorageSync('default_avatarurl')
    });
  },
  /**
   * 选择系统头像
   */
  _chooseAvatar: function(e) {
    var index = e.currentTarget.dataset.idx;
    var url = e.currentTarget.dataset.url;
    this.data.selectedUrl = url;
    this.setData({
      selectedAvatar: index
    });
  },
  /**
   * 关闭模态框
   */
  _closeModal: function() {
    this.setData({
      showUploadModal: false
    });
  },
  /**
   * 上传系统头像
   */
  _chooseDefaultAvatar: function() {
    var that = this;
    wx.showLoading({
      title: '',
    })
    indexM._uploadAvatar(that.data.selectedUrl, (res) => {
      if (res.status == 1) {
        that.setData({
          uploadAvatar: that.data.selectedUrl,
          showUploadModal: false
        });
        that._syncUserInfo(that.data.selectedUrl);
      }
      wx.hideLoading();
    });
  },
  /**
   * 选择相册头像
   */
  _chooseImageFromAlbum: function() {
    var that = this;
    that._aliUploader(['album'])

  },
  /**
   * 选择相机头像
   */
  _chooseImageFromCamera: function() {
    var that = this;
    that._aliUploader(['camera'])
  },
  /**
   * 交给阿里上传
   */
  _aliUploader: function(sourceType) {
    var that = this;
    cy.aliChooseUpload(sourceType, 'userAvatar/', url => {
      indexM._uploadAvatar(url, (res) => {
        if (res.status == 1) {
          that.setData({
            uploadAvatar: url,
            showUploadModal: false
          });
          that._syncUserInfo(url);
        }
        wx.hideLoading();
      });
    })

  },
  /**
   * 同步我的信息
   */
  _syncUserInfo: function(newUrl) {
    var userinfo = wx.getStorageSync('userinfo');
    userinfo.avatarUrl = newUrl;
    wx.setStorageSync('userinfo', userinfo);
  },
  /**
   * 编辑名字
   */
  _editName: function() {
    wx.navigateTo({
      url: '../editName/editName',
    })
  },
  /**
   * 收藏页
   */
  _goCollection() {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  /**
   * 充值
   */
  _goCharge: function() {
    var systemInfo = wx.getSystemInfoSync()
    if (systemInfo.platform == 'ios') {
      wx.showModal({
        title: '提醒',
        content: '由于苹果公司规定，无法在小程序中进行支付。可下载‘亲家来了’继续操作',
        showCancel: false,
        confirmText: '知道了'
      })
      return;
    }
    console.log(systemInfo)
    wx.navigateTo({
      url: '../charge/charge',
    })
  },
  /**
   * 认证
   */
  _goIdentify: function() {
    var that = this;
    console.log(that.data.userInfo.certification)
    switch (that.data.userInfo.certification) {
      case 0:
        wx.navigateTo({
          url: '../certified/certified',
        });
        break;
      case 1:
        wx.showToast({
          title: '已认证',
        });
        break;
      case 2:
        wx.showToast({
          title: '正在审核',
          icon: 'none'
        });
        break;
      case 3:
        wx.navigateTo({
          url: '../certified/certified',
        });
        break;
    }

  }
})