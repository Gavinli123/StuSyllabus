// pages/discover/modify/modify.js
const testUrl = "http://118.126.92.214:8083/interaction/api/v2/post"
const testUid = "5"
const testToken = "100004"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectData: ['生活', '兼职', '研究', '学习'],//下拉列表的数据
    max: 1000,//最大字数限制
    min:0,
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    index: 0//选择的下拉列表下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    /*获取从manage页面传来的参数并且setData */
    let category=options.category
    let content=options.content
    let id=Number.parseInt(options.id)
    let mode=options.mode
    let photo=[]
    if(options.photo!="null")
      photo=options.photo
    let title=options.title
    let uid=Number.parseInt(options.uid)
    let topic_id=Number.parseInt(options.topic_id)
    let that=this
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
      currentWordNumber
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
    if (that.data.category == '校园动态') {
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
    if (that.data.category == '校园动态') {
      that.setData({
        currentWordNumber: len, //当前字数  
        content: value  //当前内容
      });
    }
    // else if (that.data.type == 'things') {
    //   that.setData({
    //     currentWordNumber: len, //当前字数  
    //     'formData2.content': value  //当前内容
    //   })
    // }
    // else if (that.data.type == 'wall') {
    //   that.setData({
    //     currentWordNumber: len, //当前字数  
    //     'formData3.content': value  //当前内容
    //   })
    // }
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
          uid: uid,
          token: testToken,
          post_type: 0,
          content:content,
          title:title,
          description:mode,
          topic_id: topic_id,
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
})