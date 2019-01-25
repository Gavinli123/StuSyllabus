// pages/discover/manage/manage.js

const testUrl ="http://118.126.92.214:8083/interaction/api/v2/personal_post"
const deleteUrl ="http://118.126.92.214:8083/interaction/api/v2/post"
const testUid = "5"
const testToken = "100004"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList:[],
    addList:[],
    isSelected:[true,false,false],
    page_index:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.request({
      url: testUrl,
      method:'GET',
      data:{
        token:testToken,
        uid:testUid,
        page_index:that.data.page_index,
      },
      success(res){
        console.log(res)
        let addList=res.data.data
        let showList=that.data.showList
        console.log(addList)
        showList=showList.concat(addList)
        that.setData({
          showList,
          addList
        })
        wx.hideLoading()
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '网络出错',
          icon:"none"
        })
      }
    })

    // let showList=wx.getStorageSync('messageList')||[]
    // console.log(showList)
    // that.setData({
    //   showList
    // })
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
    let item=e.currentTarget.dataset.item
    let isSelected=that.data.isSelected
    if(isSelected[item]==true){
      return
    }
    for(let i=0;i<isSelected.length;i++){
      isSelected[i]=false
    }
    isSelected[item]=true
    let showList=[]
    if(item==0){
      showList=wx.getStorageSync('messageList')
    }
    else if(item==1){
      showList = wx.getStorageSync('thingsList')
    }
    else{
      showList = wx.getStorageSync('wallList')
    }
    that.setData({
      isSelected,
      showList
    })
  },
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id
    let mode = e.currentTarget.dataset.mode || '表白墙'
    console.log(id)
    let that=this
    let isSelected=that.data.isSelected
    let category='message'
    if(isSelected[1]){
      category = 'things'
    }
    else if(isSelected[2]){
      category='wall'
    }
    wx.navigateTo({
      url: '../contentDetail/contentDetail?id=' + id + '&mode=' + mode + '&category=' + category,
    })
  },
  loadMore:function(){
    wx.showLoading({
      title: '加载中',
    })
    let that=this
    let page_index=that.data.page_index+1
    wx.request({
      url: testUrl,
      method:"GET",
      data:{
        token:testToken,
        uid:testUid,
        page_index:page_index
      },
      success(res){
        if(res.errMsg=='request:ok'){
          console.log(res)
          let addList = res.data.data || []
          //console.log(addList)
          let showList = that.data.showList
          showList = showList.concat(addList)
          //console.log(showList)
          that.setData({
            addList,
            showList,
            page_index
          })
          wx.hideLoading()
        }
        else{
          wx.hideLoading()
          wx.showToast({
            title: '网络出错',
            icon: "none"
          })
        }
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '网络出错',
          icon:"none"
        })
      }
    })
  },
  delete:function(e){
    let that=this
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success:function(res){
        if(res.confirm){
          let id = e.currentTarget.dataset.id
          let index = e.currentTarget.dataset.index
          let showList=that.data.showList
          showList.splice(index,1)
          that.setData({
            showList
          })
          wx.request({
            url: deleteUrl,
            method:"DELETE",
            header:{
              token:testToken,
              uid:testUid,
              id:id
            },
            success(res){
              console.log(res)
            }
          })  
        }
      }
    })
  },

  /*点击修改后的函数 */
  modify:function(e){
    let that=this
    console.log(e)
    /*以下参数从e中获取 */
    let content=e.currentTarget.dataset.content
    let id=e.currentTarget.dataset.id
    let mode=e.currentTarget.dataset.mode
    let photo=e.currentTarget.dataset.photo
    let title=e.currentTarget.dataset.title
    let uid=e.currentTarget.dataset.uid
    let topic=e.currentTarget.dataset.topic

    let topic_id=topic.id

    /*加一个参数判断类别 */
    let isSelected=that.data.isSelected
    let category=''
    if(isSelected[0])
      category='校园动态'
    else if(isSelected[1])
      category='失物招领'
    else if(isSelected[2])
      category='表白墙'

    /*跳转至page/discover/modify页面并传递相关参数*/  
    wx.navigateTo({
      url: '../modify/modify?content='+content+'&id='+id+'&mode='+mode+'&photo='+photo+'&title='+title+'&uid='+uid+'&category='+category+'&topic_id='+topic_id,
    })
  }
})