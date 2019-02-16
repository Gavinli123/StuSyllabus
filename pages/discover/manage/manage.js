// pages/discover/manage/manage.js
const findlostUrl ="http://118.126.92.214:8083/extension/api/v2/personal_findlosts"
const testUrl ="http://118.126.92.214:8083/interaction/api/v2/personal_post"
const deleteUrl ="http://118.126.92.214:8083/interaction/api/v2/post"
const deleteUrl1 = "http://118.126.92.214:8083/extension/api/v2/findlost"
const testUid = "5"
const testToken = "100004"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList:[],
    addList:[],
    isSelected:[true,false],
    page_index:1,
    page_index1:1,
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
        page_index:1,
      },
      success(res){
        console.log(res)
        let addList=res.data.data
        let showList=that.data.showList
        console.log(addList)
        showList=showList.concat(addList)
        wx.setStorageSync('manage0',showList)
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
    let that=this
    let isSelected=that.data.isSelected
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    if(isSelected[0]){
      wx.request({
        url: testUrl,
        method: 'GET',
        data: {
          token: testToken,
          uid: testUid,
          page_index: 1,
        },
        success(res) {
          console.log(res)
          let addList = res.data.data
          let showList = that.data.showList
          console.log(addList)
          showList = showList.concat(addList)
          wx.setStorageSync('manage0', showList)
          that.setData({
            showList,
            addList,
            page_index:1
          })
          wx.hideLoading()
          wx.showToast({
            title: '刷新成功',
          })
        },
        fail() {
          wx.hideLoading()
          wx.showToast({
            title: '网络出错',
            icon: "none"
          })
        }
      })
    }
    else if(isSelected[1]){
      wx.request({
        url: findlostUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          uid: testUid,
          token: testToken,
          page_index: 1,
          page_size: 10
        },
        success(res) {
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            console.log(showList)
            wx.setStorageSync('manage1', showList)
            that.setData({
              showList,
              addList: showList,
              page_index1:1,
            })
            wx.hideLoading()
            wx.showToast({
              title: '刷新成功',
            })
          }
          else {
            wx.hideLoading()
            wx.showToast({
              title: '出现错误',
              icon: none
            })
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: none
          })
        }
      })
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
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      showList=wx.getStorageSync('manage0')||[]
      if(showList.length==0){
        wx.request({
          url: testUrl,
          method: 'GET',
          data: {
            token: testToken,
            uid: testUid,
            page_index:1,
          },
          success(res) {
            console.log(res)
            let addList = res.data.data
            let showList = addList
            wx.setStorageSync('manage0', showList)
            that.setData({
              showList,
              addList
            })
            wx.hideLoading()
          },
          fail() {
            wx.hideLoading()
            wx.showToast({
              title: '网络出错',
              icon: "none"
            })
          }
        })  
      }
      else {
        let aList=[]
        let yu=showList.length%10
        if(yu==0){
          aList=showList.slice(showList.length-10)
        }
        that.setData({
          showList,
          addList:aList
        })
        wx.hideLoading()
      }
    }
    else if(item==1){
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      showList = wx.getStorageSync('manage1')||[]
      console.log(showList)
      if(showList.length==0){
        wx.request({
          url: findlostUrl,
          method:'GET',
          header: {
            'Content-Type': 'application/json',
          },
          data:{
            uid:testUid,
            token:testToken,
            page_index:1,
            page_size:10
          },
          success(res){
            if(res.statusCode==200){
              showList=res.data.data.findlost_list
              console.log(showList)
              wx.setStorageSync('manage1',showList)
              that.setData({
                showList,
                addList:showList
              })
              wx.hideLoading()
            }
            else{
              wx.hideLoading()
              wx.showToast({
                title: '出现错误',
                icon:none
              })
            }
          },
          fail(res){
            wx.hideLoading()
            wx.showToast({
              title: '出现错误',
              icon: none
            })
          }
        })
      }
      else{
        let aList = []
        let yu = showList.length % 10
        if (yu == 0) {
          aList = showList.slice(showList.length - 10)
        }
        that.setData({
          showList,
          addList: aList
        })
        wx.hideLoading()
      }
    }
    that.setData({
      isSelected,
    })
  },
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    let that=this
    let isSelected=that.data.isSelected
    let category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: '../contentDetail/contentDetail?id=' + id + '&category=' + category,
    })
  },

  /*跳转到失物招领的正文 */
  toDetail1: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    let that = this
    wx.navigateTo({
      url: '/pages/discover/findlostDetail/findlostDetail?id=' + id,
    })
  },
  loadMore:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
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
          let showList = that.data.showList
          showList = showList.concat(addList)
          wx.setStorageSync('manage0', showList)
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

  /*失物招领的加载更多 */
  loadMore1: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    let page_index1 = that.data.page_index1 + 1
    wx.request({
      url: findlostUrl,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        token: testToken,
        uid: testUid,
        page_index: page_index1,
        page_size:10,
      },
      success(res) {
        if (res.statusCode == 200) {
          console.log(res)
          let addList = res.data.data.findlost_list || []
          let showList = that.data.showList
          showList = showList.concat(addList)
          wx.setStorageSync('manage1', showList)
          that.setData({
            addList,
            showList,
            page_index1
          })
          wx.hideLoading()
        }
        else {
          wx.hideLoading()
          wx.showToast({
            title: '网络出错',
            icon: "none"
          })
        }
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '网络出错',
          icon: "none"
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
          wx.showLoading({
            title: '删除中',
            mask:true
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
              /*删除成功则请求后台刷新当前显示条目 */
              if(res.statusCode==200){
                wx.request({
                  url: testUrl,
                  method: 'GET',
                  data: {
                    token: testToken,
                    uid: testUid,
                    page_index: 1,
                    page_size:that.data.page_index*10
                  },
                  success(res) {
                    console.log(res)
                    let showList = res.data.data
                    let addList = showList.slice(showList.length-10)
                    wx.setStorageSync('manage0', showList)
                    that.setData({
                      showList,
                      addList,
                    })
                    wx.hideLoading()
                    wx.showToast({
                      title: '删除成功',
                    })
                  },
                  fail() {
                    wx.hideLoading()
                    wx.showToast({
                      title: '网络出错',
                      icon: "none"
                    })
                  }
                })
              }
              else{
                wx.hideLoading()
                wx.showToast({
                  title: '出现错误',
                  icon:none
                })
              }
            },
            fail(res){
              wx.hideLoading()
              wx.showToast({
                title: '出现错误',
                icon: none
              })
            }
          })  
        }
      }
    })
  },

  /*失物招领删除 */
  delete1: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          let index = e.currentTarget.dataset.index
          wx.showLoading({
            title: '删除中',
            mask: true
          })
          wx.request({
            url: deleteUrl1,
            method: "DELETE",
            header: {
              token: testToken,
              uid: testUid,
              findlostid: id
            },
            success(res) {
              /*删除成功则请求后台刷新当前显示条目 */
              if (res.statusCode == 200) {
                wx.request({
                  url: findlostUrl,
                  method: 'GET',
                  data: {
                    token: testToken,
                    uid: testUid,
                    page_index: 1,
                    page_size: that.data.page_index1 * 10
                  },
                  success(res) {
                    console.log(res)
                    let showList = res.data.data.findlost_list
                    let addList = showList.slice(showList.length - 10)
                    wx.setStorageSync('manage1', showList)
                    that.setData({
                      showList,
                      addList,
                    })
                    wx.hideLoading()
                    wx.showToast({
                      title: '删除成功',
                    })
                  },
                  fail() {
                    wx.hideLoading()
                    wx.showToast({
                      title: '网络出错',
                      icon: "none"
                    })
                  }
                })
              }
              else {
                wx.hideLoading()
                wx.showToast({
                  title: '出现错误',
                  icon: none
                })
              }
            },
            fail(res) {
              wx.hideLoading()
              wx.showToast({
                title: '出现错误',
                icon: none
              })
            }
          })
        }
      }
    })
  },

  /*校园动态&表白墙修改 */
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
    if(isSelected[0]){
      if(mode=='表白墙'){
        category='表白墙'
      }
      else{
        category='校园动态'
      }
    }
    /*跳转至page/discover/modify页面并传递相关参数*/  
    wx.navigateTo({
      url: '../modify/modify?content='+content+'&id='+id+'&mode='+mode+'&photo='+photo+'&title='+title+'&uid='+uid+'&category='+category+'&topic_id='+topic_id,
    })
  },

  /*失物招领修改 */
  modify1: function (e) {
    let that = this
    console.log(e)
    /*以下参数从e中获取 */
    let content = e.currentTarget.dataset.content
    let id = e.currentTarget.dataset.id
    let mode = e.currentTarget.dataset.mode
    let photo = e.currentTarget.dataset.photo
    let title = e.currentTarget.dataset.title
    let uid = e.currentTarget.dataset.uid
    let contact = e.currentTarget.dataset.contact
    let location = e.currentTarget.dataset.location

    /*加一个参数判断类别 */
    let category = '失物招领'
    /*跳转至page/discover/modify页面并传递相关参数*/
    wx.navigateTo({
      url: '../modify/modify?content=' + content + '&id=' + id + '&mode=' + mode + '&photo=' + photo + '&title=' + title + '&uid=' + uid + '&category=' + category + '&contact=' + contact+'&location='+location,
    })
  }
})