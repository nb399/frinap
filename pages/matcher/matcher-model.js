import { base } from '../../utils/base.js';

class matcherModel extends base {
  constructor() {
    super();
  }

  _getRecommondChildren(page, callback) {
    var params = {
      url: 'user/matchmakers',
      method: 'GET',
      data: { page: page, type: 1 },
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

}

export { matcherModel }

