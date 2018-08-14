import { base } from '../../utils/base.js';

class homeModel extends base {
  constructor() {
    super();
  }

  _getRecommondChildren(page, callback){
    var params = {
      url: 'list/recommendation',
      method: 'GET',
      data: {page: page,type: 1},
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

}

export{ homeModel }

