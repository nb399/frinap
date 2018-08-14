var Promise = require('../es6-promise.js');
var WxRequest = require('../wxRequest.js');
var PageUrl = require('../PageUrl.js');
// var myCache = require('../wcache.js');
// const qiniuUploader = require("../qiniuUploader");
var app = getApp();

function checkPic(filePath) {
  var params = {
    url: "check/pic",
    method: 'POST',
    data: {
      url: filePath
    }
  }
  return WxRequest._Prequest(params);
}
/**
 * 生成随机字符串（时间+）
 */
function randomChar(l) {
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var tmp = "";
  var timestamp = new Date().getTime();
  for (var i = 0; i < 4; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return timestamp + tmp;
}
/**
 * 解析&参数
 */
function parseUrl(query) {
  var queryArr = query.split("&");
  var obj = {};
  queryArr.forEach(function(item) {
    var value = item.split("=")[0];
    var key = item.split("=")[1];
    obj[value] = key;
  });
  return obj;
}
/**
 * 从服务器更新用户本地信息
 */
function updateLocalInfo(that) {
  let params = {
    url: 'user_profile',
    method: 'GET',
  }
  WxRequest._Prequest(params).then(res => {
    console.log(res);
    wx.setStorageSync('userinfo', res.data)
    that.setData({
      userinfo: res.data
    })
  }, res => {
    console.log('updateLocalInfo：网络错误')
  })
}
/**
 * 未登录提示
 */
function promptNotLoggedIn() {
  wx.showToast({
    title: '您还没有登录',
    icon: 'none',
    duration: 1500,
    success() {
      setTimeout(function() {
        wx.switchTab({
          url: '/pages/mine/index/index',
        })
      }, 1500)
    }
  })
}
/**
 * 获取七牛上传toeken,并设置uptoken缓存时间
 */
function getUptokenFromServer() {
  return new Promise(function(resolve, reject) {
    let uptoken = myCache.get('uptoken');
    if (uptoken) {
      resolve(uptoken)
    } else {
      let params = {
        url: 'qiniu/token',
        method: 'GET',
      }
      WxRequest._Prequest(params).then(res => {
        myCache.put('uptoken', res.data.uptoken, 3500);
        resolve(res.data.uptoken)
      })
    }
  })


}
/**
 * 选择图片阿里云上传一张
 */
function aliChooseUpload(sourceType, saveDir, cb) {
  var that = this;
  var imgKey = Date.parse(new Date()) + '.jpg';
  // 选择图片
  wx.chooseImage({
    count: 1,
    sourceType: sourceType,
    success: function(res) {
      console.log(res)
      wx.showLoading({
        title: '正在上传',
      })
      var filePath = res.tempFilePaths[0];
      var upUrl = 'https://qingjia.oss-cn-hangzhou.aliyuncs.com';
      let fileId = randomChar();
      wx.uploadFile({
        url: upUrl,
        filePath: filePath,
        name: 'file',
        formData: {
          name: filePath,
          key: saveDir + fileId,
          policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==',
          OSSAccessKeyId: 'LTAIUcFgIjn4866y',
          signature: 'C4p+vVZZNfyXw4cudKeToUOr2bs=',
          success_action_status: "200"
        },
        success: function(res) {
          let imageurl = upUrl + '/' + saveDir + fileId;
          checkPic(imageurl).then(safedata => {
            wx.hideLoading();
            if (!safedata.status) {
              wx.showToast({
                title: '图片有敏感信息',
                icon: 'none'
              })
            }
            else{
              cb(imageurl)
            }
          })
        }
      })



    }
  })
}
/**
 * 选择图片七牛上传一张
 */
function qiniuChooseUpload(sourceType, cb) {
  var that = this;
  var imgKey = Date.parse(new Date()) + '.jpg';
  // 选择图片
  wx.chooseImage({
    count: 1,
    sourceType: sourceType,
    success: function(res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      getUptokenFromServer().then(uptoken => {
        wx.showLoading({
          title: '0%',
        })
        qiniuUploader.upload(filePath, (res) => {
          cb(res)
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          domain: 'p7cwdv69q.bkt.clouddn.com',
          key: imgKey,
          uptoken: uptoken,
        }, (res) => {
          wx.showLoading({
            title: res.progress + '%',
          })
        });
      })

    }
  })
}
/**
 * 预览相册
 */
function previewImage(album, e) {
  var url = e.currentTarget.dataset.url;
  var urls = [];
  for (var i = 0; i < album.length; i++) {
    urls[i] = album[i]['image_url']
  }
  wx.previewImage({
    current: url, // 当前显示图片的http链接
    urls: urls // 需要预览的图片http链接列表
  })
}
/**
 * 验证电话号码格式
 */
function isPoneAvailable(tel) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(tel)) {
    wx.showToast({
      title: '手机号格式不正确！',
      icon: 'none'
    });
    return false;
  } else {
    return true;
  }
}
/**
 * 验证用户是否登陆
 */
function isLogined(that) {
  let token = wx.getStorageSync('token')
  return new Promise(function(reslove, reject) {
    if (token) {
      that.setData({
        userinfo: wx.getStorageSync('userinfo')
      })
      reslove(true)
    } else {
      wx.showToast({
        title: '您还未登录',
        icon: 'none',
        duration: 1500
      })
      reject('没有token')
      setTimeout(function() {
        let tempPage = PageUrl.getCurrentPageUrlWithArgs()
        app.globalData.savePageForLogin = tempPage;
        wx.switchTab({
          url: '/pages/mine/index/index'
        })
      }, 1500)
    }
  })
}
/**
 * 验证本地用户是否实名认证
 */
function isLocalCertifyed() {
  let userinfo = wx.getStorageSync('userinfo');
  return new Promise(function(reslove, reject) {
    if (userinfo.certification == 1) {
      reslove(true)
    } else {
      reslove(false)
    }

  })
}
module.exports = {
  updateLocalInfo: updateLocalInfo,
  promptNotLoggedIn: promptNotLoggedIn,
  qiniuChooseUpload: qiniuChooseUpload,
  previewImage: previewImage,
  isPoneAvailable: isPoneAvailable,
  isLogined: isLogined,
  isLocalCertifyed: isLocalCertifyed,
  parseUrl: parseUrl,
  randomChar: randomChar,
  aliChooseUpload: aliChooseUpload
}