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
        token: global.token,
        newsItems: null,
        page_size: 10,
        keyword: "",
        subcompany_id: "",
        page: 1,
        start: 0,
        end: 10,
        scrollDown: false,
        remind: "加载中",
        scrollHeight: null,
        parm: {
            username: global.account,
            token: global.token,
        },
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    getNewsData: function() {
        var that = this;
        wx.request({
            //url: 'https://wechat.stu.edu.cn//webservice_oa/oa_stu_/GetDOC',
            /*method: 'GET',
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
            */
          url: global.stuUrl+'/credit/api/v2/oa',
            method: 'POST',
            data: that.data.parm,
            header: {
                'Content-Type': 'text/plain;charset:utf-8',
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    newsItems: that.data.newsItems.concat(res.data.data),
                })
                console.log(that.data.newsItems);
            },
            fail: function() {
                console.log("请求失败");
                that.setData({
                    remind: "加载失败，请检查网络",
                })
            },
        })
    },

    onLoad: function() {
        var that = this;
        this.data.parm["page_index"] = this.data.page;
        wx.request({
            /*url: 'https://wechat.stu.edu.cn//webservice_oa/oa_stu_/GetDOC',
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
            */
          url: global.stuUrl+'/credit/api/v2/oa',
            method: 'POST',
            data: that.data.parm,
            header: {
                'Content-Type': 'text/plain;charset:utf-8',
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    newsItems: res.data.data,
                    remind: "加载更多",
                });
                console.log(that.data.newsItems);
            },
            fail: function() {
                console.log("请求失败");
                that.setData({
                    remind: "加载失败，请检查网络",
                })
            },
        })
        wx.getSystemInfo({
            success: function(res) {
                console.info(res.windowHeight);
                let height = res.windowHeight;
                wx.createSelectorQuery().selectAll('#other').boundingClientRect(function(rects) {
                    rects.forEach(function(rect) {
                        console.info(res.windowHeight - rect.bottom);
                        that.setData({
                            scrollHeight: res.windowHeight - rect.bottom
                        });
                    })
                }).exec();
            }
        });
        console.log(this.data.scrollHeight);
    },

    onScroll: function(e) {
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

    getMoreData: function() {
        var that = this;
        if (that.page > 10)
            return
        that.data.parm["page_index"]++;
        this.getNewsData();
        console.log("触发底部事件");
    },

    getPreviousData: function() {
        var that = this;
        if (that.page == 1)
            return
        that.data.parm["page_index"]--;
        this.getNewsData();
    },

    getDetail: function(e) {
        var id = e.currentTarget.dataset.id;
        var detail = this.data.newsItems[id];
        wx.setStorageSync('detail', detail);
        wx.navigateTo({
            url: '../content/content?detail=' + detail
                //url: '../detail/detail'
        });
    },

    collectEvent: function(e) {
        let that = this;
        let date = new Date();
      let id = this.data.newsItems[e.currentTarget.dataset["id"]].ID;
        console.log(e);
            app.td_app_sdk.event({
                id: '1001',
                label: '汕大oa',
                params: {
                    // time: date,
                    title: e._relatedInfo.anchorTargetText,
                    // article_id:id,
                }
            });
    },

    tapEvent: function(e) {
        this.getDetail(e);
        this.collectEvent(e);
    }
})