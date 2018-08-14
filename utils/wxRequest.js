var Promise = require('es6-promise.js')
import { config } from 'config.js';
import { Token } from 'token.js';
var token = new Token();
var requestUrl = config.requestUrl;
var app=getApp();

function wxPromisify(fn, noRefetch) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          console.log(res)
          resolve(res.data)
        } else {
          if (code == '401') {
            if (!noRefetch) {
              wx.showToast({
                title: '信息有误，请登陆重试',
                duration: 1500,
                icon: 'none',
              })
              setTimeout(function () {
                app.relogin()
              }, 1500)
            }
          } else if (code == '400') {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else if (code == '500') {
            wx.showToast({
              title: '信息错误，请稍后重试！',
              icon: 'none'
            })
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/home/home',
              })
            },1000)
          }
          if (noRefetch) {
      
            resolve(res.data)
          }

          wx.hideLoading();
        }
      }
        
      
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function _Prequest(params, noRefetch) {
  var getRequest = wxPromisify(wx.request, noRefetch)
  return getRequest({
    url: requestUrl + params.url,
    method: params.method,
    data: params.data,
    header: {
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + wx.getStorageSync('token')
    },
  })
}



module.exports = {
  _Prequest: _Prequest,

}