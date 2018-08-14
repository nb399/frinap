import { base } from '../../utils/base.js';
class guideModel extends base{
constructor(){
  super();
}

_getUserInfo(callback) {
  var params = {
    url: 'user_profile',
    method: 'GET',
    callback: function (res) {
      callback && callback(res);
    }
  }

  this._request(params);
}
_getSelectOptions(callback) {
  var params = {
    url: 'options_list',
    method: 'GET',
    callback: function (res) {
      callback && callback(res);
    }
  }

  this._request(params);
}

_saveChildrenInfo(data, callback) {
  var params = {
    url: 'user/basicinfo',
    data: data,
    method: 'POST',
    callback: function (res) {
      callback && callback(res);
    }
  }
  this._request(params);
}

}
export { guideModel }