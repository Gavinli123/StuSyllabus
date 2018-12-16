// pages/discover/contentDetail/contentDetail.js
const imgurl ='https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImagesUrl: 'https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132',
    nickName:'16eyhuang',
    time:'10-18 10:51',
    title:'',
    content:'',
    positon:'',
    phone:'',
    category:'',
    yishi:true,
    comment:true,
    heat:true,
    comment_list:[
      {
        'userImageUrl':imgurl,
        'nickname':'隐者无名',
        'time':'11-30 14:04',
        'content':'微博粉丝破3万了有什么福利没',
        'reply':'200',
        'likes':'16'
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
        'time': '11-30 14:04',
        'content': '孙哥，内定给我，可以吗',
        'reply': '200',
        'likes': '16'
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
        'time': '11-30 14:04',
        'content': '孙哥，内定给我，可以吗',
        'reply': '200',
        'likes': '16'
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
        'time': '11-30 14:04',
        'content': '孙哥，内定给我，可以吗孙哥，内定给我，可以吗孙哥，内定给我，可以吗孙哥，内定给我，可以吗孙哥，内定给我，可以吗孙哥，内定给我，可以吗孙哥，内定给我，可以吗',
        'reply': '200',
        'likes': '16'
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
        'time': '11-30 14:04',
        'content': '孙哥，内定给我，可以吗',
        'reply': '200',
        'likes': '16'
      },
    ],
    likesList:[
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
      {
        'userImageUrl': imgurl,
        'nickname': '冷先生9527',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let category=options.category
    let mode=options.mode
    let id=Number.parseInt(options.id)
    console.log(options)
    let childList=[]
    if(category=='message'){
      childList=wx.getStorageSync('post_list')
    }
    else if(category=='things'){
      childList=wx.getStorageSync('thingsList')
    }
    else if(category=='wall'){
      childList=wx.getStorageSync('wallList')
    }
    console.log(childList[id])
    let content=childList[id].content
    let title=''
    let position=''
    let phone=''
    let imgs=[]
    let yishi=true
    if(category!='wall'){
      title=childList[id].title
      //imgs=childList[id].imgs
    }
    if(category=='things'){
      position=childList[id].position
      phone=childList[id].phone
      if(mode=='寻主'){
        yishi=false
      }
    }
    that.setData({
      category,
      content,
      title,
      position,
      phone,
      imgs,
      yishi,
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
  previewIcon: function (e) {
    wx.previewImage({
      urls: ['https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132'],
    })
  },
  previewPhoto: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: that.data.imgs[index],
      urls: that.data.imgs,
    })
  },
  change:function(){
    let that=this
    that.setData({
      comment:!that.data.comment
    })
  },
  changeMode:function(){
    let that=this
    that.setData({
      heat:!that.data.heat
    })
  },
})