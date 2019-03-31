const stuUrl = 'https://syllabus.candycute.cn/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelected: [true, false, false, false],
    currentTimeStamp:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: '饭卡信息',
    })
    wx.request({
      url: stuUrl + 'card/api/v2/balance',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': wx.getStorageSync('cardCookie') || ''
      },
      data: {
        username: global.account,
        password: global.password,
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.request({
            url: stuUrl + 'card/api/v2/detail',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cookie': wx.getStorageSync('cardCookie') || ''
            },
            data: {
              username: global.account,
              password: global.password,
              days: '90',
            },
            success(res2) {
              console.log(res2)
              if (res2.statusCode == 200) {
                let totalArr = []
                for (let i in res2.data.detail) {
                  res2.data.detail[i].real_days = that.DateMinus(res2.data.detail[i].date + ' 00:00:00')
                  if (res2.data.detail[i].kind != '补助流水') {
                    totalArr.push(res2.data.detail[i])
                  }
                }
                let arr0 = []
                let arr1 = []
                let arr2 = []
                let todayCost = 0
                for (let i in totalArr) {
                  if (totalArr[i].real_days < 1) {
                    if (totalArr[i].kind != '补助流水') {
                      arr0.push(totalArr[i])
                      arr1.push(totalArr[i])
                      arr2.push(totalArr[i])
                    }
                    let flow = Number.parseFloat(totalArr[i].flow)
                    if (totalArr[i].kind != '补助流水' && flow < 0) {
                      todayCost += Math.abs(flow)
                    }
                  }
                  else if (totalArr[i].real_days < 3) {
                    if (totalArr[i].kind != '补助流水') {
                      arr0.push(totalArr[i])
                      arr1.push(totalArr[i])
                      arr2.push(totalArr[i])
                    }
                  }
                  else if (totalArr[i].real_days < 7) {
                    if (totalArr[i].kind != '补助流水') {
                      arr1.push(totalArr[i])
                      arr2.push(totalArr[i])
                    }
                  }
                  else if (totalArr[i].real_days < 30) {
                    if (totalArr[i].kind != '补助流水') {
                      arr2.push(totalArr[i])
                    }
                  }
                }
                let c_day = new Date()
                let time = String(c_day.getMonth() + 1) + '-' + String(c_day.getDate()) + ' ' + String(c_day.getHours()) + ':' + String(c_day.getMinutes())
                let out0 = 0
                let out1 = 0
                let out2 = 0
                let out3 = 0
                for (let i in arr0) {
                  if (Number.parseFloat(arr0[i].flow) < 0)
                    out0 += Math.abs(Number.parseFloat(arr0[i].flow))
                }
                for (let i in arr1) {
                  if (Number.parseFloat(arr1[i].flow) < 0)
                    out1 += Math.abs(Number.parseFloat(arr1[i].flow))
                }
                for (let i in arr2) {
                  if (Number.parseFloat(arr2[i].flow) < 0)
                    out2 += Math.abs(Number.parseFloat(arr2[i].flow))
                }
                for (let i in totalArr) {
                  if (Number.parseFloat(totalArr[i].flow) < 0)
                    out3 += Math.abs(Number.parseFloat(totalArr[i].flow))
                }
                that.setData({
                  balance: res.data.balance,
                  arr0,
                  arr1,
                  arr2,
                  arr3: totalArr,
                  out0: out0.toFixed(2),
                  out1: out1.toFixed(2),
                  out2: out2.toFixed(2),
                  out3: out3.toFixed(2),
                  time,
                  todayCost,
                  avatarUrl:global.userInfo.avatarUrl
                })
                console.log(that.data.balance)
                console.log(that.data.arr0)
                console.log(that.data.arr1)
                console.log(that.data.arr2)
                console.log(that.data.arr3)
                console.log(that.data.out0)
                console.log(that.data.out1)
                console.log(that.data.out2)
                console.log(that.data.out3)
                wx.hideLoading()
              }
              else {
                wx.hideLoading()
                wx.showToast({
                  title: '出现错误',
                  icon: 'none'
                })
              }
            },
            fail(res2) {
              console.log(res2)
              wx.hideLoading()
              wx.showToast({
                title: '出现错误',
                icon: 'none'
              })
            }
          })
        }
        else {
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '出现错误',
          icon: 'none'
        })
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
    let currentTimeStamp=this.data.currentTimeStamp
    if(currentTimeStamp==0){
      this.onLoad()
      this.setData({
        currentTimeStamp:Number.parseInt(new Date().getTime()/1000)
      })
      wx.stopPullDownRefresh()
    }
    else{
      let now = Number.parseInt(new Date().getTime() / 1000)
      if(now-currentTimeStamp>10){
        this.onLoad()
        this.setData({
          currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
        })
        wx.stopPullDownRefresh()
      }
      else{
        let seconds=currentTimeStamp+10-now
        wx.showToast({
          title: '亲，您的操作过于频繁哦,请在' + seconds + '秒后再刷新',
          icon: 'none'
        })
        wx.stopPullDownRefresh()
      }
    }
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

  switch: function (e) {
    let item = Number.parseInt(e.currentTarget.dataset.item)
    let that = this
    let isSelected = that.data.isSelected
    if (isSelected[item] == true)
      return
    for (let i in isSelected) {
      isSelected[i] = false
    }
    isSelected[item] = true
    that.setData({
      isSelected
    })
  },

  DateMinus: function (date1) {//date1:小日期
    var sdate = new Date(date1);
    var now = new Date();
    var days = now.getTime() - sdate.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day;
  }
})