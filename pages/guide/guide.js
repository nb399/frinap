// pages/guide/guide.js
const Toast = require('../../dist/toast/toast');
import cityData from '../../utils/citys.js';
var WebIM = require('../../utils/WebIM.js').default;
import {
  guideModel
} from 'guide-model.js';
var guideM = new guideModel();
var app=getApp();

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1890; i < date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
const heightData = [];
for (let i = 100; i < 260; i++) {
  heightData.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: [
      ['与孩子关系','招女婿/嫁女儿更快捷'],
      ['您小孩的性别是？'],
      ['您孩子的工作地区？'],
      ['您孩子的身高是？'],
      ['您孩子的生日是？'],
      ['您孩子的学历是？'],
      ['您孩子的职业是？'],
      ['您孩子的月收入？'],
    ],
    heightValue: [60],
    dateValue: [100, 8, 20],
    jobValue: [2],
    salaryValue: [2],
    cityValue: [1, 0],
    currentC_01: '',
    currentC_02: '',
    currentC_05: '',
    currentCity: 5,
    years: years,
    months: months,
    days: days,
    educationList: [],
    relationList: [],
    sexImgList: ['/images/girl.png', '/images/boy.png'],
    heightList: heightData,
    currentQ: 0,
    loading:1,
    showModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    cityData.init(that);

    guideM._getSelectOptions((res) => {
      that.setData({
        options: res.data,
        relationList: res.data.relationship_name,
        educationList: res.data.education,
        jobList: res.data.jobs,
        salaryList: res.data.salary,
        sexList: res.data.sex,
        loading:0
      });
     
    });
    that.setData({
      cityValue: [5, 2],
    })
    wx.setNavigationBarTitle({
      title: '完善资料（' + (that.data.currentQ + 1) + '/8）',
    })
  },
  _toggleModal(){
    this.setData({
      showModal: !this.data.showModal
    })

      wx.switchTab({
        url: '/pages/mine/index/index',
      })
  },
  _getUserInfo: function (cb) {
    var that = this;
    guideM._getUserInfo((res) => {
      if (res.status == 1) {
        wx.setStorageSync('userinfo', res.data);
      }
    });
  },
  //其他账号登陆
  _otherLogin(){
    wx.showModal({
      title: '切换账号',
      content: '是否清除缓存，切换账号',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.removeTabBarBadge({
            index: 2
          })
          WebIM.conn.close()
          wx.reLaunch({
            url: '/pages/mine/index/index',
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindChange(e) {
    var that = this;
    console.log(e)
    if (e.currentTarget.id == 'Q2') {
      console.log(e.currentTarget.id)
      let currentCity = e.detail.value[0];
      that.setData({
        currentCity: currentCity,
        cityValue: [e.detail.value[0], e.detail.value[1]]
      })
    }
    if (e.currentTarget.id == 'Q3') {
      let currentHeight = e.detail.value[0];
      that.setData({
        heightValue: [currentHeight]
      })
    }
    if (e.currentTarget.id == 'Q4') {
      let currentYear = e.detail.value[0];
      let currentMonth = e.detail.value[1];
      let currentDay = e.detail.value[2];
      that.setData({
        dateValue: [currentYear, currentMonth, currentDay]
      })
      console.log(years[currentYear] + '-' + months[currentMonth] + '-' + days[currentDay])
    }
    if (e.currentTarget.id == 'Q6') {
      let currentJob = e.detail.value[0];
      that.setData({
        jobValue: [currentJob]
      })
    }
    if (e.currentTarget.id == 'Q7') {
      let currentSalary = e.detail.value[0];
      that.setData({
        salaryValue: [currentSalary]
      })
    }


  },
  previousStep() {
    var that = this;
    that.setData({
      currentQ: --that.data.currentQ
    })
    wx.setNavigationBarTitle({
      title: '完善资料（' + (that.data.currentQ + 1) + '/8）',
    })
  },
  nextStep() {
    var that = this;
    that.setData({
      currentQ: ++that.data.currentQ
    })
    wx.setNavigationBarTitle({
      title: '完善资料（' + (that.data.currentQ + 1) + '/8）',
    })
  },
  subInfo() {
    var that = this;
    that.setData({
      loading: true
    })
    wx.setNavigationBarTitle({
      title: '正在完善',
    })
    var _data = that.data;
    var currentYear = _data.dateValue[0];
    var currentMonth = _data.dateValue[1];
    var currentDay = _data.dateValue[2];
    var currentProvince = _data.cityData[_data.cityValue[0]].name;
    var currentCity = _data.cityData[_data.cityValue[0]].sub[_data.cityValue[1]].name;
    var data_sub = {
      identity: 1,
      relationship_name: _data.currentC_01,
      birth: years[currentYear] + '-' + months[currentMonth] + '-' + days[currentDay],
      sex: _data.currentC_02,
      height: _data.heightList[_data.heightValue[0]],
      education: _data.educationList[_data.currentC_05].id,
      job: _data.jobList[_data.jobValue[0]].id,
      salary: _data.salaryList[_data.salaryValue[0]].id,
      workplace: currentProvince + '-' + currentCity,
    }
    guideM._saveChildrenInfo(data_sub, (res) => {
      console.log(res)
      if (res.status == 1) {
        that._getUserInfo()
       that.setData({
         showModal:true
       })
      }
    })
  },
  chooseForOne(e) {
    var that = this;
    console.log(e)
    let currentChoosed = e.currentTarget.dataset.current
    that.setData({
      currentC_01: currentChoosed,
      currentQ: ++that.data.currentQ
    })
    wx.setNavigationBarTitle({
      title: '完善资料（' + (that.data.currentQ + 1) + '/8）',
    })
  },
  chooseForTwo(e) {
    var that = this;
    console.log(e)
    let currentChoosed = e.currentTarget.dataset.current
    that.setData({
      currentC_02: currentChoosed,
      currentQ: ++that.data.currentQ
    })
    wx.setNavigationBarTitle({
      title: '完善资料（' + (that.data.currentQ + 1) + '/8）',
    })
  },
  chooseForFive(e) {
    var that = this;
    console.log(e)
    let currentChoosed = e.currentTarget.dataset.current
    that.setData({
      currentC_05: currentChoosed,
      currentQ: ++that.data.currentQ
    })
    wx.setNavigationBarTitle({
      title: '完善资料（' + (that.data.currentQ + 1) + '/8）',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})