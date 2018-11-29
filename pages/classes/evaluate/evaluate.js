// pages/classes/evaluate/evaluate.js
const LinshiUrl = 'https://stuapps.com/extension/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/normal.png',
    selectedSrc: '/image/selected.png',
    halfSrc: '/image/half.png',
    key: 0,//评分
    text:"点击星星评分",
    isdown:false,
    tag:["儒雅","认真","给分高","给分低","点名","不点名","严格","严谨","热情","好商量","作业多","作业少","快节奏","慢节奏"],
    tagg:[
      {id:0,value:"给分高",isSelected:false},
      { id: 1, value: "人好", isSelected: false },
      { id: 2, value: "作业多", isSelected: false },
      { id: 3, value: "killer", isSelected: false },
      { id: 4, value: "不考勤", isSelected: false },
      { id: 5, value: "好看", isSelected: false },
      { id: 6, value: "常考勤", isSelected: false },
      { id: 7, value: "认真负责", isSelected: false },
      { id: 8, value: "有趣", isSelected: false },
      { id: 9, value: "自由", isSelected: false },
    ],
    isclick:false,
    texts: "",
    min: 0,//最少字数
    max: 200, //最多字数

    is_comment:0,  //是否已经评论过
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lesson=JSON.parse(options.lesson)
    let is_comment=Number.parseInt(options.is_comment)
    this.setData({
      is_comment,
      lesson
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
  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    //console.log("得" + key + "分")
    this.setData({
      key: key
    })
    if(key>4){
      this.setData({
        text:'极好的'
      })
    }
    else if(key>3){
      this.setData({
        text:'较好的'
      })
    }
    else if(key>2){
      this.setData({
        text:'一般',
      })
    }
    else if(key>1){
      this.setData({
        text:'较差'
      })
    }
    else{
      this.setData({
        text: '很差'
      })
    }
  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    //console.log("得" + key + "分")
    this.setData({
      key: key
    })
    if (key > 4) {
      this.setData({
        text: '极好的'
      })
    }
    else if (key > 3) {
      this.setData({
        text: '较好的'
      })
    }
    else if (key >2) {
      this.setData({
        text: '一般'
      })
    }
    else if (key > 1) {
      this.setData({
        text: '较差',
      })
    }
    else {
      this.setData({
        text: '很差'
      })
    }
  },
  clickTarrow:function(){
    var that=this
    var isdown=that.data.isdown
    that.setData({
      isdown:!isdown
    })
  },

  clicktag:function(e){
    var id=e.currentTarget.dataset.tagid;
    var tagg=this.data.tagg[id];
    tagg.isSelected=!tagg.isSelected
    this.setData({
      tagg:this.data.tagg
    })
  },

  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len, //当前字数  
      texts:value  //当前内容
    });
  },

  submit:function(){
    var that = this
    var key=that.data.key
    var texts=that.data.texts
    if(key==0){
      wx.showModal({
        title: '提示',
        content: '您还没有进行评分，请点击星星进行评分',
      })
      return
    }
    var tagArray=[]
    var temp=that.data.tagg
    for(var i in temp){
      if(temp[i].isSelected){
        tagArray.push(temp[i].value)
      }
    }
    if(tagArray.length>3){
      wx.showModal({
        title: '提示',
        content: '选择的标签不能超过3条',
      })
      return
    }
    else if(tagArray.length==0){
      wx.showModal({
        title: '提示',
        content: '您还没有选择标签',
      })
      return
    }
    if(texts==''){
      wx.showModal({
        title: '提示',
        content: '您还没有填写评价',
      })
      return
    }
    var evaluateData = {}
    evaluateData.score=key
    evaluateData.tag=tagArray
    evaluateData.comment=texts
    var tagString=''
    for(let tagi in tagArray){
      tagString+=tagArray[tagi]
      tagString+='&&'
    }
    tagString=tagString.substring(0,tagString.length-2)
    console.log(tagString)
    let is_comment=that.data.is_comment
    if(is_comment==0){
      wx.request({
        url: LinshiUrl + 'api/v2/eva',
        method:'post',
        header:{
          'Content-Type': 'text/plain;charset:utf-8',
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          uid: global.classes.user_id,
          token: global.classes.token,
          class_id:Number.parseInt(that.data.lesson.id),
          score:evaluateData.score,
          tags:tagString,
          content:evaluateData.comment
        },
        success(res){
          wx.showToast({
            title: '成功',
            icon: "success",
            duration: 2000,
            mask: true,
            complete: function () {
              let lessonJson = JSON.stringify(that.data.lesson)
              wx.request({
                url: LinshiUrl + 'api/v2/eva',
                method: 'get',
                header: {
                  'Content-Type': 'text/plain;charset:utf-8',
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  uid: global.classes.user_id,
                  token: global.classes.token,
                },
                success(res) {
                  if (res.statusCode == 200) {
                    wx.setStorage({
                      key: 'comment_list',
                      data: res.data.data.eva_list,
                    })
                    console.log(res)
                    wx.redirectTo({
                      url: '/pages/classes/showEvaluate/showEvaluate?lesson=' + lessonJson,
                    })
                  }
                  else {
                    wx.showModal({
                      title: '错误',
                      content: '请求出错',
                    })
                  }
                },
                fail() {
                  wx.showModal({
                    title: '错误',
                    content: '请求出错',
                  })
                }
              })
            }
          })
        },
        fail(){
          wx.showModal({
            title: '错误',
            content: '请求出错',
          })
        }
      })
    }
    else{
      let this_id = Number.parseInt(that.data.lesson.id)
      let comment_list = wx.getStorageSync('comment_list')
      let this_comment
      for(let i in comment_list){
        if(this_id==comment_list[i].class_id){
          this_comment=comment_list[i]
          break
        }
      }
      let eva_id=this_comment.eva_id
      wx.request({
        url: LinshiUrl+'api/v2/eva',
        method: 'put',
        header: {
          'Content-Type': 'text/plain;charset:utf-8',
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          eva_id:eva_id,
          class_id: Number.parseInt(that.data.lesson.id),
          score: evaluateData.score,
          tags: tagString,
          content: evaluateData.comment
        },
        success(res){
          wx.showToast({
            title: '成功',
            icon: "success",
            duration: 2000,
            mask: true,
            complete: function () {
              let lessonJson = JSON.stringify(that.data.lesson)
              wx.request({
                url: LinshiUrl + 'api/v2/eva',
                method: 'get',
                header: {
                  'Content-Type': 'text/plain;charset:utf-8',
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  uid: global.classes.user_id,
                  token: global.classes.token,
                },
                success(res) {
                  if (res.statusCode == 200) {
                    wx.setStorage({
                      key: 'comment_list',
                      data: res.data.data.eva_list,
                    })
                    //console.log(res)
                    wx.redirectTo({
                      url: '/pages/classes/showEvaluate/showEvaluate?lesson=' + lessonJson,
                    })
                  }
                  else {
                    wx.showModal({
                      title: '错误',
                      content: '请求出错',
                    })
                  }
                },
                fail() {
                  wx.showModal({
                    title: '错误',
                    content: '请求出错',
                  })
                }
              })
            }
          })
        }
      })
    }
    /*wx.request({
      url: 'https://118.126.92.214:8082/api/get_comment',
      method:'post',
      header:{
        'Content-Type': 'text/plain;charset:utf-8',
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        account:global.account
      },
      success(res){
        console.log(res)
      }
    })*/
    //console.log(evaluateData)
    
    /*let str='evaluate'+that.data.lesson['id']
    let temp1=wx.getStorageSync(str)
    evaluateData.totalScore=temp1.totalScore

    wx.setStorage({
      key: str,
      data: evaluateData,
    })*/
    /*wx.showToast({
      title: '成功',
      icon:"success",
      duration:2000,
      mask:true,
      complete:function(){
        let lessonJson=JSON.stringify(that.data.lesson)
        wx.redirectTo({
          url: '/pages/classes/showEvaluate/showEvaluate?lesson='+lessonJson,
        })
      }
    })*/
  }
})