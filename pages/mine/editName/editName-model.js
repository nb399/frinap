import { base } from '../../../utils/base.js';


class editNameModel extends base {

  constructor() {
    super();
  }

  _saveName(name, callback){
      var params = {
      url: 'userinfo',
      method: 'POST',
      data: { name: name },
      callback: function (res) {
        callback && callback(res);
      }
    }
    this._request(params);
  }
}

export { editNameModel }