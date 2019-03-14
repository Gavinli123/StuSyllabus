// pages/arrange/arrange.js
const testUrl = "http://118.126.92.214:8083"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 6,         //下拉刷新次数的限制，初步设为每分钟6次，即10s内只能请求一次
    currentTimeStamp: 0,  //当前时间戳，预设为0，目的是让第一次下拉刷新可以请求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /*该函数的作用是处理获取到的数据 */
    function dealWithExamsData(exams) {
      for (let i = 0; i < exams.length; i++) {
        exams[i].exam_class = exams[i].exam_class.replace(/\[.*?\]/g, '')  //去掉[]及其里面的内容
        exams[i].time = exams[i].exam_time.split('(')    //将时间分成两部分
        exams[i].time[1] = exams[i].time[1].slice(0, exams[i].time[1].length - 1)

        /*下面是来求倒计时的 */
        let temp = exams[i].time[1].split('  ')
        let temp0 = temp[0].split('.')
        let temp1 = temp[1].split('-')
        let date = temp0.join('-')
        date += ' '
        date += temp1[0]
        date = new Date(date).getTime() / 1000
        let d601 = new Date('2018-06-25 13:35:00').getTime() / 1000   /**测试用的，看下效果 */
        let now = new Date().getTime() / 1000
        let countDown = date - now

        /*这个函数的作用是计算倒计时，如果不是已结束或者进行中，返回一个对象 */
        function calCountDown(countdown) {
          if (countdown <= 0) {
            if (countDown + 7200 > 0) {   //考试都是两小时吧。。
              return '进行中'
            }
            return '已结束'
          }
          let obj = {}
          let day = Math.floor(countdown / 86400)
          let dayYu = countDown % 86400
          obj.day = day
          if (dayYu != 0) {
            let hour = Math.floor(dayYu / 3600)
            let hourYu = dayYu % 3600
            obj.hour = hour
            if (hourYu != 0) {
              let minute = Math.round(hourYu / 60)
              obj.minute = minute
            }
          }
          return obj
        }
        countDown = calCountDown(countDown)
        exams[i].countDown = countDown
      }
      return exams
    }
    let that = this
    wx.setNavigationBarTitle({
      title: '考试安排',
    })
    /*如果本地存储中的信息存在且为当前用户选择的学年及学期，则直接获取 */
    let eArrange = wx.getStorageSync('examArrange') || ''
    if (eArrange != '' && eArrange.semester == global.semester.semester_index && eArrange.years == global.years.year_picker[Number.parseInt(global.years.year_index)]) {
      that.setData({
        examArrange: eArrange
      })
      console.log(that.data.examArrange)
      return
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: global.stuUrl + '/credit/api/v2/exam',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': wx.getStorageSync('creditCookie') || '',
      },
      data: {
        username: global.account,
        password: global.password,
        years: global.years.year_picker[Number.parseInt(global.years.year_index)],
        semester: global.semester.semester_index,
        submit: ' query'
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.ERROR == 'no exams' || res.data.EXAMS.length == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '当前学期暂无考试',
              icon: 'none'
            })
            return
          }
          let examArrange = {}
          examArrange.years = global.years.year_picker[Number.parseInt(global.years.year_index)]
          examArrange.semester = global.semester.semester_index
          examArrange.exams = dealWithExamsData(res.data.EXAMS)
          console.log(examArrange)
          that.setData({
            examArrange
          })
          wx.setStorageSync('examArrange', examArrange)
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
    /*该函数的作用是处理获取到的数据 */
    function dealWithExamsData(exams) {
      for (let i = 0; i < exams.length; i++) {
        exams[i].exam_class = exams[i].exam_class.replace(/\[.*?\]/g, '')  //去掉[]及其里面的内容
        exams[i].time = exams[i].exam_time.split('(')    //将时间分成两部分
        exams[i].time[1] = exams[i].time[1].slice(0, exams[i].time[1].length - 1)

        /*下面是来求倒计时的 */
        let temp = exams[i].time[1].split('  ')
        let temp0 = temp[0].split('.')
        let temp1 = temp[1].split('-')
        let date = temp0.join('-')
        date += ' '
        date += temp1[0]
        date = new Date(date).getTime() / 1000
        let d601 = new Date('2018-06-25 13:35:00').getTime() / 1000   /**测试用的，看下效果 */
        let now = new Date().getTime() / 1000
        let countDown = date - now

        /*这个函数的作用是计算倒计时，如果不是已结束或者进行中，返回一个对象 */
        function calCountDown(countdown) {
          if (countdown <= 0) {
            if (countDown + 7200 > 0) {   //考试都是两小时吧。。
              return '进行中'
            }
            return '已结束'
          }
          let obj = {}
          let day = Math.floor(countdown / 86400)
          let dayYu = countDown % 86400
          obj.day = day
          if (dayYu != 0) {
            let hour = Math.floor(dayYu / 3600)
            let hourYu = dayYu % 3600
            obj.hour = hour
            if (hourYu != 0) {
              let minute = Math.round(hourYu / 60)
              obj.minute = minute
            }
          }
          return obj
        }
        countDown = calCountDown(countDown)
        exams[i].countDown = countDown
      }
      return exams
    }

    let that = this
    let currentTimeStamp = that.data.currentTimeStamp
    if (currentTimeStamp == 0) {  //进入页面后第一次进行下拉刷新
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: global.stuUrl + '/credit/api/v2/exam',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': wx.getStorageSync('creditCookie') || '',
        },
        data: {
          username: global.account,
          password: global.password,
          years: global.years.year_picker[Number.parseInt(global.years.year_index)],
          semester: global.semester.semester_index,
          submit: ' query'
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            if (res.data.ERROR == 'no exams' || res.data.EXAMS.length == 0) {
              that.setData({
                currentTimeStamp:Number.parseInt(new Date().getTime()/1000)
              })
              wx.hideLoading()
              wx.showToast({
                title: '当前学期暂无考试',
                icon: 'none'
              })
              return
            }
            let examArrange = {}
            examArrange.years = global.years.year_picker[Number.parseInt(global.years.year_index)]
            examArrange.semester = global.semester.semester_index
            examArrange.exams = dealWithExamsData(res.data.EXAMS)
            console.log(examArrange)
            that.setData({
              examArrange,
              currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
            })
            wx.setStorageSync('examArrange', examArrange)
            wx.hideLoading()
            wx.showToast({
              title: '刷新成功',
            })
          }
          else {
            that.setData({
              currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
            })
            wx.hideLoading()
            wx.showToast({
              title: '出现错误',
              icon: 'none'
            })
          }
        },
        fail(res) {
          console.log(res)
          that.setData({
            currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
          })
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: 'none'
          })
        }
      })
    }
    else {   //currentTimeStamp不等于0 即请求过
      let limit = that.data.limit
      let nowTimeStamp = Number.parseInt(new Date().getTime() / 1000)

      //若小于限制的时间则提示用户
      if ((nowTimeStamp - currentTimeStamp) <= (60 / limit)) {
        let seconds = Number.parseInt((60 / limit) - (nowTimeStamp - currentTimeStamp))
        wx.showToast({
          title: '亲，您的操作过于频繁哦,请在' + seconds + '秒后再刷新',
          icon: 'none'
        })

        wx.stopPullDownRefresh();
        return
      }
      else {  //大于限制则可以请求
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: global.stuUrl + '/credit/api/v2/exam',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': wx.getStorageSync('creditCookie') || '',
          },
          data: {
            username: global.account,
            password: global.password,
            years: global.years.year_picker[Number.parseInt(global.years.year_index)],
            semester: global.semester.semester_index,
            submit: ' query'
          },
          success(res) {
            console.log(res)
            if (res.statusCode == 200) {
              if (res.data.EXAMS.length == 0) {
                that.setData({
                  currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
                })
                wx.hideLoading()
                wx.showToast({
                  title: '当前学期暂无考试',
                  icon: 'none'
                })
                return
              }
              let examArrange = {}
              examArrange.years = global.years.year_picker[Number.parseInt(global.years.year_index)]
              examArrange.semester = global.semester.semester_index
              examArrange.exams = dealWithExamsData(res.data.EXAMS)
              console.log(examArrange)
              that.setData({
                examArrange,
                currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
              })
              wx.setStorageSync('examArrange', examArrange)
              wx.hideLoading()
              wx.showToast({
                title: '刷新成功',
              })
            }
            else {
              that.setData({
                currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
              })
              wx.hideLoading()
              wx.showToast({
                title: '出现错误',
                icon: 'none'
              })
            }
          },
          fail(res) {
            console.log(res)
            that.setData({
              currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
            })
            wx.hideLoading()
            wx.showToast({
              title: '出现错误',
              icon: 'none'
            })
          }
        })
      }
    }

    wx.stopPullDownRefresh();
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
  toDetail: function (e) {
    console.log(e)
    let item = JSON.stringify(e.currentTarget.dataset.item)
    console.log(item)
    wx.navigateTo({
      url: 'detail/detail?item=' + item,
    })
  }
})