
const testUrl = "http://118.126.92.214:8083"   //测试用的
Page({

  /**
   * 页面的初始数据
   * username:'17zlzhou',
    password:'18922438268Zhou1',
   */
  data: {
    gradeObj: {
      totalGPA: '0.00',
      totalSubject: 0,
      totalCredit: 0,
      grades: []
    },
    arrow_status: [false, false, false, false, false, false, false, false, false, false, false, false],  //最多12个学期吧..

    limit: 6,         //下拉刷新次数的限制，初步设为每分钟6次，即10s内只能请求一次
    currentTimeStamp: 0,  //当前时间戳，预设为0，目的是让第一次下拉刷新可以请求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '查看成绩',
    })

    if(!global.account||global.account==''){
      wx.showModal({
        title: '提示',
        content: '您还没有登录，无法查看成绩',
      })
      return
    }

    /*该函数的作用是将请求回来的数据进行处理 */
    function changeToGrapeObj(gradeData) {
      let gradeObj = {}
      gradeObj.totalGPA = gradeData.GPA
      let totalSubject = 0
      for (let i = 0; i < gradeData.GRADES.length; i++) {
        totalSubject += gradeData.GRADES[i].length
      }
      gradeObj.totalSubject = totalSubject
      gradeObj.grades = []
      for (let i = 0; i < gradeData.GRADES.length; i++) {
        let obj = {}
        if (gradeData.GRADES[i].length > 0) {
          obj.years = gradeData.GRADES[i][0].years
          obj.semester = gradeData.GRADES[i][0].semester
        }
        else {
          continue
        }
        obj.gradesDetail = []
        obj.subject = 0
        let credit = 0
        let gpa = 0
        for (let j = 0; j < gradeData.GRADES[i].length; j++) {
          let detailobj = {}
          obj.subject++
          detailobj.class_credit = gradeData.GRADES[i][j].class_credit
          detailobj.class_grade = gradeData.GRADES[i][j].class_grade
          detailobj.class_name = gradeData.GRADES[i][j].class_name.replace(/\[.*?\]/g, '')
          obj.gradesDetail.push(detailobj)
          credit += Number.parseFloat(gradeData.GRADES[i][j].class_credit)
          gpa += Number.parseFloat(gradeData.GRADES[i][j].class_credit) * Number.parseFloat(gradeData.GRADES[i][j].class_grade)
        }
        gpa = (gpa / credit / 10 - 5).toFixed(2)
        obj.credit = credit
        obj.gpa = gpa
        gradeObj.grades.push(obj)
      }
      gradeObj.grades.reverse()
      let totalCredit = 0
      for (let i = 0; i < gradeObj.grades.length; i++) {
        totalCredit += gradeObj.grades[i].credit
      }
      gradeObj.totalCredit = totalCredit
      return gradeObj
    }

    let that = this
    let gradeData = wx.getStorageSync('gradeData') || ''
    if (gradeData != '') {  //本地中有成绩数据
      let gradeObj = changeToGrapeObj(gradeData)
      that.setData({
        gradeObj
      })
      console.log(that.data.gradeObj)
    }
    else {  //本地中没有数据则需请求
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: global.stuUrl + '/credit/api/v2/grade',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': wx.getStorageSync('creditCookie') || '',
        },
        data: {
          username: global.account,
          password: global.password,
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            wx.setStorageSync('creditCookie', res.header.Cookie)
            wx.setStorageSync('gradeData', res.data)
            let gradeObj = changeToGrapeObj(res.data)
            that.setData({
              gradeObj
            })
            console.log(that.data.gradeObj)
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
    }
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
    if(!global.account||global.account==''){
      wx.showModal({
        title: '提示',
        content: '请您登陆后再来刷新成绩',
      })
      return
    }

    /*该函数的作用是将请求回来的数据进行处理 */
    function changeToGrapeObj(gradeData) {
      let gradeObj = {}
      gradeObj.totalGPA = gradeData.GPA
      let totalSubject = 0
      for (let i = 0; i < gradeData.GRADES.length; i++) {
        totalSubject += gradeData.GRADES[i].length
      }
      gradeObj.totalSubject = totalSubject
      gradeObj.grades = []
      for (let i = 0; i < gradeData.GRADES.length; i++) {
        let obj = {}
        if (gradeData.GRADES[i].length > 0) {
          obj.years = gradeData.GRADES[i][0].years
          obj.semester = gradeData.GRADES[i][0].semester
        }
        else {
          continue
        }
        obj.gradesDetail = []
        obj.subject = 0
        let credit = 0
        let gpa = 0
        for (let j = 0; j < gradeData.GRADES[i].length; j++) {
          let detailobj = {}
          obj.subject++
          detailobj.class_credit = gradeData.GRADES[i][j].class_credit
          detailobj.class_grade = gradeData.GRADES[i][j].class_grade
          detailobj.class_name = gradeData.GRADES[i][j].class_name.replace(/\[.*?\]/g, '')
          obj.gradesDetail.push(detailobj)
          credit += Number.parseFloat(gradeData.GRADES[i][j].class_credit)
          gpa += Number.parseFloat(gradeData.GRADES[i][j].class_credit) * Number.parseFloat(gradeData.GRADES[i][j].class_grade)
        }
        gpa = (gpa / credit / 10 - 5).toFixed(2)
        obj.credit = credit
        obj.gpa = gpa
        gradeObj.grades.push(obj)
      }
      gradeObj.grades.reverse()
      let totalCredit = 0
      for (let i = 0; i < gradeObj.grades.length; i++) {
        totalCredit += gradeObj.grades[i].credit
      }
      gradeObj.totalCredit = totalCredit
      return gradeObj
    }

    let that = this
    let currentTimeStamp = that.data.currentTimeStamp
    if (currentTimeStamp == 0) {  //进入页面后第一次进行下拉刷新
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: global.stuUrl + '/credit/api/v2/grade',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': wx.getStorageSync('creditCookie') || '',
        },
        data: {
          username: global.account,
          password: global.password,
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            wx.setStorageSync('creditCookie', res.header.Cookie)
            wx.setStorageSync('gradeData', res.data)
            let gradeObj = changeToGrapeObj(res.data)
            that.setData({
              gradeObj,
              currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
            })
            console.log(that.data.gradeObj)
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
    else {  //currentTimeStamp不等于0 即请求过
      let limit = that.data.limit
      let nowTimeStamp = Number.parseInt(new Date().getTime() / 1000)

      //若小于限制的时间则提示用户
      if ((nowTimeStamp - currentTimeStamp) <= (60 / limit)) {
        let seconds = Number.parseInt((60 / limit) - (nowTimeStamp - currentTimeStamp))
        wx.showToast({
          title: '亲，您的操作过于频繁哦,请在' + seconds + '秒后再刷新',
          icon: 'none'
        })
        return
      }
      else {  //大于限制则可以请求
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: global.stuUrl + '/credit/api/v2/grade',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': wx.getStorageSync('creditCookie') || '',
          },
          data: {
            username: global.account,
            password: global.password,
          },
          success(res) {
            console.log(res)
            if (res.statusCode == 200) {
              wx.setStorageSync('creditCookie', res.header.Cookie)
              wx.setStorageSync('gradeData', res.data)
              let gradeObj = changeToGrapeObj(res.data)
              that.setData({
                gradeObj,
                currentTimeStamp: Number.parseInt(new Date().getTime() / 1000)
              })
              console.log(that.data.gradeObj)
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

  //改变按钮的状态以决定是否显示具体成绩
  change: function (e) {
    let that = this
    let index = Number.parseInt(e.currentTarget.dataset.index)
    let arrow_status = that.data.arrow_status
    arrow_status[index] = !arrow_status[index]
    that.setData({
      arrow_status
    })
  }
})