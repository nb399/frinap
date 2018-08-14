import { base } from '../../utils/base.js';
var WxRequest =require('../../utils/wxRequest.js');
class children_model extends base{
  constructor(){
    super();
  }

  _collect(id,child_id,callback){
    var params = {
      url: 'user_collection',
      method: 'POST',
      data: { id: id, child_id: child_id},
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _getChildDetail(id){
    var params = {
      url: 'children/detail_info/' + id,
      method: 'GET',
    }
    return WxRequest._Prequest(params);
  }

  _getMatcherDetail(id) {
    var params = {
      url: 'user/matchmaker/' + id,
      method: 'GET',
    }

    return WxRequest._Prequest(params);
    
  }

  _buyChatChance(user_id,child_id,callback){
    var params = {
      url: 'user/chitchat',
      method: 'POST',
      data: {user_id:user_id,child_id:child_id},
      callback: function (res) {
        let userinfo= wx.getStorageSync('userinfo');
        userinfo.tangtuan_coin-=5;
        wx.setStorageSync('userinfo', userinfo)
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _buyViewChance(user_id, child_id, callback){
    var params = {
      url: 'user/album',
      method: 'POST',
      data: { user_id: user_id, child_id: child_id },
      callback: function (res) {
        let userinfo = wx.getStorageSync('userinfo');
        userinfo.tangtuan_coin -= 2;
        wx.setStorageSync('userinfo', userinfo)
        callback && callback(res);
      }
    }

    this._request(params);
  }
}

export { children_model }