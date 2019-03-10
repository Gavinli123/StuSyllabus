var app = getApp()
var color = require('../../util/color.js')

var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    week: ['', '一', '二', '三', '四', '五', '六', '日'],
    times: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C']
  },
  years_index: global.years.year_index,
  semester_index: global.semester.semester_index,
  week: 0,

  onLoad: function (options) {
    if(global.classes){
      this.refalshSyllabus()
    }
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let classes = wx.getStorageSync('classes')
    if (global.account && global.password) {
      this.refalshSyllabus(classes)
      this.classes = classes
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // 进入更新日志
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
    // wx.request({
    //   url: 'https://stuapps.com/credit/api/v2/term',
    //   success(res) {
    //     console.log(res)
    //     let start_date = new Date(res.data.start_date)
    //     let end_date = new Date(res.data.end_date)
    //     let this_year = 2018
    //     let enrollment_year = Number.parseInt(global.years.enrollment_year)
    //     let yearIndex = Number.parseInt(global.years.year_index)
    //     if ((this_year - enrollment_year) != yearIndex) {
    //       global.week = 16
    //       wx.setNavigationBarTitle({
    //         title: '第 ' + global.week + ' 周'
    //       })
    //     }
    //     else {
    //       let nowDate = new Date()
    //       let days = Math.floor((nowDate - start_date) / (1000 * 60 * 60 * 24))
    //       let week = Math.floor(days / 7) + 1
    //       global.week = week
    //       wx.setNavigationBarTitle({
    //         title: '第 ' + global.week + ' 周'
    //       })
    //     }
    //   },
    //   complete(res){
    //     console.log(res)
    //   }
    // })
    let version = wx.getStorageSync('version')
    if (version !== global.version) {
      wx.setStorage({
        key: 'version',
        data: global.version,
      })
      wx.navigateTo({
        url: '/pages/me/update_log/update_log',
      })
      return
    }
     wx.setNavigationBarTitle({
       title: '第 ' + global.week + ' 周'
     })

    if (!global.account || !global.password) {
      wx.switchTab({
        url: '/pages/me/me'
      })
      return
    }
    if (this.data.curWeek !== global.week) {
      this.setData({
        curWeek: global.week
      })
    }

    if ((global.years.year_index !== this.years_index || global.semester.semester_index !== this.semester_index) || global.refalshClasses) {
      this.refalshSyllabus()
      if (global.refalshClasses) {
        global.refalshClasses = false
      }
    }
  },

  showClassDetail(e) {
    let lessonJson = JSON.stringify(this.data.classes[e.currentTarget.dataset.index])
    //console.log(lessonJson)
    wx.navigateTo({
      url: 'detail/detail?lesson=' + lessonJson
    })
  },


  refalshSyllabus(classes) {
    function getWeek(startdate) {
      let this_year = 2018
      let enrollment_year = Number.parseInt(global.years.enrollment_year)
      let yearIndex = Number.parseInt(global.years.year_index)
      if ((this_year - enrollment_year) == yearIndex) {
        startdate = new Date(startdate)
        let today = new Date()
        let days = Math.floor((today - startdate) / (1000 * 60 * 60 * 24))
        let week = Math.floor(days / 7) + 1
        global.week = week
      }
    }
    getWeek('2019-2-24')
    let that = this
    if (classes) {
      that.showClass(classes)
    } else {
      this.years_index = global.years.year_index
      this.semester_index = global.semester.semester_index
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: global.stuUrl + '/credit/api/v2/syllabus',         //mark
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          username: global.account,
          password: global.password,
          years: global.years.year_picker[global.years.year_index],
          semester: global.semester.semester_index,
          submit: ' query'
        },
        success(res) {
          if (res.statusCode != '200') {
            let errorMsg
            if (res.data.ERROR === "the password is wrong") {
              app.signout()
              wx.showModal({
                title: '错误',
                content: '校园网密码已更改，请重新登录',
                showCancel: false,
                confirmColor: "#2d8cf0",
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.switchTab({
                      url: '/pages/me/me',
                      success: function (res) { }
                    })
                  }
                }
              })

            } else {
              if (res.data.ERROR || res.data.error) {
                errorMsg = res.data.ERROR || res.data.error
              } else {
                errorMsg = '未知错误'
              }
            }
            app.showError(errorMsg)
            return
          }
          let classes = res.data
          console.log(res.data)
          that.classes = classes
          app.updateLoginMsg({
            classes: classes
          })
          that.showClass(classes.classes)

          //app.saveClasses()
        },
        complete(res) {
          wx.hideLoading()
          console.log(that.classes.classes)
          //console.log(global.classes)
          console.log(that.lessons)
        }
      })
    }
  },

  showClass(classes) {

    var that = this
    var lessons = []

    for (let i = 0; i < classes.length; i++) {
      var classname = classes[i].name
      classname = classname.replace(/\[.*\]/, '')
      var room = classes[i].room
      room = room.replace('座', '')
       //console.log(classname)
      var classColor = color[i % color.length]
      
      let mytimeList = []
      //let danshuang=''
      for(let j in classes[i].days){
        if(classes[i].days[j]!='None'){
            var obj={}
            obj.day_in_week=Number(j[1])
            obj.time=classes[i].days[j]
            if(obj.time[0]=='单'){
              obj.danshuang='dan'
              obj.time=obj.time.substring(1)
              mytimeList.push(obj)  
            }
            else if (obj.time[0] == '双'){
              obj.danshuang = 'shuang'
              obj.time = obj.time.substring(1)
              mytimeList.push(obj)
            }
            else{
              obj.danshuang='both'
              mytimeList.push(obj)
            }
        }
      }
      if(mytimeList){
      for (var k=0;k<mytimeList.length;k++){
        let weekList=[]
        for(let weekIndex=0;weekIndex<16;weekIndex++){
          weekList[weekIndex]=0
        }
        let start=1
        let end=16
        let value = classes[i].duration.replace(/[^0-9]/ig, "")
        if(value<100){
          let values=String(value)
          start=Number(values[0])
          end=Number(values[1])
        }
        else if(value<1000){
          let values = String(value)
          start = Number(values[0])
          end = Number(values.substring(1))
        }
        else{
          let values = String(value)
          start = Number(values[0].substring(0,1))
          end = Number(values.substring(2))
        }
        for(let weekIndex=start-1;weekIndex<end;weekIndex++){
          weekList[weekIndex]=1
        }

        lessons.push({
          lessonIndex:i,
          left: mytimeList[k].day_in_week == 0 ? 7 : mytimeList[k].day_in_week,
          top:that.transformClassTime(mytimeList[k].time),
          height:mytimeList[k].time.length,
          color:classColor,
          classname,
          room,
          week:weekList,
          danshuang:mytimeList[k].danshuang
        })
      }
      }
      console.log(lessons)
      //console.log(mytimeList)

      /*for (let j in classes[i].class_schedule) {
        // console.log(j)
        let timeList = that.splitTime(classes[i].class_schedule[j].time)
        // console.log(timeList)
        for (let index in timeList) {

          lessons.push({
            lessonIndex: i,
            left: classes[i].class_schedule[j].day_in_week === 0 ? 7 : classes[i].class_schedule[j].day_in_week,
            top: that.transformClassTime(timeList[index]),
            height: timeList[index].length,
            color: classColor,
            classname,
            room,
            week: classes[i].class_schedule[j].weeks
          })
        }
      console.log(lessons)
      }*/

    }
    this.setData({
      lessons,
      classes
    })
  },
  // 分割课程，一天内多节课的课程，如：67AB
  splitTime(time) {
    let timeList = []
    let standardTime = '1234567890ABC'
    for (var i = 1; i < time.length; i++) {
      let subStr = time.substring(0, i)
      if (standardTime.indexOf(subStr) != -1) {
        continue
      } else {
        // 需要分割
        timeList.push(time.substring(0, i - 1))
        let item = this.splitTime(time.substring(i - 1))
        timeList = timeList.concat(item)
        break
      }
    }
    if (timeList.length == 0) {
      timeList.push(time)
    }
    return timeList
  },

  transformClassTime(timeStr) {

    var top = Number(timeStr.charAt(0))

    if (!top) {
      switch (timeStr.charAt(0)) {
        case 'A': top = 11
          break
        case 'B': top = 12
          break
        case 'C': top = 13
      }
    }
    if (top === 0) {

      top = 10
    }
    // console.log(top)
    return top
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    let that = this
    wx.showActionSheet({
      itemList: [
        '刷新课表',
        '设置课表',
        // '新增课程'
      ],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)

          if (res.tapIndex === 0) {
            that.refalshSyllabus()
          } else if (res.tapIndex === 1) {
            wx.navigateTo({
              url: 'setting/setting'
            })
          } else if (res.tapIndex === 2) {
            wx.navigateTo({
              url: 'addClass/addClass',
            })
          }
        }

      }
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    if (!this.classes) {
      wx.showModal({
        title: '提示',
        content: '请等待课表加载完毕',
        showCancel: false
      })
      return
    }
    let that = this
    wx.showShareMenu({
      withShareTicket: true
    })

    return {
      title: global.userInfo.nickName + '的课表',
      path: '/pages/classes/share/share?nickName=' + global.userInfo.nickName + '&week=' + global.week + '&classes=' + JSON.stringify(that.classes),
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }


  },

  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
      let curWeek=global.week
      if(curWeek>0){
        curWeek--
        global.week=curWeek
      }
    }
    // 向右滑动   
    if (touchMove - touchDot >= 40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向左滑动");
      let curWeek = global.week
      if (curWeek < 20) {
        curWeek++
        global.week = curWeek
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
});