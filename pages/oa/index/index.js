//index.js
//获取应用实例
const app = getApp()
//var gankData = require('../../utils/file_name');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerUrl: ['../../../image/daxiaoren.jpg', '../../../image/yixuelou.jpg', '../../../image/zhenlizhong.jpg'],
    newsItems: null,
    page: 1,
    start: 0,
    end: 10,
    scrollDown: false,
    remind: "加载中",
    scrollHeight: null,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getNewsData: function () {
    var that = this;
    wx.request({
      url: 'https://wechat.stu.edu.cn//webservice_oa/oa_stu_/GetDOC',
      method: 'GET',
      data: {
        token: '',
        subcompany_id: '0',
        keyword: '',
        row_start: that.data.start,
        row_end: that.data.end,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          newsItems: that.data.newsItems.concat(res.data),
        })
        console.log(that.data.newsItems);
      },
      fail: function () {
        console.log("请求失败");
        that.setData({
          remind: "加载失败，请检查网络",
        })
      },
    })
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://wechat.stu.edu.cn//webservice_oa/oa_stu_/GetDOC',
      method: 'GET',
      data: {
        token: '',
        subcompany_id: '0',
        keyword: '',
        row_start: that.data.start,
        row_end: that.data.end,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          newsItems: res.data,
          remind: "加载更多",
        });
        console.log(that.data.newsItems);
      },
      fail: function () {
        console.log("请求失败");
        that.setData({
          remind:"加载失败，请检查网络",
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        let height = res.windowHeight;
        wx.createSelectorQuery().selectAll('#other').boundingClientRect(function (rects) {
          rects.forEach(function (rect) {
            console.info(res.windowHeight - rect.bottom);
            that.setData({
              scrollHeight: res.windowHeight - rect.bottom
            });
          })
        }).exec();
      }
    });
    console.log(this.data.scrollHeight);
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  // getUserInfo: function(e) {
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },


  onScroll: function (e) {
    if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
  },

  getMoreData: function () {
    var that = this;
    if (that.page > 10)
      return
    that.setData({
      page: that.data.page + 1,
      start: that.data.start + 10,
      end: that.data.end + 10,
    })
    this.getNewsData();
    console.log("触发底部事件");
  },

  getPreviousData: function () {
    var that = this;
    if (that.page == 1)
      return
    that.setData({
      page: that.data.page - 1,
      start: that.data.start - 10,
      end: that.data.end - 10,
    })
    this.getNewsData();
  },

  getDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var detail = this.data.newsItems[id];
    wx.setStorageSync('detail', detail);
    wx.navigateTo({
      url: '../content/content?detail=' + detail
    });
  }
})