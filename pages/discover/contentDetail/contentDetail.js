// pages/discover/contentDetail/contentDetail.js
const findlostUrl = "http://118.126.92.214:8083//extension/api/v2/findlost/"
//const testUrl = "http://118.126.92.214:8083/interaction/api/v2/"
const testUrl = global.stuUrl+"/interaction/api/v2/"
const myuid=global.classes.user_id
const mytoken = global.classes.token

const imgurl ='http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImagesUrl: 'http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg',
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
    comment_list:[],
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
    showObj:{},
    maskFlag:false,
    showBottom:false,
    commentinput:'',
    commentCount:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that=this
    /*showObj为要包含要显示的内容的对象 */
    let showObj={}
    /*获取传过来的id值并且请求 */
    let id=options.id
    /*category为0时是校园动态,2是表白墙 */
    let category=Number.parseInt(options.category)

    if(category==0){
      wx.request({
        url: testUrl + 'post/' + id,
        method: 'GET',
        success(res) {
          console.log(res)
          if (res.errMsg == 'request:ok') {
            /*若请求成功则为showObj赋值 */
            showObj.comments = res.data.comments
            showObj.content = res.data.content
            showObj.description = res.data.description
            showObj.id = res.data.id
            showObj.photo_list_json = res.data.photo_list_json
            showObj.imgs=[]
            if(showObj.photo_list_json!=null&&showObj.photo_list_json!=''){
              let imgObj=JSON.parse(showObj.photo_list_json)
              if(imgObj!=null){
                for (let i = 0; i < imgObj.photo_list.length; i++) {
                  if (imgObj.photo_list[i]["size_big"] != "") {
                    showObj.imgs.push(imgObj.photo_list[i]["size_big"])
                  }
                  else {
                    showObj.imgs.push(imgObj.photo_list[i]["size_small"])
                  }
                }
              }
            }
            showObj.post_time = res.data.post_time
            showObj.post_type = res.data.post_type
            showObj.real_uid = res.data.real_uid
            showObj.source = res.data.source
            showObj.thumb_ups = res.data.thumb_ups
            showObj.title = res.data.title
            showObj.topic = res.data.topic
            showObj.user = res.data.user

            /*判断当前用户是否已经为该内容点赞 */
            showObj.isLike = false
            for (let i in showObj.thumb_ups) {
              if (myuid == showObj.thumb_ups[i].uid) {
                showObj.isLike = true
                break
              }
            }
            /*暂且加一个头像 */
            if(res.data.user.image!=null){
              showObj.userImagesUrl = res.data.user.image
            }
            else{
              showObj.userImagesUrl = 'http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg'
            } 

            that.setData({
              showObj,
              current_click_user: showObj.user.nickname
            })

            /*如果评论数组不为空，则请求评论 */
            if (showObj.comments[0]) {
              wx.request({
                url: testUrl + 'post_comments',
                method: 'GET',
                data: {
                  field: 'post_id',
                  value: showObj.id,
                  count: that.data.commentCount
                },
                success(res) {
                  console.log(res)
                  if (res.statusCode == 200) {
                    /*如果请求成功 */
                    let comment_list = res.data.comments
                    for (let i in comment_list) {
                      /*暂且加一个头像 */
                      comment_list[i].userImageUrl = imgurl
                    }
                    that.setData({
                      comment_list
                    })
                  }
                },
                fail(res) {
                  console.log(res)
                }
              })
            }

            console.log(showObj)
            wx.hideLoading()
          }
          else {
            /*若请求失败则提示失败 */
            wx.hideLoading()
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            })
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: 'none'
          })
        }
      })
    }
    else if(category==1){
      let url=String(findlostUrl+id)
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        data:{
        },
        success(res){
          if(res.statusCode==200){

          }
          else{

          }
        },
        fail(res){
          console.log(res)
        }
      })
    }
    else if(category==2){
      wx.request({
        url: testUrl + 'post/' + id,
        method: 'GET',
        success(res) {
          console.log(res)
          if (res.errMsg == 'request:ok') {
            /*若请求成功则为showObj赋值 */
            showObj.comments = res.data.comments
            showObj.content = res.data.content
            showObj.description = res.data.description
            showObj.id = res.data.id
            showObj.photo_list_json = res.data.photo_list_json
            showObj.post_time = res.data.post_time
            showObj.post_type = res.data.post_type
            showObj.real_uid = res.data.real_uid
            showObj.source = res.data.source
            showObj.thumb_ups = res.data.thumb_ups
            showObj.title = res.data.title
            showObj.topic = res.data.topic
            showObj.user = res.data.user

            /*判断当前用户是否已经为该内容点赞 */
            showObj.isLike = false
            for (let i in showObj.thumb_ups) {
              if (myuid == showObj.thumb_ups[i].uid) {
                showObj.isLike = true
                break
              }
            }
            /*表白墙头像 */
            showObj.userImagesUrl = '../../../icon/xin.jpg'

            that.setData({
              showObj,
              current_click_user: showObj.user.nickname
            })

            /*如果评论数组不为空，则请求评论 */
            if (showObj.comments[0]) {
              wx.request({
                url: testUrl + 'post_comments',
                method: 'GET',
                data: {
                  field: 'post_id',
                  value: showObj.id,
                  count: that.data.commentCount
                },
                success(res) {
                  console.log(res)
                  if (res.errMsg == 'request:ok') {
                    /*如果请求成功 */
                    let comment_list = res.data.comments
                    for (let i in comment_list) {
                      /*暂且加一个头像 */
                      comment_list[i].userImageUrl = imgurl
                    }
                    that.setData({
                      comment_list
                    })
                  }
                },
                fail(res) {
                  console.log(res)
                }
              })
            }

            console.log(showObj)
            wx.hideLoading()
          }
          else {
            /*若请求失败则提示失败 */
            wx.hideLoading()
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            })
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: 'none'
          })
        }
      })
    }
    that.setData({
      showBottom:true,
      commentinput:'',
      category
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
    let showObj = that.data.showObj
    let options = {}
    options.id = showObj.id
    options.category = that.data.category
    that.onLoad(options)
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
    let url=[]
    url.push(e.currentTarget.dataset.url)
    wx.previewImage({
      urls:url,
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

  /*正文内对正文的点赞或取消点赞 */
  dianzan:function(){
    let that=this
    let showObj=that.data.showObj
    
    /*若当前是点赞的状态，则请求取消 */
    if(showObj.isLike){
      /*由于请求需要时间，故先设置好数据再请求，以免反应过慢 */
      /*获取点赞的id */
      let like_id
      for(let i in showObj.thumb_ups){
        if(myuid==showObj.thumb_ups[i].uid){
          like_id=showObj.thumb_ups[i].id
          break
        }
      }
      wx.request({
        url: testUrl+'like',
        method:"DELETE",
        header:{
          id:like_id,
          uid:global.classes.user_id,
          token:global.classes.token
        },
        success(res){
          console.log(res)
          if(res.statusCode==200){
            showObj.isLike = false
            showObj.likeNumber--
            that.setData({
              showObj
            })
          }
          else{
            wx.showToast({
              title: '取消点赞失败',
              icon:'none'
            })
          }
        },
        fail(res){
          console.log(res)
          wx.showToast({
            title: '取消点赞失败',
            icon: 'none'
          })
        }
      })
    }
    else{
      /*如果当前用户未点赞，则请求点赞 */
      /*由于请求需要时间，故先设置好数据再请求，以免反应过慢 */

      wx.request({
        url: testUrl+'like',
        method:"POST",
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          post_id: showObj.id,
        },
        success(res){
          console.log(res)
          if(res.statusCode==201){
            showObj.isLike = true
            showObj.likeNumber++
            let flag=0
            for(let i in showObj.thumb_ups){
              if(showObj.thumb_ups[i].uid==global.classes.user_id){
                showObj.thumb_ups[i].id=res.data.id
                flag=1
                break
              }
            }
            if(flag==0){
              showObj.thumb_ups.push({ 'id': res.data.id, 'uid': myuid })
            }
            that.setData({
              showObj
            })
          }
          else{
            wx.showToast({
              title: '点赞失败',
              icon:'none'
            })
          }
        },
        fail(res){
          console.log(res)
          wx.showToast({
            title: '点赞失败',
            icon: 'none'
          })
        }
      })
    }
  },
  /*点击评论后隐藏下方并显示评论框 */
  clickToComment:function(){
    this.setData({
      showBottom:false,
      current_click_user:this.data.showObj.user.nickname
    })
  },
  /*监听输入框内容 */
  commentInput:function(e){
    this.setData({
      commentinput:e.detail.value
    })
  },
  /*点击取消后隐藏评论框显示下方内容 */
  cancalComment:function(){
    this.setData({
      showBottom:true
    })
  },
  /*点击发送则请求评论接口 */
  sendComment:function(){
    let that=this
    /*当前要回复的用户 */
    let atUser =that.data.current_click_user
    let options={}
    let showObj=that.data.showObj
    let category=that.data.category
    let commentinput=that.data.commentinput
    /*若未输入则提示返回 */
    if(commentinput==''){
      wx.showToast({
        title: '您还没输入任何内容',
        icon:'none'
      })
      return
    }
    //console.log(commentinput)
    options.id=showObj.id
    options.category=category
    wx.request({
      url: testUrl+'comment',
      method:'POST',
      data:{
        comment:'@'+atUser+'：'+commentinput,
        token:global.classes.token,
        uid:global.classes.user_id,
        post_id:showObj.id
      },
      success(res){
        console.log(res)
        if(res.statusCode==201){
          that.onLoad(options)
        }
        else{
          wx.showToast({
            title: '评论失败',
            icon:'none'
          })
        }
      },
      fail(res){
        console.log(res)
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        })
      }
    })
  },
  
  /*点击某人的评论即是要回复某人 */
  reply_comment:function(e){
    let that=this
    let showBottom=false
    let current_click_user=e.currentTarget.dataset.user
    that.setData({
      showBottom,
      current_click_user
    })
  },

  /*加载更多 */
  loadMore:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that=this
    let showObj=that.data.showObj
    /*数量加10 */
    let count=that.data.commentCount+10
    wx.request({
      url: testUrl + 'post_comments',
      method: 'GET',
      data: {
        field: 'post_id',
        value: showObj.id,
        count: count
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          /*如果请求成功 */
          let comment_list = res.data.comments
          for (let i in comment_list) {
            /*暂且加一个头像 */
            comment_list[i].userImageUrl = imgurl
          }
          that.setData({
            comment_list,
            commentCount:count
          })
          wx.hideLoading()
        }
        else{
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon:'none'
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
  /*图片预览 */
  previewPhoto: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: that.data.showObj.imgs[index],
      urls: that.data.showObj.imgs,
    })
  }
})