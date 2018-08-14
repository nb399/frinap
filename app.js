//app.js
require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js').default
import {
  config
} from './utils/config.js';
var timeout=0;

//检查更新
const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })

})

updateManager.onUpdateFailed(function () {
  // 新的版本下载失败
  wx.showToast({
    title: '下载失败，请退出重试',
  })
})

App({
  getRoomPage: function() {
    return this.getPage("pages/msg/chat/chat")
  },
  getChatListPage() {
    return this.getPage("pages/msg/index/index")
  },
  getPage: function(pageName) {
    var pages = getCurrentPages()
    return pages.find(function(page) {
      return page.__route__ == pageName
    })
  },
  onLaunch: function(options) {
    this.globalData.scene=options.scene
    //调用API从本地缓存中获取数据
    var that = this
    //如果已登录，则登录环信
    // if (wx.getStorageSync('token')) {
    //   that._hxlogin();
    // }
    if (wx.getStorageSync('userinfo') && !wx.getStorageSync('userinfo').identity) {
      wx.reLaunch({
        url: '/pages/guide/guide',
      })
    }
    var msgCount = wx.getStorageSync('msgCount') || 0;
    wx.setStorageSync('msgCount', msgCount);
    if (msgCount > 0) {

      wx.setTabBarBadge({
        index: 2,
        text: msgCount.toString()
      })
    }

    WebIM.conn.listen({
      onOpened: function(message) {
        console.log('onOpened', message)
        wx.setStorageSync('QaccessToken', message.accessToken)
        WebIM.conn.setPresence()
      },
      onClosed: function(message) {
        console.log('onClosed')
        //   console.log('WebSocket连接已经关闭!');
        //   console.log('我要重连啦！');
        //  that._hxlogin();
      },
      onPresence: function(message) {
        console.log('onPresence', message)
        switch (message.type) {
          case "unsubscribe":
            pages[0].moveFriend(message);
            break;
          case "subscribe":
            if (message.status === '[resp:true]') {
              return
            } else {
              pages[0].handleFriendMsg(message)
            }
            break;
          case "joinChatRoomSuccess":
            console.log('Message: ', message);
            wx.showToast({
              title: "JoinChatRoomSuccess",
            });
            break;
          case "memberJoinChatRoomSuccess":
            console.log('memberMessage: ', message);
            wx.showToast({
              title: "memberJoinChatRoomSuccess",
            });
            break;
          case "memberLeaveChatRoomSuccess":
            console.log("LeaveChatRoom");
            wx.showToast({
              title: "leaveChatRoomSuccess",
            });
            break;
        }
      },
      onRoster: function(message) {
        console.log('onRoster', message)
        var pages = getCurrentPages()
        if (pages[0]) {
          pages[0].onShow()
        }
      },
      onVideoMessage: function(message) {
        console.log('onVideoMessage: ', message);
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveVideo(message, 'video')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'video',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'video' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function() {
                //console.log('success')
              }
            })
          }
        }
      },
      onAudioMessage: function(message) {
        console.log('onAudioMessage', message)
        var page = that.getRoomPage();
        var chatPage = that.getChatListPage();
        console.log(chatPage)

        if (message) {

          if (page && JSON.parse(page.options.username).your == message.from) {
            console.log('in page')
            page.receiveMsg(message, 'audio')
            var chatList = wx.getStorageSync('chatList') || [];
            var haveNewList = wx.getStorageSync('haveNewList') || [];
            var lastTime = wx.getStorageSync('lastTime') || [];
            var lastDialog = wx.getStorageSync('lastDialog') || [];
            var value = WebIM.parseEmoji(message.url.replace(/\n/mg, ''))
            var time = WebIM.time()
            
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'audio',
                data: value
              },
              style: '',
              time: time,
              mid: 'audio' + message.id
            }
            console.log("Audio msgData: ", msgData);
            let index = chatList.indexOf(msgData.yourname);

            lastDialog[index] = {
              type: 'audio',
              data: [{
                data: "语音",
                type: 'audio'
              }]
            };
            
            chatList = that.MoveEleToArrHeader(index, chatList);
            haveNewList = that.MoveEleToArrHeader(index, haveNewList);
            lastTime = that.MoveEleToArrHeader(index, lastTime);
            lastDialog = that.MoveEleToArrHeader(index, lastDialog);

            wx.setStorageSync('chatList', chatList);
            wx.setStorageSync('haveNewList', haveNewList);
            wx.setStorageSync('lastTime', lastTime);
            wx.setStorageSync('lastDialog', lastDialog);
            wx.setStorageSync('lastDialog', lastDialog);
          } else {


            var options = {
              url: message.url,
              header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'audio/mp3',
                'Authorization': 'Bearer ' + message.accessToken
              },
              success: function(res) {
                console.log('downloadFile success Play', res);
                message.url = res.tempFilePath

                //msgCount未读消息数
                console.log('out page')
                var msgCount = wx.getStorageSync('msgCount') || 0;
                msgCount++;
                wx.setStorageSync('msgCount', msgCount);
                if (msgCount > 0) {
                  wx.setTabBarBadge({
                    index: 2,
                    text: msgCount.toString()
                  })
                }
                var chatMsg = that.globalData.chatMsg || []
                var value = WebIM.parseEmoji(message.url.replace(/\n/mg, ''))
                var time = WebIM.time()
                var msgData = {
                  info: {
                    from: message.from,
                    to: message.to
                  },
                  username: message.from,
                  yourname: message.from,
                  msg: {
                    type: 'audio',
                    data: value
                  },
                  style: '',
                  time: time,
                  mid: 'audio' + message.id
                }
                //聊天列表和小红点相关--------------开始
                var chatList = wx.getStorageSync('chatList') || [];
                var haveNewList = wx.getStorageSync('haveNewList') || [];
                var lastTime = wx.getStorageSync('lastTime') || [];
                var lastDialog = wx.getStorageSync('lastDialog') || [];
                if (!wx.getStorageSync(msgData.yourname + message.to)) {
                  console.log('初次会话')
                  chatList.unshift(msgData.yourname);
                  haveNewList.unshift(1);
                  lastTime.unshift(time);
                  lastDialog.unshift(msgData);
                 
                } else {
                  console.log('继续会话', msgData.yourname)
                  let index = chatList.indexOf(msgData.yourname);
                  haveNewList[index]++;
                }
                chatMsg = wx.getStorageSync(msgData.yourname + message.to) || [];
                chatMsg.push(msgData);
                let index = chatList.indexOf(msgData.yourname);
                console.log(haveNewList[index]);
                lastTime[index] = time;
                lastDialog[index] = {
                  type: 'audio',
                  data: [{
                    data: "语音",
                    type: 'audio'
                  }]
                };

                chatList = that.MoveEleToArrHeader(index, chatList);
                haveNewList = that.MoveEleToArrHeader(index, haveNewList);
                lastTime = that.MoveEleToArrHeader(index, lastTime);
                lastDialog = that.MoveEleToArrHeader(index, lastDialog);

                wx.setStorageSync('chatList', chatList);
                wx.setStorageSync('haveNewList', haveNewList);
                wx.setStorageSync('lastTime', lastTime);
                wx.setStorageSync('lastDialog', lastDialog);
                //聊天列表和小红点相关--------------结束
                wx.setStorage({
                  key: msgData.yourname + message.to,
                  data: chatMsg,
                  success: function() {}
                })
                if (chatPage) {
                  chatPage._getContactedList();
                }
              },
              fail: function(e) {
                console.log('downloadFile failed', e);
              }
            };
            wx.downloadFile(options);
          }
        }
      },
      onLocationMessage: function(message) {
        console.log("Location message: ", message);
        var page = that.getRoomPage();
        var chatPage = that.getChatListPage();
        if (message) {
          that._updateDialog(message, 'location')
          if (page && JSON.parse(page.options.username).your == message.from) {
            page.receiveMsg(message, 'location');
            that._updateNewList(message, 'location',true);
          } else {
            //更新新消息
            that._updateNewList(message, 'location',false);
            if (chatPage) {
              chatPage._getContactedList();

            }
          }
        }
      },
      onTextMessage: function(message) {
        console.log("Text message: ", message);
        var page = that.getRoomPage();
        var chatPage = that.getChatListPage();
        var msgType = 'txt';
        if (message.ext.em_qinjia_replace_phone) {
          msgType = 'phone'
        } else if (message.ext.type == 1) {
          msgType = "meet"
        } else if (message.ext.type == 2) {
          msgType = "commission"
        }
        if (message) {
          that._updateDialog(message,msgType)
          if (page && JSON.parse(page.options.username).your == message.from) {
            page.receiveMsg(message, msgType)
            that._updateNewList(message, msgType,true);  
          } else {
            that._updateNewList(message, msgType,false);        
  
          }
          if (chatPage) {
            chatPage._getContactedList();
          }
        }
      },
      onEmojiMessage: function(message) {
        console.log('onEmojiMessage', message)
        var page = that.getRoomPage();
        var chatPage = that.getChatListPage();
        if (message) {
          that._updateDialog(message,'emoji')    
          if (page && JSON.parse(page.options.username).your == message.from) {
            page.receiveMsg(message, 'emoji')
            that._updateNewList(message, 'emoji', true);
          } else {
            //更新新消息
            that._updateNewList(message, 'emoji',false);
            if (chatPage) {
              chatPage._getContactedList();

            }
          }
        }
      },
      onPictureMessage: function(message) {
        console.log('Picture', message);
        var page = that.getRoomPage();
        var chatPage = that.getChatListPage();
        if (message) {
          that._updateDialog(message, 'img')
   
          if (page && JSON.parse(page.options.username).your == message.from) {
            page.receiveMsg(message, 'img');
            that._updateNewList(message, 'img', true);
          } else {
            //更新新消息
            that._updateNewList(message, 'img',false);
            if (chatPage) {
              chatPage._getContactedList();

            }
          }
        }
      },
      // 各种异常
      onError: function(error) {
        console.log('onError')
        console.log(error)
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {

          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            WebIM.conn.reconnect();
            return;
          }

          return;
        }

        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: '异地登陆',
            icon: 'loading',
            duration: 1000
          })
          that.relogin();
          return;
        }
      },
    })
  },
  relogin() {
    wx.clearStorageSync();
    wx.removeTabBarBadge({
      index: 2
    })
    WebIM.conn.close()
    wx.reLaunch({
      url: '/pages/mine/index/index',
    })
  },
  onShow: function() {
    var that = this;

    console.log('onshow')
    console.log('isopened', WebIM.conn.isOpened())
    console.log('isopening', WebIM.conn.isOpening())
    console.log('isclosed', WebIM.conn.isClosed())
    console.log('isclosing', WebIM.conn.isClosing())
    clearTimeout(timeout);
    if (wx.getStorageSync('token') && !WebIM.conn.isOpened() && !WebIM.conn.isOpening()) {
      that._hxlogin();
    }
   // that._hxlogin();
    wx.onSocketClose(function () {
      console.log('WebSocket连接已经关闭!');
      console.log('我要重连啦！');
      that._hxlogin();
    })
  },
  onHide:function(){
    
    timeout = setTimeout(function(){
      WebIM.conn.close();
      wx.onSocketClose(function () {
        console.log('WebSocket连接已经关闭!,我不重连，隐藏');
      })
    },1000)
    

  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function() {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //深度拷贝对象
  copyObj(a) {
    var c = {};
    c = JSON.parse(JSON.stringify(a));
    return c;
  },
  //更新消息
  _updateNewList(message,msgType,inCurrent) {
    var that = this;
    var time = WebIM.time()
    var value;
    if (msgType == 'emoji') {
      value = message.data
    }
    else if (msgType == 'location'){
      value = WebIM.parseEmoji(message.addr.replace(/\n/mg, ''))
    }
    else if (msgType == 'img') {
      value = WebIM.parseEmoji(message.url.replace(/\n/mg, ''))
    }
    else {
      value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
    }
    var msgData = {
      info: {
        from: message.from,
        to: message.to
      },
      username: message.from,
      yourname: message.from,
      msg: {
        type: msgType,
        data: value
      },
      style: '',
      time: time,
      mid: msgType + message.id
    }
    var newData = that.copyObj(msgData);
    var haveNewList = wx.getStorageSync('haveNewList') || [];
    var lastTime = wx.getStorageSync('lastTime') || [];
    var chatList = wx.getStorageSync('chatList') || [];
    var thisChat = wx.getStorageSync(newData.yourname + message.to);
    var chatMsg = that.globalData.chatMsg || [];
    var time = WebIM.time();
    //msgCount未读消息数
    if (!inCurrent){
      var msgCount = wx.getStorageSync('msgCount') || 0;
      msgCount++;
      wx.setStorageSync('msgCount', msgCount);
      if (msgCount > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: msgCount.toString()
        })
      }
    }

    if (!thisChat) {
      chatList.unshift(newData.yourname);
      lastTime.unshift(time);
      haveNewList.unshift(0);
    }
    let index = chatList.indexOf(newData.yourname);
    inCurrent ? haveNewList[index]=0:haveNewList[index]++;
    chatMsg = thisChat || [];
    chatMsg.push(newData);
    lastTime[index] = time;

    chatList = that.MoveEleToArrHeader(index, chatList);
    haveNewList = that.MoveEleToArrHeader(index, haveNewList);
    lastTime = that.MoveEleToArrHeader(index, lastTime);

    wx.setStorageSync('chatList', chatList)
    wx.setStorageSync('haveNewList', haveNewList);
    wx.setStorageSync('lastTime', lastTime);
    // wx.setStorageSync('lastDialog', lastDialog);
    //聊天列表和小红点相关--------------结束
    wx.setStorage({
      key: newData.yourname + message.to,
      data: chatMsg,
      success: function() {}
    })
  },
  //更新最新消息
  _updateDialog(message,msgType) {
    var that = this;
    var value;
    var chatList = wx.getStorageSync('chatList') || [];
    var lastDialog = wx.getStorageSync('lastDialog') || [];
    var DialogData = that.copyObj(message);
    if (msgType=='emoji'){
      value = DialogData.data
    }
    else if (msgType == 'location') {
      value = WebIM.parseEmoji(DialogData.addr.replace(/\n/mg, ''))
    }
    else if (msgType == 'img') {
      DialogData.url='图片'
      value = WebIM.parseEmoji(DialogData.url.replace(/\n/mg, ''))
    }
    else {
      value = WebIM.parseEmoji(DialogData.data.replace(/\n/mg, ''))
    }
    var time = WebIM.time()
    var msgData = {
      info: {
        from: DialogData.from,
        to: DialogData.to
      },
      username: DialogData.from,
      yourname: DialogData.from,
      msg: {
        type: msgType,
        data: value
      },
      style: '',
      time: time,
      mid: msgType + DialogData.id
    }


    let index = chatList.indexOf(msgData.yourname);
    if (index === -1) {
      lastDialog.unshift(msgData.msg);
    } else {
      lastDialog[index] = msgData.msg;
      lastDialog = that.MoveEleToArrHeader(index, lastDialog);

    }
    wx.setStorageSync('lastDialog', lastDialog);
  },
  /**
 * 将该元素移至数组头部
 */
  MoveEleToArrHeader(index, arr) {
    let temp = arr[index];
    for (let i = index; i > 0; i--) {
      arr[i] = arr[i - 1]
    }
    arr[0] = temp;
    return arr;
  },
  //环信登录
  _hxlogin: function() {
    var that = this;
    var myusername = wx.getStorageSync('hxname');
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: myusername,
      pwd: config.hxpwd,
      grant_type: 'password',
      appKey: WebIM.config.appkey
    }
    wx.setStorage({
      key: "myUsername",
      data: myusername
    })


    WebIM.conn.open(options)


    wx.onSocketClose(function() {
      console.log('WebSocket连接已经关闭!');
      console.log('我要重连啦！');
      that._hxlogin();
    })
  },

  globalData: {
    userInfo: null,
    chatMsg: [],
    //为了方便，把环信id和是否有新消息的标记分开放
    chatList: [],
    haveNewList: [],
    lastTime: [],
    lastDialog: [],
    savePageForLogin:'',
    savePageForReal:''
  }
})