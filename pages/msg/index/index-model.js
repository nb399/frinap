import { base } from '../../../utils/base.js';

class indexModel extends base {
  constructor() {
    super();
  }

  _buyChatChance(user_id, child_id, callback) {
    var params = {
      url: 'user/chitchat',
      method: 'POST',
      data: { user_id: user_id, child_id: child_id },
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }
  
  _getContactedList(id_str, callback) {
    var params = {
      url: 'user/chitchat_list',
      method: 'GET',
      data: { easemob_id: id_str },
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

}

export { indexModel }