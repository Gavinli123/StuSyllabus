// pages/classes/showEvaluate/showEvaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lesson: {
      "room": "E208",
      "duration": "1-16",
      "credit": "4.0",
      "teacher": "方若宇",
      "name": "[CST1301A]程序设计基础",
      "id": "72849",
      "class_schedule": [
        {
          "day_in_week": 1,
          "time": "67",
          "weeks": "1111111111111111",
          "original_time": "67"
        },
        {
          "day_in_week": 4,
          "time": "67",
          "weeks": "1111111111111111",
          "original_time": "67"
        }
      ],
      "from_credit_system": true
    },
    evaluateData: {},
    
    
    starList: [],
    totalScore: 0,
    score: 0,
    tag: [],
    comment: '',
    totalNumber: 32,

    choose_class_time: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lesson = JSON.parse(options.lesson)
    //console.log(lesson)
    
    let comment_list=wx.getStorageSync('comment_list')
    //console.log(comment_list)
    let this_id=Number.parseInt(lesson.id)
    let totalScore=4.5
    let score=0
    let tag=[]
    let comment=''
    for(let i in comment_list){
      if(this_id==comment_list[i].class_id){
        score = comment_list[i].eva_score
        let tagg = comment_list[i].eva_tags
        tag=tagg.split("&&")
        comment = comment_list[i].eva_content
        break
      }
    }
      

    /*var str = 'evaluate' + lesson['id']
    var evaluateList = wx.getStorageSync(str)
    var totalScore = 4.5
    var score
    var tag = []
    var comment
    if (evaluateList) {
      totalScore = evaluateList['totalScore']
      score = evaluateList['score']
      tag = evaluateList['tag']
      comment = evaluateList['comment']
    }
    else {
      let list = {}
      totalScore = 4.5
      score = 0
      tag = []
      comment = ''
      list['totalScore'] = totalScore
      list['score'] = score
      list['tag'] = tag
      list['comment'] = comment
      wx.setStorage({
        key: str,
        data: list,
      })
    }*/

    var selected = "../../../image/selected.png"
    var half = "../../../image/half.png"
    var normal = "../../../image/normal.png"

    var starList = []
    if (totalScore == 5) {
      for (var i = 0; i < 5; i++) {
        starList.push(selected)
      }
    }
    else if (totalScore >= 4.5) {
      for (var i = 0; i < 4; i++) {
        starList.push(selected)
      }
      starList.push(half)
    }
    else if (totalScore >= 4) {
      for (var i = 0; i < 4; i++) {
        starList.push(selected)
      }
      starList.push(normal)
    }
    else if (totalScore >= 3.5) {
      for (var i = 0; i < 3; i++) {
        starList.push(selected)
      }
      starList.push(half)
      starList.push(normal)
    }
    else if (totalScore >= 3) {
      for (var i = 0; i < 3; i++) {
        starList.push(selected)
      }
      starList.push(normal)
      starList.push(normal)
    }
    else if (totalScore >= 2.5) {
      for (var i = 0; i < 2; i++) {
        starList.push(selected)
      }
      starList.push(half)
      starList.push(normal)
      starList.push(normal)
    }
    else if (totalScore >= 2) {
      for (var i = 0; i < 2; i++) {
        starList.push(selected)
      }
      starList.push(normal)
      starList.push(normal)
      starList.push(normal)
    }
    else if (totalScore >= 1.5) {
      starList.push(selected)
      starList.push(half)
      starList.push(normal)
      starList.push(normal)
      starList.push(normal)
    }
    else if (totalScore >= 1) {
      starList.push(selected)
      starList.push(normal)
      starList.push(normal)
      starList.push(normal)
      starList.push(normal)
    }
    else if (totalScore >= 0.5) {
      starList.push(half)
      starList.push(normal)
      starList.push(normal)
      starList.push(normal)
      starList.push(normal)
    }
    //var evaluateData=wx.getStorageSync("evaluateData")
    //console.log(evaluateData)
    this.setData({
      totalScore: totalScore,
      score: score,
      tag: tag,
      comment: comment,
      starList: starList,
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
  change: function () {
    let lessonJson = JSON.stringify(this.data.lesson)
    let is_comment
    if(this.data.score==0){
      is_comment=0
    }
    else{
      is_comment=1
    }
    wx.redirectTo({
      url: '/pages/classes/evaluate/evaluate?lesson=' + lessonJson+'&is_comment='+is_comment,
    })
  }
})