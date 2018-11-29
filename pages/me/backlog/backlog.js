// pages/me/backlog/backlog.js
const LinshiUrl = 'https://stuapps.com/extension/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backlogList:[],
    showchoose:false,
    allchoose:false,
    hidden:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: LinshiUrl + 'api/v2/todo',
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
        console.log(res)
        let backlogList=[]
        for(let index=0;index<res.data.data.eva_list.length;index++){
          let list_obj = {}
          list_obj.choose=false
          list_obj.content=res.data.data.eva_list[index].content
          if (!res.data.data.eva_list[index].status){
            list_obj.finished = false  
          }
          else{
            list_obj.finished=true
          }
          list_obj.id=index
          list_obj.todo_id = res.data.data.eva_list[index].id
          list_obj.time = res.data.data.eva_list[index].deadline_time
          list_obj.img_link = res.data.data.eva_list[index].img_link
          list_obj.label = res.data.data.eva_list[index].label
          list_obj.priority = res.data.data.eva_list[index].priority
          list_obj.release_time = res.data.data.eva_list[index].release_time
          list_obj.start_time = res.data.data.eva_list[index].start_time
          list_obj.title = res.data.data.eva_list[index].title
          backlogList.push(list_obj)
        }
        console.log(backlogList)
        if(backlogList){
          that.setData({
            backlogList:backlogList,
            showchoose:false
          })
          wx.setStorage({
            key: 'backlogList',
            data: backlogList,
          })
        }
        wx.hideLoading()
      }
    })
    /*var backlogList=[]
    var list=wx.getStorageSync("backlogList")
    if(list)
      backlogList=list
    console.log(backlogList)
    this.setData({
      backlogList:backlogList
    })*/
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
  addBacklog:function(){
    wx.redirectTo({
      url: 'addBacklog/addBacklog',
    })
  },
  changeFinish:function(e){
    var id=e.currentTarget.dataset.id
    var that=this
    var backlogList=that.data.backlogList
    let flag=backlogList[id].finished
    let todo_id=backlogList[id].todo_id
    let status=0
    if(flag){
      status=0
    }
    else{
      status=1
    }
    wx.request({
      url: LinshiUrl + 'api/v2/todo_status',
      method: 'put',
      header: {
        'Content-Type': 'text/plain;charset:utf-8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        uid: global.classes.user_id,
        token: global.classes.token,
        todo_id: todo_id,
        status: status
      },
      success:function(res){
      }
    })
    backlogList[id].finished=!backlogList[id].finished
    that.setData({
      backlogList:backlogList
    })
    wx.setStorage({
      key: 'backlogList',
      data: backlogList,
    })
  },
  ToAddBacklog:function(e){
    var id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: 'addBacklog/addBacklog?id='+id,
    })
  },
  longTap:function(e){
    var that=this
    var showchoose=that.data.showchoose
    var backlogList=that.data.backlogList
    var id = e.currentTarget.dataset.id
    var showchoose=true
    backlogList[id].choose=true
    wx.setStorage({
      key: 'backlogList',
      data: backlogList,
    })
    that.setData({
      backlogList:backlogList,
      showchoose:showchoose
    })
  },
  changeChoose:function(e){
    var id = e.currentTarget.dataset.id
    var that = this
    var backlogList = that.data.backlogList
    backlogList[id].choose = !backlogList[id].choose
    that.setData({
      backlogList: backlogList
    })
    wx.setStorage({
      key: 'backlogList',
      data: backlogList,
    })
  },
  cancal:function(){
    var showchoose=false;
    var that=this
    var backlogList=that.data.backlogList
    for(var i=0;i<backlogList.length;i++){
      backlogList[i].choose=false
    }
    that.setData({
      showchoose:showchoose,
      backlogList:backlogList,
      allchoose:false
    })
    wx.setStorage({
      key: 'backlogList',
      data: backlogList,
    })
  },
  allchoose:function(){
    var that=this
    var allchoose=that.data.allchoose
    var backlogList=that.data.backlogList
    if(allchoose){
      for(var i=0;i<backlogList.length;i++){
        backlogList[i].choose=true
      }
      that.setData({
        allchoose: !allchoose,
        backlogList: backlogList
      })
      wx.setStorage({
        key: 'backlogList',
        data: backlogList,
      })
    }
    else{
      for (var i = 0; i < backlogList.length; i++) {
        backlogList[i].choose = false
      }
      that.setData({
        allchoose: !allchoose,
        backlogList: backlogList
      })
      wx.setStorage({
        key: 'backlogList',
        data: backlogList,
      })
    }
  },
  delete:function(){
    let that = this
    function delete_api(todo_id) {
      wx.request({
        url: LinshiUrl + 'api/v2/todo',
        method:'delete',
        header: {
          'Content-Type': 'text/plain;charset:utf-8',
          'content-type': 'application/x-www-form-urlencoded',
          'uid': global.classes.user_id,
          'token': global.classes.token,
          'todoid': todo_id
        },
        data: {
        },
        success(res){
          
        }
      })
    }
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success:function(res){
        if(res.confirm){
          var backlogList = that.data.backlogList
          for (let i = backlogList.length - 1; i >= 0; i--){
            if (backlogList[i].choose){
              delete_api(backlogList[i].todo_id)
            }
          }
          
          for (var i = backlogList.length-1; i>=0; i--) {
            if (backlogList[i].choose) {
              backlogList.splice(i, 1)
            }
          }
          for(var i=0;i<backlogList.length;i++){
            backlogList[i].id=i
          }
          that.setData({
            backlogList: backlogList
          })
          console.log(backlogList)
        }
      },
      complete:function(){
        
      }
    })
  },
  
})