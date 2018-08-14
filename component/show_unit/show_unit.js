// component/show_unit/show_unit.js
var cy=require('../../utils/H_qjll/cy.js')
Component({
  externalClasses: ['@font-face'],
  /**
   * 组件的属性列表
   */
  properties: {
    person: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal, changedPath) {
        this._showProfileNum()
      }
    },
    identity: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showProfileNum() {
      var that = this;
      var identity = that.data.identity;
      var data = that.properties.person;
      var profile = data.personal_profile || data.user_profile
      if (profile != null) {
        profile = that._iGetInnerText(profile);
        data['total_count'] = parseInt(profile.replace(/[^\x00-\xff]/g, "01").length / 2);
      } else {
        data['total_count'] = 0;
      }
      that.setData({
        person: data
      })
    },

    _iGetInnerText: function(testStr) {
      var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
      resultStr = testStr.replace(/[ ]/g, ""); //去掉空格
      resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
      return resultStr;
    },
    _childDetail(e) {
      var that = this;
      var child_id = e.currentTarget.dataset.id;
      var identify = that.properties.identity;
      var person = that.properties.person;
      var userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        if (userinfo.certification != 1 && person.parent && person.parent.certification==1) {
          wx.showModal({
            title: '操作提醒',
            content: '您还未完成实名认证，不能查看实名认证用户',
            confirmText: '前去认证',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/mine/index/index',
                })
              }
            }
          })
          return;
        }
        wx.navigateTo({
          url: '/pages/children_detail/children_detail?child_id=' + child_id + '&identify=' + identify,
        })
      } else {
        cy.promptNotLoggedIn()
      }
    },
  }
})