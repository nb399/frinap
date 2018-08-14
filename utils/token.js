import {config} from "config.js";
class Token{
  constructor(){
    this.getTokenUrl = config.requestUrl + 'token/user';
    this.verifyTokenUrl = config.requestUrl + 'token';
  }

  verify(){
    var token = wx.getStorageSync('token');
    if(!token){
      this.getTokenFromServer();
    }else{
      this.verifyTokenByServer(token);
    }
  }

  getTokenFromServer(callBack){
    var that = this;
    wx.login({
      success: function(res){
        console.log(res.code);
        wx.request({
          url: that.getTokenUrl,
          method:'POST',
          data:{
            'code':res.code
          },
          success: function(res){
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token);
          }
        })
      }
    })
  }

  verifyTokenByServer(token){
    var that = this;
    wx.request({
      url: that.verifyTokenUrl,
      method: 'get',
      header: {
        'token': token
      },
      success: function (res) {
        var valid = res.data.isValid;
        if(!valid){
          that.getTokenFromServer();
        }
      }
    })
  }
}

export {Token};