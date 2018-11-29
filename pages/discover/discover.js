// pages/discover/discover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearch: true,
    inputShowed: false,
    inputVal: "",
    isSelected0:true,
    isSelected1:false,
    isSelected2:false,
    jiahao:true,
    schoolSelected0:true,
    schoolSelected1: false,
    schoolSelected2: false,
    schoolSelected3: false,
    ThingSelected0:true,
    ThingSelected1:false,
    WallSelected0:true,
    WallSelected1:false,

    currentModeList:[],
    showList:[]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e){
    this.setData({
      inputVal: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentModeList=wx.getStorageSync('messageList')
    console.log(currentModeList)
    let that=this
    let showList=[]
    for(var i in currentModeList){
      if(currentModeList[i].mode=='生活'){
        showList.push(currentModeList[i])
      } 
    }
    that.setData({
      currentModeList,
      showList
    })
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
  switchItem:function(e){
    let that=this
    let isSelected0=that.data.isSelected0
    let isSelected1 = that.data.isSelected1
    let isSelected2 = that.data.isSelected2
    let currentModeList=[]
    let showList=[]
    if(isSelected0){
      if(e.currentTarget.dataset.item=="1"){
        currentModeList=wx.getStorageSync('thingsList')
        for(let i in currentModeList){
          if(currentModeList[i].mode=='寻物'){
            showList.push(currentModeList[i])
          }
        }
        isSelected0=false
        isSelected1=true
      }
      else if (e.currentTarget.dataset.item == "2") {
        currentModeList = wx.getStorageSync('wallList')
        showList=currentModeList
        isSelected0 = false
        isSelected2 = true
      }
    }
    else if (isSelected1) {
      if (e.currentTarget.dataset.item == "0") {
        currentModeList = wx.getStorageSync('messageList')
        for (let i in currentModeList) {
          if (currentModeList[i].mode == '生活') {
            showList.push(currentModeList[i])
          }
        }
        isSelected0 = true
        isSelected1 = false
      }
      else if (e.currentTarget.dataset.item == "2") {
        currentModeList = wx.getStorageSync('wallList')
        showList = currentModeList
        isSelected1 = false
        isSelected2 = true
      }
    }
    else if (isSelected2) {
      if (e.currentTarget.dataset.item == "0") {
        currentModeList = wx.getStorageSync('messageList')
        for (let i in currentModeList) {
          if (currentModeList[i].mode == '生活') {
            showList.push(currentModeList[i])
          }
        }
        isSelected0 = true
        isSelected2 = false
      }
      else if (e.currentTarget.dataset.item == "1") {
        currentModeList = wx.getStorageSync('thingsList')
        for (let i in currentModeList) {
          if (currentModeList[i].mode == '寻物') {
            showList.push(currentModeList[i])
          }
        }
        isSelected1 =true
        isSelected2 = false
      }
    }
    that.setData({
      isSelected0:isSelected0,
      isSelected1: isSelected1,
      isSelected2: isSelected2,
      currentModeList,
      showList
    })
  },
  switchSchool:function(e){
    let that=this
    let schoolSelected0 = that.data.schoolSelected0
    let schoolSelected1 = that.data.schoolSelected1
    let schoolSelected2 = that.data.schoolSelected2
    let schoolSelected3 = that.data.schoolSelected3
    let current = Number.parseInt(e.currentTarget.dataset.item)
    let showList=[]
    let currentModeList=that.data.currentModeList
    if (schoolSelected0){
      switch(current){
        case 1:{
          for(var i in currentModeList){
            if(currentModeList[i].mode=='兼职'){
              showList.push(currentModeList[i])
            }
          }
          schoolSelected0=false
          schoolSelected1=true
        }
        break
        case 2: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '研究') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected0 = false
          schoolSelected2 = true
        }
          break
        case 3: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '学习') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected0 = false
          schoolSelected3 = true
        }
          break
      }
    }
    if (schoolSelected1) {
      switch (current) {
        case 0: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '生活') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected0 = true
          schoolSelected1 = false
        }
          break
        case 2: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '研究') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected1 = false
          schoolSelected2 = true
        }
          break
        case 3: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '学习') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected1 = false
          schoolSelected3 = true
        }
          break
      }
    }
    if (schoolSelected2) {
      switch (current) {
        case 0: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '生活') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected0 = true
          schoolSelected2 = false
        }
          break
        case 1: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '兼职') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected2 = false
          schoolSelected1 = true
        }
          break
        case 3: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '学习') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected2 = false
          schoolSelected3 = true
        }
          break
      }
    }
    if (schoolSelected3) {
      switch (current) {
        case 0: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '生活') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected0 = true
          schoolSelected3 = false
        }
          break
        case 1: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '兼职') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected3 = false
          schoolSelected1 = true
        }
          break
        case 2: {
          for (var i in currentModeList) {
            if (currentModeList[i].mode == '研究') {
              showList.push(currentModeList[i])
            }
          }
          schoolSelected3 = false
          schoolSelected2 = true
        }
          break
      }
    }
    that.setData({
      schoolSelected0: schoolSelected0,
      schoolSelected1: schoolSelected1,
      schoolSelected2: schoolSelected2,
      schoolSelected3: schoolSelected3,
      showList
    })
  },
  switchThing:function(e){
    let that=this
    let ThingSelected0 = that.data.ThingSelected0
    let ThingSelected1 = that.data.ThingSelected1
    let current = Number.parseInt(e.currentTarget.dataset.item)
    let currentModeList=that.data.currentModeList
    let showList=[]
    if(ThingSelected0&&current==1){
      for(let i in currentModeList){
        if(currentModeList[i].mode=='寻主'){
          showList.push(currentModeList[i])
        }
      }
      ThingSelected0=false
      ThingSelected1=true
    }
    if (ThingSelected1 && current == 0) {
      for (let i in currentModeList) {
        if (currentModeList[i].mode == '寻物') {
          showList.push(currentModeList[i])
        }
      }
      ThingSelected0 = true
      ThingSelected1 = false
    }
    that.setData({
      ThingSelected0:ThingSelected0,
      ThingSelected1: ThingSelected1,
      showList
    })
  },
  switchWall: function (e) {
    let that = this
    let WallSelected0 = that.data.WallSelected0
    let WallSelected1 = that.data.WallSelected1
    let current = Number.parseInt(e.currentTarget.dataset.item)
    if (WallSelected0 && current == 1) {
      WallSelected0 = false
      WallSelected1 = true
    }
    if (WallSelected1 && current == 0) {
      WallSelected0 = true
      WallSelected1 = false
    }
    that.setData({
      WallSelected0: WallSelected0,
      WallSelected1: WallSelected1,
    })
  },
  changeAdd:function(){
    let that=this;
    let jiahao=that.data.jiahao;
    jiahao=!jiahao;
    that.setData({
      jiahao:jiahao
    })
  },
  addContent:function(){
    let that=this
    let type
    if(that.data.isSelected0){
      type="news"
    }
    else if(that.data.isSelected1){
      type="things"
    }
    else if(that.data.isSelected2){
      type="wall"
    }
    wx.navigateTo({
      url: 'addContent/addContent?type='+type,
    })
  },
  scroll:function(e){
    let that=this
    that.setData({
      showSearch:false
    })
  },
  upper:function(e){
    let that=this
    that.setData({
      showSearch:true
    })
  },
  toDetail:function(e){
    console.log(e.currentTarget.dataset.id)
  },
  dianzan:function(e){
    console.log('aaa')
  },
  previewIcon:function(e){
    wx.previewImage({
      urls: ['https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132'],
    })
  },
  previewPhoto:function(e){
    let that=this
    let id=e.currentTarget.dataset.id
    let index=e.currentTarget.dataset.index
    wx.previewImage({
      current: that.data.showList[id].imgs[index],
      urls: that.data.showList[id].imgs,
    })
  },
  toManage:function(e){
    wx.navigateTo({
      url: 'manage/manage',
    })
  }
})