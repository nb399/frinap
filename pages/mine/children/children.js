// pages/mine/children/children.js
import { childrenModel } from 'children-model.js';
var tcity = require("../../../utils/citys.js");
var childrenM = new childrenModel();
const Toast = require('../../../dist/toast/toast');
var cy=require('../../../utils/H_qjll/cy.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show_spread_btn: 0,
    string_btn: '展开',
    style_btn: 'fa-angle-down',
    active: 0,
    //所有的选项，包括择偶条件那边的选项
    options:null,
    heightArr: null,
    weightArr: null,
    ageArr: null,
    heightRand: null,
    weightArr: null,
    ageRand: null,
    aeraData: null,
    //用来显示
    basicInfo:null,
    requirement:null,
    //用来提交
    basicInfo_sub:[],
    requirement_sub:[],

    cityData:[],
    provinces: [],
    citys: [],
    areaValue: [0,0],

    //上传图片相关
    uptoken: null,

    //是否是修改了个性签名
    isEditSignature: 0,
    uptoken:'',
    //用户选择的Location
    inputLoaction: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getUserInfo();
    this._getOptionList();
    this._getChildInfo();
    // this._getToken();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getInputSignature();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  _getToken: function(){
    var uptoken = myCache.get('uptoken');
    if (!uptoken) {
       this._getUptokenFromServer();
    }
    this.data.uptoken = uptoken;
  },

  _changeTab: function(e) {
    var current = e.detail .current;
    this.setData({
      active: current
    });
  },

  _changeTabByClick: function(e){
    var current = e.currentTarget.dataset.active;
    this.setData({
      active: current
    });
  },

  // 从服务器获取所有的选项列表
  _getOptionList: function(){
    this._initOptionsData();
    childrenM._getSelectOptions((res)=>{
      this.data.options = res.data;
      this.setData({
        options: res.data,
      });
    });
  },

//获取孩子的信息
  _getChildInfo: function(){
    var that = this;
    childrenM._getCurrentChild((res) => {
      if(res.data && res.status==1){
          that.data.basicInfo.name = res.data.hasOwnProperty('name') ? res.data.name: '未选择';
          that.data.basicInfo.album = res.data.album ? res.data.album : [];
          that.data.basicInfo.sex = res.data.sex ? res.data.sex.name : '未选择';
          that.data.basicInfo.minority = res.data.minority ? res.data.minority.name : '未选择';
          that.data.basicInfo.birth = res.data.birth ? res.data.birth : '未选择';
          that.data.basicInfo.height = res.data.height ? res.data.height : '未选择';
          that.data.basicInfo.weight = res.data.weight ? res.data.weight : '未选择';
          that.data.basicInfo.somatotype = res.data.somatotype ? res.data.somatotype.name : '未选择';
          that.data.basicInfo.salary = res.data.salary ? res.data.salary.name : '未选择';
          that.data.basicInfo.education = res.data.education ? res.data.education.name : '未选择';
          that.data.basicInfo.native_place = res.data.native_place ? res.data.native_place : '未选择';
          that.data.basicInfo.jobs = res.data.job ? res.data.job.name : '未选择';
          that.data.basicInfo.work_place = res.data.workplace ? res.data.workplace : '未选择';
          that.data.basicInfo.marital_status = res.data.marital_status ? res.data.marital_status.name : '未选择';
          that.data.basicInfo.car = res.data.car ? res.data.car.name : '未选择';
          that.data.basicInfo.house = res.data.house ? res.data.house.name : '未选择';
          that.data.basicInfo.have_children = res.data.have_children ? res.data.have_children.name : '未选择';
          that.data.basicInfo.dink = res.data.dink ? res.data.dink.name : '未选择';
          that.data.basicInfo.relationship_name = res.data.relationship_name? res.data.relationship_name.name : '未选择';
          that.data.basicInfo.personal_profile = res.data.personal_profile ? res.data.personal_profile : '';
          that.data.basicInfo_sub.id = res.data.id;

          //择偶条件
          if (res.data.requirement){
            that.data.requirement.age = res.data.requirement.age ? res.data.requirement.age:'未选择'; 
            that.data.requirement_sub.age = res.data.requirement.age ? res.data.requirement.age : null;    
   
            that.data.requirement.height = res.data.requirement.height ? res.data.requirement.height : '未选择'; 
            that.data.requirement_sub.height = res.data.requirement.height ? res.data.requirement.height : null; 

            that.data.requirement.weight = res.data.requirement.weight ? res.data.requirement.weight : '未选择';
            that.data.requirement_sub.weight = res.data.requirement.weight ? res.data.requirement.weight : null;

            that.data.requirement.minority = res.data.requirement.minority ? res.data.requirement.minority.name : '未选择';
            that.data.requirement_sub.minority = res.data.requirement.minority ? res.data.requirement.minority.id : null;

            that.data.requirement.salary = res.data.requirement.salary ? res.data.requirement.salary.name : '未选择';
            that.data.requirement_sub.salary = res.data.requirement.salary ? res.data.requirement.salary.id : null;

            that.data.requirement.somatotype = res.data.requirement.somatotype ? res.data.requirement.somatotype.name : '未选择';
            that.data.requirement_sub.somatotype = res.data.requirement.somatotype ? res.data.requirement.somatotype.id : null;

            that.data.requirement.education = res.data.requirement.education ? res.data.requirement.education.name : '未选择';
            that.data.requirement_sub.education = res.data.requirement.education ? res.data.requirement.education.id : null;

            that.data.requirement.native_place = res.data.requirement.native_place ? res.data.requirement.native_place : '未选择';
            that.data.requirement_sub.native_place = res.data.requirement.native_place ? res.data.requirement.native_place : null;

            that.data.requirement.work_place = res.data.requirement.workplace ? res.data.requirement.workplace : '未选择';
            that.data.requirement_sub.work_place = res.data.requirement.workplace ? res.data.requirement.workplace : null;

            that.data.requirement.jobs = res.data.requirement.job ? res.data.requirement.job.name : '未选择';
            that.data.requirement_sub.jobs = res.data.requirement.job ? res.data.requirement.job.id : null;

            that.data.requirement.marital_status = res.data.requirement.marital_status ? res.data.requirement.marital_status.name : '未选择';
            that.data.requirement_sub.marital_status = res.data.requirement.marital_status ? res.data.requirement.marital_status.id : null;

            that.data.requirement.car = res.data.requirement.car ? res.data.requirement.car.name : '未选择';
            that.data.requirement_sub.car = res.data.requirement.car ? res.data.requirement.car.id : null;

            that.data.requirement.house = res.data.requirement.house ? res.data.requirement.house.name : '未选择';
            that.data.requirement_sub.house = res.data.requirement.house ? res.data.requirement.house.id : null;

            that.data.requirement.have_children = res.data.requirement.have_children ? res.data.requirement.have_children.name : '未选择';
            that.data.requirement_sub.have_children = res.data.requirement.have_children ? res.data.requirement.have_children.id : null;

            that.data.requirement.dink = res.data.requirement.dink ? res.data.requirement.dink.name : '未选择';
            that.data.requirement_sub.dink = res.data.requirement.dink ? res.data.requirement.dink.id : null;
          }
          
      }

      if (that.data.basicInfo.personal_profile) {
        if (that.data.basicInfo.personal_profile.length > 40) {
          that.setData({
            unspread: 1,
            show_spread_btn: 1
          })
        }
      }
      that.setData({
        requirement: that.data.requirement,
        basicInfo: that.data.basicInfo,
        currentValue:res.data,
      });
    });
  },

  // 初始化一些选项，比如身高体重啥的
  _initOptionsData: function(){
    var heightArr = [];
    var weightArr = [];
    var ageArr = [];
    var ageRand = [];
    var heightRand = [];
    var weightRand = [];
    for(let i=130,j=0;i<=210;i++,j++){
      heightArr[j] = i + 'cm';
    }
    for (let i = 30, j = 0; i <= 140; i++ , j++) {
      weightArr[j] = i + 'kg';
    }
    for (let i = 18, j = 0; i <= 60; i++ , j++) {
      ageArr[j] = i + '岁';
    }
    

    var heightArr_requirement = heightArr;
    heightArr_requirement.unshift('不限');
    var heightRand_requirement = [heightArr_requirement, heightArr_requirement];
    this.data.heightArr = heightArr;

  
    var weightArr_requirement = weightArr;
    weightArr_requirement.unshift('不限');
    var weightRand_requirement = [weightArr_requirement, weightArr_requirement];

  
    var ageArr_requirement = ageArr;
    ageArr_requirement.unshift('不限');
    var ageRand_requirement = [ageArr_requirement,  ageArr_requirement];
    this.setData({
      heightArr: heightArr,
      weightArr: weightArr,
      ageArr: ageArr,
    });

    var basicInfo = {
      name: null,
      sex:'未选择',
      minority: '未选择',
      birth: '未选择',
      height: '未选择',
      weight: '未选择',
      somatotype: '未选择',
      salary: '未选择',
      education: '未选择',
      native_place: '未选择',
      jobs:'未选择',
      work_place: '未选择',
      marital_status: '未选择',
      car: '未选择',
      house: '未选择',
      have_children: '未选择',
      dink: '未选择',
      relationship_name: '未选择'
    }

    var requirement = {
      age: '未选择',
      height: '未选择',
      minority: '未选择',
      weight: '未选择',
      salary: '未选择',
      somatotype: '未选择',
      education: '未选择',
      native_place: '未选择',
      jobs: '未选择',
      work_place: '未选择',
      marital_status: '未选择',
      car: '未选择',
      house: '未选择',
      have_children: '未选择',
      dink: '未选择',
    }

    //初始化省市选择器
    tcity.init(this);

    var cityData = this.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    this.data.provinces = provinces;
    this.data.citys = citys;

    var area = [provinces, citys];
    this.setData({
      aeraData: area,
      heightRand_requirement: heightRand_requirement,
      ageRand_requirement: ageRand_requirement,
      weightRand_requirement: weightRand_requirement,
      basicInfo: basicInfo,
      requirement: requirement      
    });
  },

   // 省市列表专用
  _bindareacolumnchange: function (e) {
    var val = e.detail.value;
    var c = e.detail.column;
    var cityData = this.data.cityData;
    if (c == 0) {
      const citys = [];
      for (let i = 0; i < cityData[val].sub.length; i++) {
        citys.push(cityData[val].sub[i].name)
      }

      this.data.citys = citys;

      var aeraData = [this.data.provinces, citys];
      this.setData({
        aeraData: aeraData
      })
    }
  },

  //bindChange，选项发生变化的时候显示到页面并记录
  _selectOptions: function(e) {
    var label = e.currentTarget.dataset.label;
    var value = e.detail.value;
    if(label=='height'){
      this.data.basicInfo[label] = this.data.heightArr[value];
      this.data.basicInfo_sub['height'] = this.data.heightArr[value];
    }else if(label == 'birth'){
      this.data.basicInfo[label] = value;
      this.data.basicInfo_sub['birth'] = value;
    }else if(label == 'weight'){
      this.data.basicInfo[label] = this.data.weightArr[value];
      this.data.basicInfo_sub['weight'] = this.data.weightArr[value];
    } else if (label == 'native_place' || label == 'work_place'){
      //防止两个省市区切换的时候出现bug
      this.setData({
        areaValue:value
      });
      this.data.basicInfo[label] = this.data.provinces[value[0]] + '-' + this.data.citys[value[1]];
      this.data.basicInfo_sub[label] = this.data.provinces[value[0]] + '-' + this.data.citys[value[1]];

    }else{
      this.data.basicInfo[label] = this.data.options[label][value]['name'];
      this.data.basicInfo_sub[label] = this.data.options[label][value]['id'];
    }
    this.setData({
      basicInfo: this.data.basicInfo
    });
  },

  //检测姓名的改变
  _bindNameInput: function(e){
    this.data.basicInfo['name'] = e.detail.value;
    this.data.basicInfo_sub['name'] = e.detail.value;
  },

  // 择偶条件的改变
  _selectRequirement: function(e){
    var label = e.currentTarget.dataset.label;
    var value = e.detail.value; 
    if(label == 'age'){
      if(!value[0] && !value[1]){
        this.data.requirement_sub[label] = '不限';
      } else if (!value[0]){
        this.data.requirement_sub[label] = this.data.ageArr[value[1]]+'以下';
      } else if (!value[1]) {
        this.data.requirement_sub[label] = this.data.ageArr[value[0]] + '以上';
      }else{
        this.data.requirement_sub[label] = this.data.ageArr[value[0]] + '-' + this.data.ageArr[value[0] + value[1]];
      }
      this.data.requirement[label] = this.data.requirement_sub[label];
    }else if(label == 'height'){
      if (!value[0] && !value[1]) {
        this.data.requirement_sub[label] = '不限';
      } else if (!value[0]) {
        this.data.requirement_sub[label] = this.data.heightArr[value[1]] + '以下';
      } else if (!value[1]) {
        this.data.requirement_sub[label] = this.data.heightArr[value[0]] + '以上';
      } else {
        this.data.requirement_sub[label] = this.data.heightArr[value[0]] + '-' + this.data.heightArr[value[0] + value[1]];
      }
      this.data.requirement[label] = this.data.requirement_sub[label];
    }else if (label == 'weight') {
      if (!value[0] && !value[1]) {
        this.data.requirement_sub[label] = '不限';
      } else if (!value[0]) {
        this.data.requirement_sub[label] = this.data.weightArr[value[1]] + '以下';
      } else if (!value[1]) {
        this.data.requirement_sub[label] = this.data.weightArr[value[0]] + '以上';
      } else {
        this.data.requirement_sub[label] = this.data.weightArr[value[0]] + '-' + this.data.weightArr[value[0] + value[1]];
      }
      this.data.requirement[label] = this.data.requirement_sub[label];
    } else if (label == 'native_place' || label == 'work_place') {
      this.data.requirement_sub[label] = this.data.provinces[value[0]] + '-' + this.data.citys[value[1]];
      this.data.requirement[label] = this.data.requirement_sub[label];
    }
    else{
      this.data.requirement_sub[label] = this.data.options[label+'_requirement'][value]['id'];
      this.data.requirement[label] = this.data.options[label + '_requirement'][value]['name'];
    }

    this.setData({
      requirement: this.data.requirement,
    });
  },

  // 双列的择偶条件（前一列改变，后一列也改变）
  _requirementColumnChange: function(e){
    var label = e.currentTarget.dataset.label;
    var value = e.detail.value+1;
    var column = e.detail.column;
    if(column != 0 ){
      return;
    }
    if(label == 'age'){
      this.data.ageRand_requirement = [this.data.ageRand_requirement[0], this.data.ageRand_requirement[0].slice(value)];
      this.data.ageRand_requirement[1].unshift('不限'); 
    }
    if (label == 'height') {
      this.data.heightRand_requirement = [this.data.heightRand_requirement[0], this.data.heightRand_requirement[0].slice(value)];
      this.data.heightRand_requirement[1].unshift('不限'); 
    }
    if (label == 'weight') {
      this.data.weightRand_requirement = [this.data.weightRand_requirement[0], this.data.weightRand_requirement[0].slice(value)];
      this.data.weightRand_requirement[1].unshift('不限'); 
    }
    this.setData({
      ageRand_requirement: this.data.ageRand_requirement,
      heightRand_requirement: this.data.heightRand_requirement,
      weightRand_requirement: this.data.weightRand_requirement
    });
  },

  // 保存孩子信息
  _saveChildrenInfo: function(){
    var that=this;
          wx.showLoading({
            title: '保存中...',
          })
          that.setData({
            isEditSignature: 0
          })
          wx.removeStorageSync('signature');
          var childrenInfo = that.data.basicInfo_sub;
          var requirementArr = that.data.requirement_sub;
          var requirement_submit = {
            age: requirementArr.age,
            height: requirementArr.height,
            weight: requirementArr.weight,
            minority: requirementArr.minority,
            education: requirementArr.education,
            somatotype: requirementArr.somatotype,
            job: requirementArr.jobs,
            house: requirementArr.house,
            car: requirementArr.car,
            salary: requirementArr.salary,
            marital_status: requirementArr.marital_status,
            have_children: requirementArr.have_children,
            dink: requirementArr.dink,
            workplace: requirementArr.work_place,
            native_place: requirementArr.native_place,
          }
          var data_sub = {
            id: childrenInfo.id,
            name: childrenInfo.name,
            birth: childrenInfo.birth,
            sex: childrenInfo.sex,
            height: childrenInfo.height,
            weight: childrenInfo.weight,
            minority: childrenInfo.minority,
            education: childrenInfo.education,
            somatotype: childrenInfo.somatotype,
            job: childrenInfo.jobs,
            house: childrenInfo.house,
            car: childrenInfo.car,
            salary: childrenInfo.salary,
            marital_status: childrenInfo.marital_status,
            have_children: childrenInfo.have_children,
            dink: childrenInfo.dink,
            workplace: childrenInfo.work_place,
            native_place: childrenInfo.native_place,
            personal_profile: childrenInfo.personal_profile,
            // 择偶要求需要变成Json字符串
            requirement: JSON.stringify(requirement_submit),
            relationship_name: childrenInfo.relationship_name
          }
          if (that.data.location) {
            childrenM._editLocation(that.data.location, (res) => {
              if (!res.status) {
                Toast({
                  type: 'fail',
                  message: '居住地保存失败，请重试！',
                  selector: '#zan-toast-test',
                });
                return;
              }
              var user = wx.getStorageSync('userinfo');
              user.location = that.data.location;
              wx.setStorageSync('userinfo', user);
            });
          }
          childrenM._saveChildrenInfo(data_sub, (res) => {
            if (res.status == 1) {
              wx.hideLoading();
              wx.switchTab({
                url: '../index/index',
              })
            }
          });
        
   
   
  },

  //获取用户信息
  _getUserInfo: function(){
    var userInfo = wx.getStorageSync('userinfo');
    this.setData({
      userInfo: userInfo
    });
  },


  //选择并上传图片
  _didPressChooseImage: function () {
    var that=this;
    cy.aliChooseUpload(['album', 'camera'],'userPhoto/',url=>{
     var data = {
       image_url: url
     };
     childrenM._addImgToAlbum(data, (res) => {
       if (res.status == 1) {
         that.data.basicInfo.album.unshift.apply(that.data.basicInfo.album, [res.data]);
         that.setData({
           basicInfo: that.data.basicInfo,
         });
       }
       wx.hideLoading();
     });
   })
  }, 

  //预览图片
  _previewImage: function(e){
    let album=this.data.basicInfo.album;
    cy.previewImage(album,e)
  },

  //编辑用户签名
  _editSignature: function(e){
    let signature = e.currentTarget.dataset.signa;
    wx.navigateTo({
      url: '../editSignature/editSignture?signature='+signature,
    })
    wx.setStorageSync('signature', signature)
    this.setData({
      isEditSignature: 1
    })
  },

  //用户选择居住地
  _editUserLocation: function(e){
    var label = e.currentTarget.dataset.label;
    var value = e.detail.value;
    var location = this.data.citys[value[1]];
    this.setData({
      location: location
    });
    console.log(this.data.location);
  },

  //获取用户输入的个性签名
  _getInputSignature: function(){
    var that=this;
    let signature = wx.getStorageSync('signature');
    if (!that.data.isEditSignature) {
      return;
    }

    if (signature) {
      if (signature.length > 42) {
        that.setData({
          unspread: 1,
          show_spread_btn: 1
        })
      }
      else {
        that.setData({
          show_spread_btn: 0
        })
      }
    }
    else {
      that.setData({
        show_spread_btn: 0
      })
    }
    this.data.basicInfo_sub['personal_profile'] = signature;
    this.data.basicInfo.personal_profile = signature;
    this.setData({
      signature:signature,
    });
  },
  _spread: function (e) {
    this.setData({
      unspread: !this.data.unspread,
      string_btn: this.data.unspread ? '收起' : '展开',
      style_btn: this.data.unspread ? 'fa-angle-up' : 'fa-angle-down',
    });
  },
  //长按删除相册图片
  _deleteImage: function(e){
    var img_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该图片吗？',
      success: function (res) {
        if (res.confirm) {
          childrenM._deleteFromAlbum(img_id, (res)=>{
            if (res.status==1){
              wx.showToast({
                icon: 'none',
                title: '删除成功！',
              });
              that.data.basicInfo.ablum = that.data.basicInfo.album.splice(index,1);
            that.setData({
              basicInfo: that.data.basicInfo
            });
              return;
            }
            wx.showToast({
              icon: 'none',
              title: '删除失败，请重试！',
            });
          });
        } 
      }
    })
  }
})