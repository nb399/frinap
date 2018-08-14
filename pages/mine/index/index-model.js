import { base } from '../../../utils/base.js';

class indexModel extends base{
  constructor() {
    super();
  }

  _getUserInfo(callback){
    var params = {
      url: 'user_profile',
      method: 'GET',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _getVerifyCode(tel, callback){
    var params = {
       url: 'verify_code',
       method: 'POST',
       data: {tel:tel},
       callback: function (res) {
         callback && callback(res);
      }
    }
    this._request(params);
  }
  /**向服务器传送code */
  _postCode(code,callback){
    var params = {
      url: 'user/save_openid',
      method: 'POST',
      data: { code: code },
      callback: function (res) {
        callback && callback(res);
      }
    }
    this._request(params);
  }
  /**微信获取手机号直接登陆 */
  _getTokenTirect(code,encryptedData,iv,callback){
    var params = {
      url: 'oauth/token3?type=1',
      method: 'POST',
      data: { code:code,encryptedData: encryptedData, iv: iv },
      callback: function (res) {
        callback && callback(res);
      }
    }
    this._request(params);
  }
  _getToken(tel,code,callback){
    var params = {
      url: 'oauth/token1?type=1',
      method: 'POST',
      data: { tel: tel, code: code },
      callback: function (res) {
        callback && callback(res);
      }
    }
    this._request(params);
  }

  _getUptoken(callback) {
    var params = {
      url: 'qiniu/token',
      method: 'GET',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _uploadAvatar(url, callback){
    var params = {
      url: 'userinfo',
      method: 'POST',
      data: {avatarUrl:url},
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }
}

export { indexModel }