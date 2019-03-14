// pages/discover/discover.js
//const testUrl ="http://172.16.43.4:8001/interaction/api/v2/"
//const likeUrl ="http://172.16.43.4:8001/interaction/api/v2/like"
//const findlostUrl = "http://118.126.92.214:8083/extension/api/v2/findlosts"
const stuUrl = global.stuUrl+"/interaction/api/v2/posts"
const testUrl = global.stuUrl+"/interaction/api/v2/"
const likeUrl = global.stuUrl+"/interaction/api/v2/like"
const findlostUrl = global.stuUrl+"/extension/api/v2/findlosts"
const myuid=global.classes.user_id
const mytoken=global.classes.token

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearch1:false,
    showSearch: true,
    inputShowed: false,
    inputVal: "",
    isSelected0:true,
    isSelected1:false,
    isSelected2:false,
    jiahao:true,
    schoolSelected:[true,false,false,false],
    schoolSelected0:true,
    schoolSelected1: false,
    schoolSelected2: false,
    schoolSelected3: false,
    ThingSelected0:true,
    ThingSelected1:false,
    WallSelected0:true,
    WallSelected1:false,

    currentModeList:[],
    showList:[],
    page_index:1,
    topic_id:1,
    addList:[],
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e){
    this.setData({
      inputVal: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask:true,
      success(){
        /*设置scrool_view的高度 */
        wx.getSystemInfo({
          success: function (res) {
            console.info(res.windowHeight);
            let height =res.windowHeight - 80
            that.setData({
              scrollHeight:height
            })
          }
        });
      }
    })
    console.log(options)
    let category=options.category||null
    let mode=options.mode||null

    /*校园动态 */
    if(category=="1"){
      /*init_load()函数的作用主要是为请求回来的数据增加一些参数
      包括点赞数、评论数、当前用户是否已点赞、头像（随便加一个）
      校园动态所使用 */
      function init_load(list) {
        for (let i in list) {
          /*图片链接处理 */
          let imgs = []
          let imgObj=''
          if (list[i].photo_list_json != '' && list[i].photo_list_json!=null){
            imgObj = JSON.parse(list[i].photo_list_json)
          }
          if (imgObj != '') {
            for (let j = 0; j < imgObj.photo_list.length; j++) {
              if (imgObj.photo_list[j]["size_big"] != "") {
                imgs.push(imgObj.photo_list[j]["size_big"])
              }
              else {
                imgs.push(imgObj.photo_list[j]["size_small"])
              }
            }
          }
          list[i].imgs = imgs

          list[i].myid = i
          list[i].likeNumber = list[i].thumb_ups.length
          list[i].commentNumber = list[i].comments.length
          if (list[i].user.image==null){
            list[i].user.image = "http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg"
          }
          let isLike = false
          for (let j in list[i].thumb_ups) {
            if (list[i].thumb_ups[j].uid == global.classes.user_id) {
              isLike = true
              break
            }
          }
          list[i].isLike = isLike
          currentModeList.push(list[i])
          showList.push(list[i])
          addList.push(list[i])
        }

        /*下面进行本地存储 */
        let str = String('school' + topic_id)
        wx.setStorageSync(str, showList)
        that.setData({
          schoolSelected,
          showList,
          currentModeList,
          addList,
          page_index,
          topic_id
        })
      }
      let schoolSelected = that.data.schoolSelected
      let current = Number.parseInt(mode)
      let showList = []
      let currentModeList = []
      let addList = []
      /*将请求页重设为1 */
      let page_index = 1
      /*定义请求的模块id 为点击的模块加1*/
      let topic_id = current + 1

      for (let i = 0; i < schoolSelected.length; i++) {
        schoolSelected[i] = false
      }
      if (current == 0) {
        schoolSelected[0] = true
      }
      else if (current == 1) {
        schoolSelected[1] = true
      }
      else if (current == 2) {
        schoolSelected[2] = true
      }
      else if (current == 3) {
        schoolSelected[3] = true
      }

      wx.request({
        url: testUrl + 'post_sort',
        method: "GET",
        data: {
          topic_id: topic_id,
          page_index: page_index,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            init_load(res.data.data)
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
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }

    /*失物招领 */
    else if(category=='2'){
      let kind=Number.parseInt(mode)

      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: findlostUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          kind: kind,
          page_index: 1,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            for (let i = 0; i < showList.length; i++) {
              let imgObj = JSON.parse(showList[i].img_link)
              let imgs = []
              if (imgObj != null) {
                for (let j = 0; j < imgObj.photo_list.length; j++) {
                  imgs.push(imgObj.photo_list[j]["size_big"])
                }
              }
              showList[i].imgs = imgs
            }
            let addList = showList
            let currentModeList = showList
            let str
            if(kind==1){
              str='findlost1'
            }
            else{
              str='findlost0'
            }
            wx.setStorageSync(str, showList)
            that.setData({
              showList,
              addList,
              currentModeList,
              isSelected0:false,
              isSelected1:true,
              isSelected2:false,
              ThingSelected0:kind==1?true:false,
              ThingSelected1:kind==0?true:false,
            })
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
    /*表白墙 */
    else if(category=='3'){
      /*init_load2的作用是为表白墙的数据增加一些参数 */
      function init_load2(list) {
        let currentModeList = []
        let showList = []
        let addList = []
        for (let i in list) {
          list[i].myid = i
          list[i].likeNumber = list[i].thumb_ups.length
          list[i].commentNumber = list[i].comments.length
          let isLike = false
          for (let j in list[i].thumb_ups) {
            if (list[i].thumb_ups[j].uid == global.classes.user_id) {
              isLike = true
              break
            }
          }
          list[i].isLike = isLike
          currentModeList.push(list[i])
          showList.push(list[i])
          addList.push(list[i])
        }
        let str = 'wall1'
        wx.setStorageSync(str, currentModeList)
        that.setData({
          showList,
          currentModeList,
          addList,
          page_index: 1,
          topic_id: 6,
          isSelected0:false,
          isSelected1:false,
          isSelected2:true,
          WallSelected0:true,
          WallSelected1:false
        })
      }

      let mode_ = 2
      wx.request({
        url: testUrl + 'post_sort',
        method: "GET",
        data: {
          mode: mode_,
          topic_id: 6,
          page_index: 1,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            init_load2(res.data.data)
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
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }
    /*无参的情况 */
    else{
      /*page_index的初始值为1，即当前请求第一页 */
      let page_index=that.data.page_index

      function init_load(list){
        let currentModeList = list
        let showList = []
        /*addList为增加的数组，用来判断显示加载更多还是已加载完毕 */
        let addList=[]
        for (let i in currentModeList) {
          /*图片链接处理 */
          let imgs=[]
          let imgObj=''
          if (currentModeList[i].photo_list_json != '' && currentModeList[i].photo_list_json !=null){
            imgObj = JSON.parse(currentModeList[i].photo_list_json)
          }
          if(imgObj!=''){
            for (let j = 0; j < imgObj.photo_list.length; j++) {
              if (imgObj.photo_list[j]["size_big"] != "") {
                imgs.push(imgObj.photo_list[j]["size_big"])
              }
              else {
                imgs.push(imgObj.photo_list[j]["size_small"])
              }
            }
          }
          currentModeList[i].imgs=imgs

          currentModeList[i].myid=i
          currentModeList[i].likeNumber=currentModeList[i].thumb_ups.length
          currentModeList[i].commentNumber=currentModeList[i].comments.length
          if(currentModeList[i].user.image==null){
            currentModeList[i].user.image = "http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg"
          }
          let isLike=false
          for(let j in currentModeList[i].thumb_ups){
            if(currentModeList[i].thumb_ups[j].uid==global.classes.user_id){
              isLike=true
              break
            }
          }
          currentModeList[i].isLike=isLike
          showList.push(currentModeList[i])
          addList.push(currentModeList[i])
        }

        /*将数据本地存储，school1代表校园动态的生活，2代表兼职，以此类推 */
        wx.setStorageSync('school1', showList)
        console.log(currentModeList)
        that.setData({
          currentModeList,
          showList,
          addList
        })
      }

      wx.request({
        url: testUrl+'post_sort',
        method:"GET",
        data:{
          topic_id:1,
          page_index:1,
          page_size:10
        },
        success(res){
          console.log(res)
          if(res.statusCode==200){
            init_load(res.data.data)
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
        fail(res){
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon:'none',
            duration:2000,
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
    /*init_load函数的作用主要是为校园动态请求回来的数据增加一些参数
      包括点赞数、评论数、当前用户是否已点赞、头像（随便加一个）
      用于校园动态的消息 */
    function init_load(list) {
      for (let i in list) {
        /*图片链接处理 */
        let imgs = []
        let imgObj=''
        if (list[i].photo_list_json != '' && list[i].photo_list_json!=null){
          imgObj = JSON.parse(list[i].photo_list_json)
        }
        if (imgObj != '') {
          for (let j = 0; j < imgObj.photo_list.length; j++) {
            if (imgObj.photo_list[j]["size_big"] != "") {
              imgs.push(imgObj.photo_list[j]["size_big"])
            }
            else {
              imgs.push(imgObj.photo_list[j]["size_small"])
            }
          }
        }
        list[i].imgs = imgs

        list[i].myid = i
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        if(list[i].user.image==null){
          list[i].user.image = "http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg"
        }
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == global.classes.user_id) {
            isLike = true
            break
          }
        }
        list[i].isLike = isLike
        currentModeList.push(list[i])
        showList.push(list[i])
        addList.push(list[i])
      }

      /*将请求到的数据本地存储 */
      let str=String('school'+topic_id)
      wx.setStorageSync(str, currentModeList)
      that.setData({
        showList,
        currentModeList,
        addList,
        page_index,
        topic_id
      })
    }

    /*init_load2的作用是为表白墙的数据增加一些参数 */
    function init_load2(list){
      let currentModeList = []
      let showList = []
      let addList = []
      for (let i in list) {
        list[i].myid = i
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == global.classes.user_id) {
            isLike = true
            break
          }
        }
        list[i].isLike = isLike
        currentModeList.push(list[i])
        showList.push(list[i])
        addList.push(list[i])
      }
      let str = ''
      if (WallSelected0) {
        str = 'wall1'
      }
      else {
        str = 'wall2'
      }
      wx.setStorageSync(str, currentModeList)
      that.setData({
        showList,
        currentModeList,
        addList,
        page_index: 1,
        topic_id: 6,
        WallSelected0,
        WallSelected1,
      })
    }

    let that = this
    let isSelected0=that.data.isSelected0
    let isSelected1 = that.data.isSelected1
    let isSelected2 = that.data.isSelected2
    let WallSelected0=that.data.WallSelected0
    let WallSelected1 = that.data.WallSelected1
    let ThingSelected0=that.data.ThingSelected0
    let ThingSelected1 = that.data.ThingSelected1
    let showList = []
    let currentModeList = []
    let addList = []
    let topic_id = that.data.topic_id
    let page_index = 1


    /*处理校园动态的下拉刷新 */
    if(isSelected0){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: testUrl + 'post_sort',
        method: "GET",
        data: {
          topic_id: topic_id,
          page_index: page_index,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            init_load(res.data.data)
            wx.hideLoading()
            wx.showToast({
              title: '刷新成功',
            })
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
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }

    /*处理失物招领的下拉刷新 */
    if(isSelected1){
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      let kind=1
      let str='findlost1'
      if(ThingSelected1){
        kind = 0
        str='findlost0'
      }
      wx.request({
        url: findlostUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          kind: kind,
          page_index:1,
          page_size:10
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            for(let i=0;i<showList.length;i++){
              let imgObj=JSON.parse(showList[i].img_link)
              let imgs=[]
              if(imgObj!=null){
                for (let j = 0; j < imgObj.photo_list.length; j++) {
                  imgs.push(imgObj.photo_list[j]["size_big"])
                }
              }
              showList[i].imgs=imgs
            }
            console.log(showList)
            let addList = showList
            let currentModeList = showList
            wx.setStorageSync(str, showList)
            that.setData({
              showList,
              addList,
              currentModeList,
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

    /*处理表白墙的下拉刷新 */
    if(isSelected2){
      wx.showLoading({
        title: '加载中',
        mask:true
      })

      let mode=1
      if(that.data.WallSelected0){
        mode=2
      }
      wx.request({
        url: testUrl + 'post_sort',
        method: "GET",
        data: {
          mode:mode,
          topic_id: topic_id,
          page_index: page_index,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            init_load2(res.data.data)
            wx.hideLoading()
            wx.showToast({
              title: '刷新成功',
            })
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
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
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
  switchItem:function(e){
    /*init_load()函数的作用主要是为请求回来的数据增加一些参数
      list:待处理的数组  type:0为校园动态;1为失物招领;2为表白墙 */
    function init_load(list,type){
      let currentModeList = []
      let showList = []
      let addList = []
      /*校园动态 */
      if(type==0){
        for (let i in list) {
          /*图片链接处理 */
          let imgs = []
          let imgObj=''
          if (list[i].photo_list_json != null && list[i].photo_list_json!=''){
            imgObj = JSON.parse(list[i].photo_list_json)
          }
          if (imgObj != '') {
            for (let j = 0; j < imgObj.photo_list.length; j++) {
              if (imgObj.photo_list[j]["size_big"] != "") {
                imgs.push(imgObj.photo_list[j]["size_big"])
              }
              else {
                imgs.push(imgObj.photo_list[j]["size_small"])
              }
            }
          }
          list[i].imgs = imgs
          list[i].myid = i
          list[i].likeNumber = list[i].thumb_ups.length
          list[i].commentNumber = list[i].comments.length
          if (list[i].user.image==null){
            list[i].user.image = "http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg"
          }
          let isLike = false
          for (let j in list[i].thumb_ups) {
            if (list[i].thumb_ups[j].uid == global.classes.user_id) {
              isLike = true
              break
            }
          }
          list[i].isLike = isLike
          currentModeList.push(list[i])
          showList.push(list[i])
          addList.push(list[i])
        }

        /*将数据存入校园动态——生活 */
        wx.setStorageSync('school1', currentModeList)
        that.setData({
          showList,
          currentModeList,
          addList,
          page_index:1,
          topic_id:1
        })
      }

      /*失物招领 */
      else if(type==1){
        showList=list
        for (let i = 0; i < showList.length; i++) {
          let imgObj = JSON.parse(showList[i].img_link)
          let imgs = []
          if (imgObj != null) {
            for (let j = 0; j < imgObj.photo_list.length; j++) {
              imgs.push(imgObj.photo_list[j]["size_big"])
            }
          }
          showList[i].imgs = imgs
        }
        currentModeList=showList
        addList=showList
        /*将寻找失物存储到本地 */
        wx.setStorageSync('findlost1', showList)
        that.setData({
          showList,
          currentModeList,
          addList
        })
      }

      /*表白墙 */
      else if(type==2){
        for (let i in list) {
          list[i].myid = i
          list[i].likeNumber = list[i].thumb_ups.length
          list[i].commentNumber = list[i].comments.length
          let isLike = false
          for (let j in list[i].thumb_ups) {
            if (list[i].thumb_ups[j].uid == global.classes.user_id) {
              isLike = true
              break
            }
          }
          list[i].isLike = isLike
          currentModeList.push(list[i])
          showList.push(list[i])
          addList.push(list[i])
        }

        /*将表白墙的按热度存储在本地中 */
        wx.setStorageSync('wall1', currentModeList)
        that.setData({
          showList,
          currentModeList,
          addList,
          page_index:1,
          topic_id:6
        })
      }
    }

    let that=this
    let isSelected0=that.data.isSelected0
    let isSelected1 = that.data.isSelected1
    let isSelected2 = that.data.isSelected2
    let currentModeList=[]
    let showList=[]
    if(isSelected0){
      if (e.currentTarget.dataset.item =="0")
        return
      if(e.currentTarget.dataset.item=="1"){
        /*如果本地存储中已有寻找失物的数据，则不再请求 */
        let dataList = wx.getStorageSync('findlost1') || []
        if (dataList.length > 0) {
          let currentModeList = dataList
          let showList = dataList
          let addList = []
          let yu = dataList.length % 10
          if (yu == 0) {
            addList = dataList.slice(dataList.lenth - 11)
          }
          that.setData({
            currentModeList,
            showList,
            addList,
            isSelected0: false,
            isSelected1: true,
            isSelected2: false,
            ThingSelected0: true,
            ThingSelected1: false,
          })
          return
        }

        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: findlostUrl,
          method: 'GET',
          header: {
            'Content-Type': 'application/json',
          },
          data: {
            uid: global.classes.user_id,
            token: global.classes.token,
            kind: 1,
            page_index:1,
            page_size:10
          },
          success(res) {
            console.log(res)
            if(res.statusCode==200){
              init_load(res.data.data.findlost_list,1)              
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
        isSelected0=false
        isSelected1=true
      }
      else if (e.currentTarget.dataset.item == "2") {
        /*如果本地存储中已有表白墙的数据，则不再请求 */
        let dataList=wx.getStorageSync('wall1')||[]
        if(dataList.length>0){
          let currentModeList = dataList
          let showList = dataList
          let addList = []
          let yu=dataList.length%10
          if(yu==0){
            addList = dataList.slice(dataList.lenth - 11)
          }
          that.setData({
            currentModeList,
            showList,
            addList,
            topic_id:6,
            isSelected0: false,
            isSelected1: false,
            isSelected2: true,
            WallSelected0: true,
            WallSelected1: false,
          })
          return
        }

        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: testUrl + 'post_sort',
          method: "GET",
          data: {
            mode:2,
            topic_id: 6,
            page_index: 1,
            page_size: 10
          },
          success(res) {
            console.log(res)
            if(res.statusCode==200){
              let showList = res.data.data
              init_load(showList, 2)
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
            wx.showToast({
              title: '请求失败',
              icon: 'none',
              duration: 2000,
            })
          }
        })
        isSelected0 = false
        isSelected2 = true
      }
    }
    else if (isSelected1) {
      if (e.currentTarget.dataset.item == "1")
        return
      if (e.currentTarget.dataset.item == "0") {
        /*如果本地存储的校园动态——生活中有数据，则不再请求 */
        let dataList = wx.getStorageSync('school1')
        if (dataList.length > 0) {
          if (dataList.length > 0) {
            let currentModeList = dataList
            let showList = dataList
            let addList = []
            let yu = dataList.length % 10
            if (yu == 0) {
              addList = dataList.slice(dataList.lenth - 11)
            }
            that.setData({
              currentModeList,
              showList,
              addList,
              topic_id: 1,
              isSelected0: true,
              isSelected1: false,
              isSelected2: false,
              schoolSelected: [true, false, false, false],
            })
            return
          }
        }

        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: testUrl + 'post_sort',
          method: "GET",
          data: {
            topic_id: 1,
            page_index: 1,
            page_size: 10
          },
          success(res) {
            console.log(res)
            if(res.statusCode==200){
              let showList = res.data.data
              init_load(showList, 0)
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
            wx.showToast({
              title: '请求失败',
              icon: 'none',
              duration: 2000,
            })
          }
        })
        isSelected0 = true
        isSelected1 = false
      }
      else if (e.currentTarget.dataset.item == "2") {
        /*如果本地存储中已有表白墙的数据，则不再请求 */
        let dataList = wx.getStorageSync('wall1') || []
        if (dataList.length > 0) {
          let currentModeList = dataList
          let showList = dataList
          let addList = []
          let yu = dataList.length % 10
          if (yu == 0) {
            addList = dataList.slice(dataList.lenth - 11)
          }
          that.setData({
            currentModeList,
            showList,
            addList,
            topic_id: 6,
            isSelected0: false,
            isSelected1: false,
            isSelected2: true,
            WallSelected0: true,
            WallSelected1: false,
          })
          return
        }

        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: testUrl + 'post_sort',
          method: "GET",
          data: {
            mode: 2,
            topic_id: 6,
            page_index: 1,
            page_size: 10
          },
          success(res) {
            console.log(res)
            if(res.statusCode==200){
              let showList = res.data.data
              init_load(showList, 2)
              wx.hideLoading()
            }
            else{
              wx.showToast({
                title: '出现错误',
                icon:'none'
              })
            }
          },
          fail(res) {
            wx.hideLoading()
            wx.showToast({
              title: '请求失败',
              icon: 'none',
              duration: 2000,
            })
          }
        })
        isSelected1 = false
        isSelected2 = true
      }
    }
    else if (isSelected2) {
      if (e.currentTarget.dataset.item == "2")
        return
      if (e.currentTarget.dataset.item == "0") {
        
        /*如果本地存储的校园动态——生活中有数据，则不再请求 */
        let dataList=wx.getStorageSync('school1')
        if(dataList.length>0){
          if (dataList.length > 0) {
            let currentModeList = dataList
            let showList = dataList
            let addList = []
            let yu = dataList.length % 10
            if (yu == 0) {
              addList = dataList.slice(dataList.lenth - 11)
            }
            that.setData({
              currentModeList,
              showList,
              addList,
              topic_id: 1,
              isSelected0: true,
              isSelected1: false,
              isSelected2: false,
              schoolSelected: [true, false, false, false],
            })
            return
          }
        }

        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: testUrl + 'post_sort',
          method: "GET",
          data: {
            topic_id: 1,
            page_index: 1,
            page_size: 10
          },
          success(res) {
            console.log(res)
            if(res.statusCode==200){
              let showList = res.data.data
              init_load(showList, 0)
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
            wx.hideLoading()
            wx.showToast({
              title: '请求失败',
              icon: 'none',
              duration: 2000,
            })
          }
        })
        isSelected0 = true
        isSelected2 = false
      }
      else if (e.currentTarget.dataset.item == "1") {
        /*如果本地存储中已有寻找失物的数据，则不再请求 */
        let dataList = wx.getStorageSync('findlost1') || []
        if (dataList.length > 0) {
          let currentModeList = dataList
          let showList = dataList
          let addList = []
          let yu = dataList.length % 10
          if (yu == 0) {
            addList = dataList.slice(dataList.lenth - 11)
          }
          that.setData({
            currentModeList,
            showList,
            addList,
            isSelected0: false,
            isSelected1: true,
            isSelected2: false,
            ThingSelected0: true,
            ThingSelected1: false,
          })
          return
        }

        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: findlostUrl,
          method: 'GET',
          header: {
            'Content-Type': 'application/json',
          },
          data: {
            uid: global.classes.user_id,
            token: global.classes.token,
            kind: 1,
            page_index:1,
            page_size:10
          },
          success(res) {
            console.log(res)
            if (res.statusCode == 200) {
              init_load(res.data.data.findlost_list,1)
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
        isSelected1 =true
        isSelected2 = false
      }
    }

    /*切换后无论如何各个模块都设为第一个，即校园动态的生活，失物招领的寻物，表白墙的按热度 */
    that.setData({
      isSelected0:isSelected0,
      isSelected1: isSelected1,
      isSelected2: isSelected2,
      schoolSelected:[true,false,false,false],
      ThingSelected0:true,
      ThingSelected1:false,
      WallSelected0:true,
      WallSelected1:false,
      currentModeList,
      showList
    })
  },
  switchSchool:function(e){
    /*init_load()函数的作用主要是为请求回来的数据增加一些参数
      包括点赞数、评论数、当前用户是否已点赞、头像（随便加一个） */
    function init_load(list) {
      for (let i in list) {
        /*图片链接处理 */
        let imgs = []
        let imgObj=''
        if (list[i].photo_list_json != null && list[i].photo_list_json!=''){
          imgObj = JSON.parse(list[i].photo_list_json)
        }
        if (imgObj != '') {
          for (let j = 0; j < imgObj.photo_list.length; j++) {
            if (imgObj.photo_list[j]["size_big"] != "") {
              imgs.push(imgObj.photo_list[j]["size_big"])
            }
            else {
              imgs.push(imgObj.photo_list[j]["size_small"])
            }
          }
        }
        list[i].imgs = imgs

        list[i].myid = i
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        if (list[i].user.image==null){
          list[i].user.image = "http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg"
        }
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == global.classes.user_id) {
            isLike = true
            break
          }
        }
        list[i].isLike = isLike
        currentModeList.push(list[i])
        showList.push(list[i])
        addList.push(list[i])
      }
      
      /*下面进行本地存储 */
      let str=String('school'+topic_id)
      wx.setStorageSync(str, showList)
      //wx.setStorageSync('post_list', currentModeList)
      that.setData({
        schoolSelected,
        showList,
        currentModeList,
        addList,
        page_index,
        topic_id
      })
    }

    let that=this
    let schoolSelected=that.data.schoolSelected
    let current=Number.parseInt(e.currentTarget.dataset.item)
    let showList=[]
    let currentModeList=[]
    let addList=[]
    /*若切换则将请求页重设为1 */
    let page_index=1
    /*定义请求的模块id 为点击的模块加1*/
    let topic_id=current+1

    if(schoolSelected[current]==true){
      return
    }
    for(let i=0;i<schoolSelected.length;i++){
      schoolSelected[i]=false
    }
    if(current==0){
      schoolSelected[0]=true
    }
    else if (current == 1) {
      schoolSelected[1] = true
    }
    else if (current == 2) {
      schoolSelected[2] = true
    }
    else if (current == 3) {
      schoolSelected[3] = true
    }

    /*如果本地存储中有对应的模块的数据，则不请求 */
    let str = String('school' + topic_id)
    let dataList = wx.getStorageSync(str)
    console.log(dataList)
    if (dataList.length > 0) {
      let addList=[]
      let chu=Math.floor(dataList.length/10)
      let yu=dataList.length%10
      console.log(yu)
      if(yu==0){
        addList=dataList.slice(dataList.lenth-11)
      }
      console.log(addList)
      that.setData({
        showList: dataList,
        schoolSelected,
        currentModeList:dataList,
        addList,
        topic_id:current+1
      })
      return
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: testUrl + 'post_sort',
      method: "GET",
      data: {
        topic_id: topic_id,
        page_index: page_index,
        page_size: 10
      },
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          init_load(res.data.data)
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
        wx.hideLoading()
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  switchThing:function(e){
    let that=this
    let ThingSelected0 = that.data.ThingSelected0
    let ThingSelected1 = that.data.ThingSelected1
    let current = Number.parseInt(e.currentTarget.dataset.item)
    let currentModeList=that.data.currentModeList
    if(ThingSelected0&&current==0)
      return
    if (ThingSelected1 && current == 1)
      return
    if(ThingSelected0&&current==1){
      /*若本地存储中有寻找失主的信息，则不再请求 */
      let dataList=wx.getStorageSync('findlost0')||[]
      if(dataList.length>0){
        let showList=dataList
        let currentModeList=dataList
        let addList=[]
        let yu=showList.length%10
        if(yu==0){
          addList=showList.slice(showList.length-11)
        }
        that.setData({
          showList,
          currentModeList,
          addList,
          ThingSelected0:false,
          ThingSelected1:true
        })
        return
      }

      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: findlostUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          kind: 0,
          page_index:1,
          page_size:10
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            for (let i = 0; i < showList.length; i++) {
              let imgObj = JSON.parse(showList[i].img_link)
              let imgs = []
              if (imgObj != null) {
                for (let j = 0; j < imgObj.photo_list.length; j++) {
                  imgs.push(imgObj.photo_list[j]["size_big"])
                }
              }
              showList[i].imgs = imgs
            }
            let addList=showList
            let currentModeList=showList
            wx.setStorageSync('findlost0', showList)
            that.setData({
              showList,
              addList,
              currentModeList,
            })
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

      ThingSelected0=false
      ThingSelected1=true
    }
    if (ThingSelected1 && current == 0) {
      /*若本地存储中有寻找失物的信息，则不再请求 */
      let dataList = wx.getStorageSync('findlost1') || []
      if (dataList.length > 0) {
        let showList = dataList
        let currentModeList = dataList
        let addList = []
        let yu = showList.length % 10
        if (yu == 0) {
          addList = showList.slice(showList.length - 11)
        }
        that.setData({
          showList,
          currentModeList,
          addList,
          ThingSelected0:true,
          ThingSelected1:false
        })
        return
      }

      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: findlostUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          uid: global.classes.user_id,
          token: global.classes.token,
          kind: 1,
          page_index:1,
          page_size:10
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            for (let i = 0; i < showList.length; i++) {
              let imgObj = JSON.parse(showList[i].img_link)
              let imgs = []
              if (imgObj != null) {
                for (let j = 0; j < imgObj.photo_list.length; j++) {
                  imgs.push(imgObj.photo_list[j]["size_big"])
                }
              }
              showList[i].imgs = imgs
            }
            let addList=showList
            let currentModeList=showList
            that.setData({
              showList,
              currentModeList,
              addList,
            })
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
      ThingSelected0 = true
      ThingSelected1 = false
    }
    that.setData({
      ThingSelected0:ThingSelected0,
      ThingSelected1: ThingSelected1,
    })
  },

  /*表白墙按时间按热度切换 */
  switchWall: function (e) {
    /*init_load()函数的作用主要是为请求回来的数据增加一些参数*/
    function init_load(list) {
      let currentModeList = []
      let showList = []
      let addList = []
      for (let i in list) {
        list[i].myid = i
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == global.classes.user_id) {
            isLike = true
            break
          }
        }
        list[i].isLike = isLike
        currentModeList.push(list[i])
        showList.push(list[i])
        addList.push(list[i])
      }
      let str=''
      if(WallSelected0){
        str='wall1'
      }
      else{
        str='wall2'
      }
      wx.setStorageSync(str, currentModeList)
      that.setData({
        showList,
        currentModeList,
        addList,
        page_index: 1,
        topic_id: 6,
        WallSelected0,
        WallSelected1,
      })
    }
    let that = this
    let WallSelected0 = that.data.WallSelected0
    let WallSelected1 = that.data.WallSelected1
    let current = Number.parseInt(e.currentTarget.dataset.item)
    if (WallSelected0 && current == 1) {
      /*如果本地存储中有表白墙——按时间的存储信息，则不再请求 */
      let dataList=wx.getStorageSync('wall2')
      if (dataList.length > 0) {
        let currentModeList = dataList
        let showList = dataList
        let addList = []
        let yu = dataList.length % 10
        if (yu == 0) {
          addList = dataList.slice(dataList.lenth - 11)
        }
        that.setData({
          currentModeList,
          showList,
          addList,
          topic_id: 6,
          isSelected0: false,
          isSelected1: false,
          isSelected2: true,
          WallSelected0: false,
          WallSelected1: true,
        })
        return
      }

      WallSelected0 = false
      WallSelected1 = true
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: testUrl + 'post_sort',
        method: "GET",
        data: {
          mode: 1,
          topic_id: 6,
          page_index: 1,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            let showList = res.data.data
            init_load(showList)
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
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }
    else if (WallSelected1 && current == 0) {
      /*如果本地存储中有表白墙——按热度的存储信息，则不再请求 */
      let dataList = wx.getStorageSync('wall1')||[]
      if (dataList.length > 0) {
        let currentModeList = dataList
        let showList = dataList
        let addList = []
        let yu = dataList.length % 10
        if (yu == 0) {
          addList = dataList.slice(dataList.lenth - 11)
        }
        that.setData({
          currentModeList,
          showList,
          addList,
          topic_id: 6,
          isSelected0: false,
          isSelected1: false,
          isSelected2: true,
          WallSelected0: true,
          WallSelected1: false,
        })
        return
      }

      WallSelected0 = true
      WallSelected1 = false
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: testUrl + 'post_sort',
        method: "GET",
        data: {
          mode: 2,
          topic_id: 6,
          page_index: 1,
          page_size: 10
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            let showList = res.data.data
            init_load(showList)
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
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }
    else
      return
  },
  changeAdd:function(){
    let that=this;
    let jiahao=that.data.jiahao;
    jiahao=!jiahao;
    that.setData({
      jiahao:jiahao
    })
  },
  addContent:function(){
    let that=this
    let type
    if(that.data.isSelected0){
      type="news"
    }
    else if(that.data.isSelected1){
      type="things"
    }
    else if(that.data.isSelected2){
      type="wall"
    }
    that.setData({
      jiahao:true
    })
    wx.navigateTo({
      url: 'addContent/addContent?type='+type,
    })
  },
  scroll:function(e){
    let that=this
    that.setData({
      showSearch:false
    })
  },
  upper:function(e){
    let that=this
    that.setData({
      showSearch:true
    })
  },

  /*跳转至校园动态或表白墙正文 */
  toDetail:function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    let category = e.currentTarget.dataset.category
    let autofoucs = e.currentTarget.dataset.autofoucs
    wx.navigateTo({
       url: 'contentDetail/contentDetail?id='+id+'&category='+category+'&autofoucs='+autofoucs,
    })
  },

  /*跳转至失物招领正文 */
  toDetail1:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'findlostDetail/findlostDetail?id=' + id,
    })
  },

  dianzan:function(e){
    console.log(e)
    let id=e.currentTarget.dataset.id
    let myid=Number.parseInt(e.currentTarget.dataset.myid)
    let that=this
    let showList=that.data.showList
    console.log(mytoken)
    if(!showList[myid].isLike){
      //showList[myid].isLike=true
      //showList[myid].likeNumber++
      wx.request({
        url: likeUrl,
        method:"POST",
        header: {
          'Content-Type': 'application/json',
        },
        data:{
          uid:global.classes.user_id,
          token:global.classes.token,
          post_id:id,
        },
        success(res){
          console.log(res)
          if(res.statusCode===201){
            showList[myid].isLike = true
            showList[myid].likeNumber++

            let flag=0
            for (let i in showList[myid].thumb_ups){
              if (showList[myid].thumb_ups[i].uid==global.classes.user_id){
                showList[myid].thumb_ups[i].id=res.data.id
                flag=1
                break
              }
            }
            if(flag==0){
              showList[myid].thumb_ups.push({ 'id': res.data.id, 'uid': global.classes.user_id })
            }
            console.log(showList[myid])
            that.setData({
              showList
            })
          }
          else{
            wx.showToast({
              title: '点赞失败',
              icon:'none'
            })
          }
        }
      })
    }
    else{
      //showList[myid].isLike = false
      //showList[myid].likeNumber--
      let like_id=-1
      for(let i in showList[myid].thumb_ups){
        if(global.classes.user_id==showList[myid].thumb_ups[i].uid){
          like_id = showList[myid].thumb_ups[i].id
          break
        }
      }
      console.log(like_id)
      wx.request({
        url: likeUrl,
        header: {
          uid: global.classes.user_id,
          token: global.classes.token,
          id: like_id,
        },
        method:"delete",
        success(res){
          if(res.statusCode==200){
            showList[myid].isLike = false
            showList[myid].likeNumber--
            that.setData({
              showList
            })
          }
          else{
            wx.showToast({
              title: '取消点赞失败',
              icon:'none'
            })
          }
        }
      })
    }
    //that.setData({
      //showList
    //})
  },
  previewIcon:function(e){
    let url=[]
    url.push(e.currentTarget.dataset.icon)
    wx.previewImage({
      urls: url,
    })
  },
  previewPhoto:function(e){
    let that=this
    let id=e.currentTarget.dataset.id
    let index=e.currentTarget.dataset.index
    wx.previewImage({
      current: that.data.showList[id].imgs[index],
      urls: that.data.showList[id].imgs,
    })
  },
  toManage:function(e){
    let that=this
    that.setData({
      jiahao: true
    })
    wx.navigateTo({
      url: 'manage/manage',
    })
  },

  //加载更多--校园动态
  loadMore:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that=this
    let addList=[]
    
    /*获取当前的一系列信息*/
    let currentModeList=that.data.currentModeList
    let showList=that.data.showList
    let topic_id=that.data.topic_id
    let page_index=Math.floor(showList.length/10)+1

    /*init_load()函数的作用主要是为请求回来的数据增加一些参数
      包括点赞数、评论数、当前用户是否已点赞、头像（随便加一个） */
    function init_load(list){
      /*获取当前本地存储中的对应的模块的存储数据,目的时拿到它的长度*/
      console.log(topic_id)
      let str=String('school'+topic_id)
      let current_postList=wx.getStorageSync(str)
      let list_length=current_postList.length
      for(let i in list){
        list[i].myid=list_length
        list_length++

        /*图片链接处理 */
        let imgs = []
        let imgObj=''
        if(list[i].photo_list_json!=''&&list[i].photo_list_json!=null){
          imgObj = JSON.parse(list[i].photo_list_json)
        }
        if (imgObj != '') {
          for (let j = 0; j < imgObj.photo_list.length; j++) {
            if (imgObj.photo_list[j]["size_big"] != "") {
              imgs.push(imgObj.photo_list[j]["size_big"])
            }
            else {
              imgs.push(imgObj.photo_list[j]["size_small"])
            }
          }
        }
        list[i].imgs = imgs

        list[i].likeNumber =list[i].thumb_ups.length
        list[i].commentNumber =list[i].comments.length
        if(list[i].user.image==null){
          list[i].user.image = "http://bmob-cdn-23814.b0.upaiyun.com/2019/03/12/fd537d4c400cb2cf803adc71731b4387.jpg"
        }
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == global.classes.user_id) {
            isLike = true
            break
          }
        }
        list[i].isLike = isLike
        currentModeList.push(list[i])
        showList.push(list[i])
        addList.push(list[i])
      }
      wx.setStorageSync(str, currentModeList)
      that.setData({
        addList,
        currentModeList,
        showList,
        page_index
      })
    }

    /*请求新的一页 */
    wx.request({
      url: testUrl + 'post_sort',
      method: "GET",
      data: {
        topic_id: topic_id,
        page_index: page_index,
        page_size: 10
      },
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          init_load(res.data.data)
          wx.hideLoading()
        }
        else{
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  /*加载更多--失物招领 */
  loadMore1:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that=this
    let ThingSelected0=that.data.ThingSelected0
    let ThingSelected1 = that.data.ThingSelected1
    let showList=that.data.showList
    let addList=[]
    let kind=1
    let str='findlost1'
    if(ThingSelected1){
      kind=0
      str='findlost0'
    }
    let dataList=wx.getStorageSync(str)||[]
    let page_index = Math.floor(dataList.length / 10) + 1
    /*请求新的一页 */
    wx.request({
      url: findlostUrl,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        uid: global.classes.user_id,
        token: global.classes.token,
        kind: kind,
        page_index:page_index,
        page_size:10
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          for(let i=0;i<res.data.data.findlost_list.length;i++){
            showList.push(res.data.data.findlost_list[i])
            addList.push(res.data.data.findlost_list[i])
          }
          for (let i = 0; i < showList.length; i++) {
            let imgObj = JSON.parse(showList[i].img_link)
            let imgs = []
            if (imgObj != null) {
              for (let j = 0; j < imgObj.photo_list.length; j++) {
                imgs.push(imgObj.photo_list[j]["size_big"])
              }
            }
            showList[i].imgs = imgs
          }
          console.log(showList)
          wx.setStorageSync(str, showList)
          that.setData({
            showList,
            currentModeList:showList,
            addList,
          })
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

  /*加载更多--表白墙 */
  loadMore2:function(){
    /*init_load()函数的作用主要是为请求回来的数据增加一些参数*/
    function init_load(list) {
      let dataList=[]
      if(WallSelected0){
        dataList=wx.getStorageSync('wall1')
      }
      else{
        dataList = wx.getStorageSync('wall2')
      }
      let list_length = dataList.length

      let currentModeList = dataList
      let showList = dataList
      let addList = []
      for (let i in list) {
        list[i].myid = list_length
        list_length++
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == global.classes.user_id) {
            isLike = true
            break
          }
        }
        list[i].isLike = isLike
        currentModeList.push(list[i])
        showList.push(list[i])
        addList.push(list[i])
      }
      let str = ''
      if (WallSelected0) {
        str = 'wall1'
      }
      else {
        str = 'wall2'
      }
      wx.setStorageSync(str, currentModeList)
      that.setData({
        showList,
        currentModeList,
        addList,
        page_index: 1,
        topic_id: 6,
        WallSelected0,
        WallSelected1,
      })
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    let that=this
    let topic_id=that.data.topic_id
    let page_index=Math.floor(that.data.showList.length/10)+1
    let WallSelected0=that.data.WallSelected0
    let WallSelected1=that.data.WallSelected1
    let mode=1

    /*请求新的一页 */
    wx.request({
      url: testUrl + 'post_sort',
      method: "GET",
      data: {
        mode:mode,
        topic_id: topic_id,
        page_index: page_index,
        page_size: 10
      },
      success(res) {
        console.log(res)
        if (res.statusCode ==200) {
          init_load(res.data.data)
          wx.hideLoading()
        }
        else {
          wx.hideLoading()
          wx.showToast({
            title: '出现错误',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  }
})