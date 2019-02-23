// pages/discover/findlostDetail/findlostDetail.js
const findlostUrl = "http://118.126.92.214:8083//extension/api/v2/findlost/"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showObj:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    let that = this
    /*获取传过来的id，并以此请求 */
    let id=options.id
    let url = String(findlostUrl + id)
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
      },
      success(res) {
        if (res.statusCode == 200) {
          console.log(res)
          let showObj=res.data
          let imgObj=JSON.parse(showObj.img_link)
          let imgs=[]
          if(imgObj!=null){
            for (let i = 0; i < imgObj.photo_list.length; i++) {
              imgs.push(imgObj.photo_list[i]["size_big"])
            }
          }
          showObj.imgs=imgs
          console.log(showObj)
          that.setData({
            showObj
          })
          wx.hideLoading()
        }
        else {
          console.log(res)
          wx.hideLoading()
        }
      },
      fail(res) {
        console.log(res)
        wx.hideLoading()
      }
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
  
  /*图片预览 */
  previewPhoto:function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: that.data.showObj.imgs[index],
      urls: that.data.showObj.imgs,
    })
  }
})