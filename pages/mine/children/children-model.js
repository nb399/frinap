import { base } from '../../../utils/base.js';


class childrenModel extends base{

  constructor(){
    super();
  }

    _getSelectOptions(callback){
      var params = {
        url: 'options_list',
        method: 'GET',
        callback: function (res) {
          callback && callback(res);
        }
      }

      this._request(params);
    }

  _getCurrentChild(callback){
    var params = {
      url: 'activity_child',
      method: 'GET',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _saveChildrenInfo(data,callback){
    var params = {
      url: 'children',
      data: data,
      method: 'POST',
      callback: function(res){
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

  _addImgToAlbum(data, callback) {
    var params = {
      url: 'album',
      method: 'POST',
      data: data,
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  _deleteFromAlbum(img_id,callback) {
    var params = {
      url: 'album/'+img_id,
      method: 'DELETE',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

  //编辑居住地
  _editLocation(location, callback) {
    var params = {
      url: 'userinfo',
      method: 'POST',
      data: { location: location },
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

}

export { childrenModel };