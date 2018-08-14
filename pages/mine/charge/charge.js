// pages/mine/charge/charge.js
import {
  chargeModel
} from './charge-model.js';
var cy=require('../../../utils/H_qjll/cy.js');
const chargeM = new chargeModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packagesList: [],
    package_id: 1,
    selectedPackage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getPackagesModel();
    this._getUserInfo();
  },
  _getUserInfo() {
    var userinfo = wx.getStorageSync('userinfo');
    this.setData({
      userinfo: userinfo
    })
  },

/**
 * 直接支付
 */
  byNow() {
    var that = this;
    var package_id = that.data.package_id;
    var uid = wx.getStorageSync('userinfo').id
    chargeM._payPackage(uid, package_id, (res) => {
      console.log(res)
      let payData = res.data.wxpay;
      wx.requestPayment({
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.package,
        signType: payData.signType,
        paySign: payData.paySign,
        success(res) {
          console.log(res)
          wx.showToast({
            title: '支付成功',
          })
          cy.updateLocalInfo(that);
        },
        fail(res) {
          console.log(res)
        }
      })
    })
  },
  /**
   * 获取充值包
   */
  _getPackagesModel: function() {
    chargeM._getPackagesList((res) => {
      if (!res.status) {
        return;
      }
      this.setData({
        selectedPackage: this.data.selectedPackage,
        packagesList: res.data
      });
    });
  },
/**
 * 选择充值
 */
  _selectPackage: function(e) {
    var data = e.currentTarget.dataset;
    var index = data.index;
    var id = data.id;
    this.setData({
      selectedPackage: index,
      package_id: id
    });
  }
})