import { base } from '../../utils/base.js';

class matcher_model extends base {
  constructor() {
    super();
  }

  _collect(id, child_id, callback) {
    var params = {
      url: 'user_collection',
      method: 'POST',
      data: { id: id, child_id: child_id },
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _getChildDetail(id, callback) {
    var params = {
      url: 'children/detail_info/' + id,
      method: 'GET',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
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

  _buyViewChance(user_id, child_id, callback) {
    var params = {
      url: 'user/album',
      method: 'POST',
      data: { user_id: user_id, child_id: child_id },
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }
}

export { children_model }