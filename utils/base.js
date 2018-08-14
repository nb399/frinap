import {config} from 'config.js';
import {Token} from 'token.js';
var cy=require('./H_qjll/cy.js')
var token = new Token();
var app = getApp();

class  base{
  constructor(){
    this.requestUrl = config.requestUrl;
  }

  _request(params,noRefetch){
    var that = this;
    params.method = params.method ? params.method : 'GET'; 
    wx.request({
      url: this.requestUrl+params.url,
      method: params.method,
      data: params.data,
      header:{  
        'content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: function(res){
        console.log(res)
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if(startChar == '2'){
          params.callback && params.callback(res.data);
        }else{
          if(code=='401'){
            if (!noRefetch){
              wx.showToast({
                title: '信息有误，请登陆重试',
                duration: 1500,
                icon: 'none',
              })
              setTimeout(function () {
                app.relogin()
              }, 1500)
            }
          }else if(code == '400'){
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }else if(code == '500'){
            wx.showToast({
              title: '信息有误，请稍后重试！',
              icon: 'none'
            })
          }
          if(noRefetch){
            params.ecallback && params.ecallback(res.data);
          }

          wx.hideLoading();
        }
      },
      fail: function(error){
        params.ecallBack && params.ecallBack(error);
      }
    })
  }

  _refetch(params){
    token.getTokenFromServer((res)=>{
      this._request(params,true);
    }); 
  }
}

export {base};