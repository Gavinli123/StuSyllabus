var dateTimePicker = require('../../../../util/dateTimePicker.js');
const LinshiUrl ='https://stuapps.com/extension/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: "",
    min: 0,//最少字数
    max: 1000, //最多字数
    timeText:"设置期限",
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    startYear: 2000,
    endYear: 2050,
    backlogList:[],
    nowId:0,
    isview:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();

    var list=wx.getStorageSync("backlogList")
    var backlogList=[]
    var nowId=0
    if(list){
      backlogList=list
      nowId=list.length
    }
    console.log(backlogList)
    var id=Number(options.id)
    if(!options.id){
      this.setData({
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        backlogList:backlogList,
        nowId:nowId,
        isview:false
      });
    }
    else{
      var timeText=backlogList[id].time
      var texts=backlogList[id].content
      this.setData({
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        backlogList: backlogList,
        nowId: id,
        isview: true,
        timeText:timeText,
        texts:texts
      });
    }
  },
  changeDateTime(e) {
    var dateTime=e.detail.value
    var year="20"+dateTime[0]
    var month=dateTime[1]+1
    if(month<10)
      month="0"+month
    var day=dateTime[2]+1
    if(day<10)
      day="0"+day
    var hour=dateTime[3]
    if(hour<10)
      hour="0"+hour
    var min=dateTime[4]
    if(min<10)
      min="0"+min
    var timeText=year+"-"+month+"-"+day+" "+hour+":"+min
    console.log(timeText)
    this.setData({ 
      dateTime: e.detail.value, 
      timeText:timeText
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
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
      texts: value  //当前内容
    });
  },
  save:function(){
    var obj={}
    var that=this
    var time=that.data.timeText
    if(time=="设置期限"){
      wx.showModal({
        title: '提示',
        content: '您还没有设置期限',
      })
      return
    }
    var content=that.data.texts
    if(content==""){
      wx.showModal({
        title: '提示',
        content: '您还没有输入内容',
      })
      return
    }
    var backlogList=that.data.backlogList
    var id=that.data.nowId
    var isview=that.data.isview
    if(!isview){
      obj.time=time
      obj.content=content
      obj.id=id
      obj.finished=false
      obj.choose=false      

      backlogList.push(obj)
      wx.setStorage({
        key: 'backlogList',
        data: backlogList,
      })
      var date=new Date()
      var start_time=''
      start_time+=date.getFullYear()
      start_time+='-'
      if(date.getMonth()+1<10){
        start_time+='0'
      }
      start_time+=(date.getMonth()+1)
      start_time += '-'
      if (date.getDate() < 10) {
        start_time += '0'
      }
      start_time+=date.getDate()
      start_time+=' '
      if (date.getHours() < 10) {
        start_time += '0'
      }
      start_time+=date.getHours()
      start_time+=':'
      if (date.getMinutes() < 10) {
        start_time += '0'
      }
      start_time+=date.getMinutes()
      start_time += ':'
      if (date.getSeconds() < 10) {
        start_time += '0'
      }
      start_time+=date.getSeconds()
      
      var deadline_time=time+':00'
      wx.request({
        url:LinshiUrl+'api/v2/todo',
        method:'post',
        header:{
          'Content-Type': 'text/plain;charset:utf-8',
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          uid: global.classes.user_id,
          token: global.classes.token,
          label:'a',
          title:'a',
          content:content,
          start_time:start_time,
          deadline_time: deadline_time,
          priority:1,
          //img_link:'a'
        },
        success(res){
          if(res.data.status=='created'){
            //console.log(res)
            wx.redirectTo({
              url: '../backlog',
            })
          }
          else{
            wx.showModal({
              title: '提示',
              content: '您输入的参数有误，例如截止时间必须要大于当前的时间',
            })
          }
        }
      })
    }
    if(isview){
      backlogList[id].time=time+':00'
      backlogList[id].content=content
      console.log(backlogList[id])
      wx.request({
        url: LinshiUrl+'api/v2/todo',
        method: 'put',
        header: {
          'Content-Type': 'text/plain;charset:utf-8',
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          todo_id: backlogList[id].todo_id,
          label: backlogList[id].label,
          title: backlogList[id].title,
          content: backlogList[id].content,
          start_time: backlogList[id].start_time,
          deadline_time: backlogList[id].time,
          priority: backlogList[id].priority,
          img_link: backlogList[id].img_link
        },
        success(res) {
          if (res.data.status == 'updated') {
            console.log(res)
            wx.redirectTo({
              url: '../backlog',
            })
          }
          else {
            wx.showModal({
              title: '提示',
              content: '您输入的参数有误，例如截止时间必须要大于当前的时间',
            })
          }
        }
      })
      /*wx.setStorage({
        key: 'backlogList',
        data: backlogList,
      })*/
    }
  },
  cancal:function(){
    wx.navigateBack({
      delta:1
    })
  }
})