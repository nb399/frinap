import { base } from '../../../utils/base.js';
class collectionModel extends base{
  constructor(){
    super();
      }
      _getCollectionList(callback){
        var params={
          url:'user_collection_list',
          method:'GET',
          callback: function (res) {
            callback && callback(res);
          }
        }
        this._request(params);
      }
      _deleteCollect(id, callback) {
        var params = {
          url: 'user_collection/'+id,
          method: 'DELETE',
          callback: function (res) {
            callback && callback(res);
          }
        }

        this._request(params);
      }
}
export { collectionModel};