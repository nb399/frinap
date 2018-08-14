import { base } from '../../../utils/base.js';

class certifiedModel extends base {
  constructor() {
    super();
  }
  _idenAuthentication(param,callback){
    var params={
      url:'user/idenAuthentication',
      data: { name: param.name, idcard: param.idcard, idCardImg_f: param.idCardImg_f, idCardImg_b: param.idCardImg_b},
      method:'POST',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
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

}

export { certifiedModel }