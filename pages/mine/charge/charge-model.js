import { base } from '../../../utils/base.js';

class chargeModel extends base {

  constructor() {
    super();
  }
  _payPackage(uid,package_id,callback){
   
    var params = {
      url: 'user/order',
      method: 'POST',
      data: { pay_type:'miniapp',id: uid, pay_id: package_id},
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }
  _getPackagesList(callback){
    var params = {
      url: 'packages_list',
      method: 'GET',
      callback: function (res) {
        callback && callback(res);
      }
    }

    this._request(params);
  }

}

export { chargeModel }