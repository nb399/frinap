import {
  base
} from "../../../utils/base.js";
var WxRequest = require('../../../utils/wxRequest.js');
class ChatModel extends base {
  constructor() {
    super()
  }
  check(message) {
    var params = {
      url: "check/text",
      method: 'POST',
      data: {
        message: message
      }
    }
    return WxRequest._Prequest(params);
  }

}
export {
  ChatModel
}