// pages/discover/modify/modify.js
//const findlostUrl ="http://118.126.92.214:8083/extension/api/v2/findlost"
//const testUrl = "http://118.126.92.214:8083/interaction/api/v2/post"
//const testUid = "5"
//const testToken = "100004"

const findlostUrl = "https://stuapps.com/extension/api/v2/findlost"
const testUrl = "https://stuapps.com/interaction/api/v2/post"
const testUid = global.classes.user_id
const testToken = global.classes.token

var Bmob = require('../../../util/bmob.js');
var common = require('../../../util/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectData: ['生活', '兼职', '研究', '学习'],//下拉列表的数据
    max: 1000,//最大字数限制
    min:0,
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    index: 0,//选择的下拉列表下标
    imgs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    if(options.category=='失物招领'){
      console.log(options)
      let imgObj=''
      if (options.photo != "null" && options.photo!=""){
        imgObj = JSON.parse(options.photo)
      }
      let urlArr=[]
      if(imgObj!=''){
        for (let i = 0; i < imgObj.photo_list.length;i++){
          urlArr.push({url:imgObj.photo_list[i]["size_big"]})
        }
      }
      that.setData({
        urlArr,
        imgChoose:urlArr.length>0?true:false,
        category:options.category,
        content:options.content,
        id:Number.parseInt(options.id),
        location:options.location,
        contact:options.contact,
        checked:options.mode=="寻物"?true:false,
        mode:options.mode,
        title:options.title,
        uid:Number.parseInt(options.uid),
        currentWordNumber:options.content.length
      })
    }

    /*获取从manage页面传来的参数并且setData */
    let category=options.category
    let content=options.content
    let id=Number.parseInt(options.id)
    let mode=options.mode
    let photo={}
    let urlArr=[]
    if(options.photo!="null"&&options.photo!=""){
      photo=JSON.parse(options.photo)
      for(let i=0;i<photo.photo_list.length;i++){
        if(photo.photo_list[i]["size_big"]!=null){
          urlArr.push({url:photo.photo_list[i]["size_big"]})
        }
        else{
          urlArr.push({url:photo.photo_list[i]["size_small"]})
        }
      }
    }
    let title=options.title
    let uid=Number.parseInt(options.uid)
    let topic_id=Number.parseInt(options.topic_id)
    let currentWordNumber=content.length
    let index = topic_id - 1
    that.setData({
      category,
      content,
      id,
      mode,
      photo,
      title,
      uid,
      topic_id,
      index,
      currentWordNumber,
      urlArr,
      imgChoose: urlArr.length > 0 ? true : false,
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

  /*标题监听 */
  titleListener: function (e) {
    let that = this
    if (that.data.category == '校园动态' || that.data.category == '失物招领') {
      that.setData({
        title: e.detail.value
      })
    }
  },

  /*输入内容监听 */
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    let that = this
    that.setData({
      currentWordNumber: len, //当前字数  
      content: value  //当前内容
    });
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
              if (imgLen > 5) {
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

              wx.showLoading({
                title: '上传中',
                mask: true
              })
              var urlArr = new Array();
              if (imgLen > 0) {
                var newDate = new Date();
                var newDateStr = newDate.toLocaleDateString();
                var j = 0;
                for (var i = 0; i < imgLen; i++) {
                  var tempFilePath = [tempFilePaths[i]];
                  var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
                  if (extension) {
                    extension = extension[1].toLowerCase();
                  }
                  var name = newDateStr + "." + extension;//上传的图片的别名
                  var file = new Bmob.File(name, tempFilePath);
                  file.save().then(function (res) {
                    console.log(res)
                    wx.hideLoading()
                    var url = res.url();
                    console.log(url);

                    urlArr.push({ "url": url });
                    j++;
                    console.log(j, imgLen);
                    // if (imgLength == j) {
                    //   console.log(imgLength, urlArr);
                    //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                    // }
                    _this.setData({
                      urlArr,
                      imgChoose: true
                    })
                    console.log(_this.data.urlArr)

                  }, function (error) {
                    wx.hideLoading()
                    console.log(error)
                    wx.showToast({
                      title: '出现错误',
                      icon: none
                    })
                  });
                }
              }
            }
          });
        }
      }
    });
  },
  /*重新选择图片 */
  rechooseImg: function () {
    let that = this
    that.setData({
      urlArr: [],
      imgChoose: false
    })
  },

  /*失物招领模块变化 */
  radiochange: function (e) {
    let that = this
    if (e.detail.value == '寻物') {
      that.setData({
        mode: '寻物'
      })
    }
    if (e.detail.value == '寻主') {
      that.setData({
        mode: '寻主'
      })
    }
  },

  /*失物招领位置监听器 */
  positionListener: function (e) {
    let that = this
    that.setData({
      location: e.detail.value
    })
  },

  /*失物招领联系方式监听器 */
  phoneListener: function (e) {
    let that = this
    that.setData({
      contact: e.detail.value
    })
  },

  /*是否显示下拉框 */
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },

  /* 点击下拉列表*/
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let mode = ''
    if (Index == 0) {
      mode = '生活'
    }
    else if (Index == 1) {
      mode = '兼职'
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
      mode: mode
    });
  },

  /*点击取消 */
  cancal: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /*点击修改*/
  modify: function () {
    let that = this
    let title=that.data.title
    let content=that.data.content

    if (that.data.category == '校园动态') {
      if (title == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入标题',
        })
        return
      }
      if (content == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入内容',
        })
        return
      }

      /*以下为图片的处理，目的是符合后台传值规范 */
      let photo_list_json
      let urlArr = that.data.urlArr
      if (urlArr.length == 0) {
        photo_list_json = null
      }
      else {
        photo_list_json = {}
        let photo_list = []
        for (let i = 0; i < urlArr.length; i++) {
          let obj = {}
          obj["size_big"] = urlArr[i].url
          obj["size_small"] = urlArr[i].url
          photo_list.push(obj)
        }
        photo_list_json["photo_list"] = photo_list
        console.log(photo_list_json)
      }
      photo_list_json = JSON.stringify(photo_list_json)
      console.log(photo_list_json)

      /*确定topic_id 1为生活，2为兼职，3为学习，4为研究 */
      let topic_id = that.data.topic_id
      let mode=that.data.mode
      if(mode=='生活')
        topic_id=1
      else if (mode == '兼职')
        topic_id = 2
      else if (mode == '研究')
        topic_id = 3
      else if (mode == '学习')
        topic_id = 4
      let id=that.data.id
      let uid=that.data.uid
      wx.request({
        url: testUrl,
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          id:id,
          uid: global.classes.user_id,
          token: global.classes.token,
          post_type: 0,
          content:content,
          title:title,
          description:mode,
          topic_id: topic_id,
          source: "小程序",
          photo_list_json:photo_list_json,
        },
        success(res) {
          console.log(res)
          wx.reLaunch({
            url: '../discover',
          })
        },
        fail(res) {
          console.log("出现错误！")
        }
      })
    }
    else if (that.data.category == '表白墙') {
      if (content == '') {
        wx.showModal({
          title: '提示',
          content: '您还没有输入内容',
        })
        return
      }
      let id = that.data.id
      let uid = that.data.uid
      wx.request({
        url: testUrl,
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          id: id,
          uid: global.classes.user_id,
          token: global.classes.token,
          post_type: 0,
          content: content,
          description: '表白墙',
          topic_id: 6,
          source: "小程序",
        },
        success(res) {
          console.log(res)
          wx.reLaunch({
            url: '../discover',
          })
        },
        fail(res) {
          console.log("出现错误！")
        }
      })
    }
  },

  /*失物招领修改 */
  modify1:function(){
    let that=this

    /*以下为图片的处理，目的是符合后台传值规范 */
    let photo_list_json
    let urlArr = that.data.urlArr
    if (urlArr.length == 0) {
      photo_list_json = null
    }
    else {
      photo_list_json = {}
      let photo_list = []
      for (let i = 0; i < urlArr.length; i++) {
        let obj = {}
        obj["size_big"] = urlArr[i].url
        obj["size_small"] = urlArr[i].url
        photo_list.push(obj)
      }
      photo_list_json["photo_list"] = photo_list
      console.log(photo_list_json)
    }
    photo_list_json = JSON.stringify(photo_list_json)
    console.log(photo_list_json)

    let formdata={}
    formdata.img_link=photo_list_json
    formdata.findlost_id=that.data.id
    formdata.uid=that.data.uid
    formdata.kind=that.data.mode=="寻物"?1:0
    formdata.title=that.data.title
    formdata.description=that.data.content
    formdata.location=that.data.location
    formdata.contact=that.data.contact
    console.log(formdata)

    if(formdata.title==""){
      wx.showModal({
        title: '提示',
        content: '你还没有输入标题',
      })
      return
    }
    else if(formdata.description==""){
      wx.showModal({
        title: '提示',
        content: '你还没有输入描述',
      })
      return
    }
    else if(formdata.location==""){
      wx.showModal({
        title: '提示',
        content: '你还没有输入位置',
      })
      return
    }
    else if(formdata.contact==""){
      wx.showModal({
        title: '提示',
        content: '你还没有输入联系方式',
      })
      return
    }
    wx.request({
      url: findlostUrl,
      method:'PUT',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        findlost_id:formdata.findlost_id,
        uid:global.classes.user_id,
        token:global.classes.token,
        kind:formdata.kind,
        title:formdata.title,
        description:formdata.description,
        location:formdata.location,
        contact:formdata.contact,
        img_link:formdata.img_link
      },
      success(res){
        if(res.statusCode==200){
          wx.reLaunch({
            url: '../discover',
          })
        }
        else{
          wx.showToast({
            title: '出现错误',
            icon: none,
          })  
        }
      },
      fail(res){
        console.log(res)
        wx.showToast({
          title: '出现错误',
          icon:none,
        })
      }
    })
  },
  previewPhoto: function (e) {
    var that = this;
    let arr = []
    let urlArr = that.data.urlArr
    for (let i = 0; i < urlArr.length; i++) {
      arr.push(urlArr[i].url)
    }
    wx.previewImage({
      urls: arr,
      current: arr[e.target.dataset.index]
    })
  },
})