// pages/discover/addContent/addContent.js

const stuUrl ="https://stuapps.com/interaction/api/v2/post"
const testUrl ="http://118.126.92.214:8083/interaction/api/v2/post"
const testUid="5"
const testToken="100004"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'news',
    min:0,
    max:1000,
    height:1000,
    uploading:false,
    imgLen:0,
    formData: {
      title: '',
      content: '',
      imgs: [],
      mode:'生活',
    },

    formData2:{
      title:'',
      content:'',
      imgs:[],
      mode:'寻物',
      position:'',
      phone:''
    },
    formData3:{
      content:''
    },

    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['生活', '兼职', '研究', '学习'],//下拉列表的数据
    index: 0//选择的下拉列表下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    if(options.type=="news"){
      wx.setNavigationBarTitle({
        title: '信息发布',
      })
    }
    else if (options.type == "things") {
      wx.setNavigationBarTitle({
        title: '失物招领',
      })
    }
    else if (options.type == "wall") {
      wx.setNavigationBarTitle({
        title: '表白墙',
      })
    }
    that.setData({
      type:options.type
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
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    let that=this
    if(that.data.type=='news'){
      that.setData({
        currentWordNumber: len, //当前字数  
        'formData.content': value  //当前内容
      });
    }
    else if(that.data.type=='things'){
      that.setData({
        currentWordNumber: len, //当前字数  
        'formData2.content': value  //当前内容
      })
    }
    else if(that.data.type=='wall'){
      that.setData({
        currentWordNumber: len, //当前字数  
        'formData3.content': value  //当前内容
      })
    }
  },

  choosePhoto: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '上传图片需要消耗流量，是否继续？',
      confirmText: '继续',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 5,
            sourceType: ['album'],
            success: function (res) {
              console.log(res)
              var tempFilePaths = res.tempFilePaths, imgLen = tempFilePaths.length;
              if(imgLen+_this.data.imgLen>5){
                wx.showModal({
                  title: '提示',
                  content: '上传图片的数量不得大于5张',
                })
                return
              }
              _this.setData({
                //uploading: true,
                imgLen: _this.data.imgLen + imgLen
              });
              tempFilePaths.forEach(function (e) {
                if(_this.data.type=='news'){
                  _this.setData({
                    "formData.imgs": _this.data.formData.imgs.concat(e)
                  })
                }
                else if (_this.data.type == 'things'){
                  _this.setData({
                    "formData2.imgs": _this.data.formData2.imgs.concat(e)
                  })
                }
                //_this.uploadImg(e);
              });
            }
          });
        }
      }
    });
  },
  previewPhoto: function (e) {
    var _this = this;
    //预览图片
    if (_this.data.uploading) {
      app.showErrorModal('正在上传图片', '预览失败');
      return false;
    }
    if(_this.data.type=='news'){
      wx.previewImage({
        current:_this.data.formData.imgs[e.target.dataset.index],
        urls: _this.data.formData.imgs
      });
    }
    else if(_this.data.type=='things'){
      wx.previewImage({
        current: _this.data.formData2.imgs[e.target.dataset.index],
        urls: _this.data.formData2.imgs
      });
    }
  },
  titleListener:function(e){
    let that=this
    if(that.data.type=='news'){
      that.setData({
        'formData.title':e.detail.value
      })
    }
    else if (that.data.type == 'things'){
      that.setData({
        'formData2.title': e.detail.value
      })
    }
  },

  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let mode=''
    if(Index==0){
      mode='生活'
    }
    else if(Index==1){
      mode='兼职'
    }
    else if (Index == 2) {
      mode = '研究'
    }
    else if (Index == 3) {
      mode = '学习'
    }
    this.setData({
      index: Index,
      show: !this.data.show,
      'formData.mode':mode
    });
  },
  submit:function(){
    let that=this

    if(that.data.type=='news'){
      let formData=that.data.formData
      if(formData.title==''){
        wx.showModal({
          title: '提示',
          content: '您还没有输入标题',
        })
        return
      }
      if(formData.content==''){
        wx.showModal({
          title: '提示',
          content: '您还没有输入内容',
        })
        return
      }
      wx.request({
        url: testUrl,
        method:'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data:{
          uid:testUid,
          token:testToken,
          post_type:0,
          content:formData.content,
          title:formData.title,
          description:formData.mode,
          source:"小程序",
        },
        success(res){
          console.log(res)
          wx.reLaunch({
            url: '../discover',
          })
        },
        fail(res){
          console.log("出现错误！")
        }
      })
      // let messageList=wx.getStorageSync('messageList')||[]
      // let id=messageList.length
      // formData.id=id
      // messageList.push(formData)
      // wx.setStorage({
      //   key: 'messageList',
      //   data: messageList,
      // })
      // console.log(messageList)
    }
    else if(that.data.type=='things'){
      let formData2=that.data.formData2
      if (formData2.title == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入标题',
        })
        return
      }
      if (formData2.content == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入内容',
        })
        return
      }
      if(formData2.position==''){
        wx.showModal({
          title: '提示',
          content: '您还没有输入位置',
        })
        return
      }
      if (formData2.phone == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入联系方式',
        })
        return
      }
      let thingsList=wx.getStorageSync('thingsList')||[]
      let id = thingsList.length
      formData2.id = id
      thingsList.push(formData2)
      wx.setStorage({
        key: 'thingsList',
        data: thingsList,
      })
      console.log(thingsList)
      wx.reLaunch({
        url: '../discover',
      })
    }
    else if(that.data.type=='wall'){
      let formData3=that.data.formData3
      if (formData3.content == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入内容',
        })
        return
      }
      let wallList = wx.getStorageSync('wallList') || []
      let id = wallList.length
      formData3.id = id
      wallList.push(formData3)
      wx.setStorage({
        key: 'wallList',
        data: wallList,
      })
      console.log(wallList)
      wx.reLaunch({
        url: '../discover',
      })
    }
  },

  radiochange:function(e){
    let that=this
    if(e.detail.value=='寻物'){
      that.setData({
        'formData2.mode':'寻物'
      })
    }
    if (e.detail.value == '寻主') {
      that.setData({
        'formData2.mode': '寻主'
      })
    }
  },
  positionListener:function(e){
    let that=this
    that.setData({
      'formData2.position':e.detail.value
    })
  },
  phoneListener:function(e){
    let that=this
    that.setData({
      'formData2.phone':e.detail.value
    })
  },
  cancal:function(){
    wx.navigateBack({
      delta:1
    })
  }
})