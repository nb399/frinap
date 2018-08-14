// pages/mine/certified/certified.js

var cy=require('../../../utils/H_qjll/cy.js');
import {
  certifiedModel
} from 'certified-model.js';
var certifiedM = new certifiedModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      id: {
        title: '身份证号码',
        name: "id",
        placeholder: '请填写您的身份证号码',
        right: true
      },
      name: {
        title: '姓名',
        name: 'name',
        placeholder: '请填写您的姓名',
        inputType: 'text',
        right: true
      },
      photo: {
        title: '  请上传身份证正面照片',
        disabled: true,
      }
    },
    text: '1.请保持认证照片中的姓名、身份证号、身份证照片等信息清晰可见; \n 2.实名认证信息只做审核别人无法看到; \n 3.实名认证成功后不可再重复提交; \n 	4.示例照片中为了保护个人隐私,隐藏了身份证信息;',
    current_img: ['', ''],
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 提交认证
   */
  formSubmit(event) {
    var that=this;
    let param = {
      name: event.detail.value.name,
      idcard: event.detail.value.id,
      idCardImg_f: that.data.idCardImg_f,
      idCardImg_b: that.data.idCardImg_b
    }
    if (!param.name) {
      wx.showToast({
        title: '姓名未填写',
        icon: "none"
      })
      return;
    }
    if (!param.idcard) {
      wx.showToast({
        title: '身份证号码未填',
        icon: "none"
      })
      return;
    }
    if (!param.idCardImg_f) {
      wx.showToast({
        title: '未上传证件正面照',
        icon: "none"
      })
      return;
    }
    if (!param.idCardImg_b) {
      wx.showToast({
        title: '未上传证件反面照',
        icon: "none"
      })
      return;
    }
    certifiedM._idenAuthentication(param, (res) => {
      var userInfo=wx.getStorageSync('userinfo')
      userInfo.certification=2
      wx.setStorageSync('userinfo', userInfo)
      if(res.status){
        wx.showToast({
          title: "请等待审核"
        })    
        wx.switchTab({
          url: '/pages/mine/index/index',
        })
      }
    })
  },
  
  /**
   * 选择照片并上传
   */
  _chooseImg(e) {
    console.log(e)
    var current = e.currentTarget.dataset.index;
    var that = this;
    cy.aliChooseUpload(['camera','album'],'userCertify/',url=>{
      if (current == 0) {
        that.setData({
          'current_img[0]': url,
          idCardImg_f: url
        })
      } else {
        that.setData({
          'current_img[1]': url,
          idCardImg_b: url
        })
      }
      wx.hideLoading();
    })
  },
})