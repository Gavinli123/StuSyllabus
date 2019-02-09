// pages/discover/discover.js
const testUrl ="http://118.126.92.214:8083/interaction/api/v2/"
const likeUrl ="http://118.126.92.214:8083/interaction/api/v2/like"
const findlostUrl = "http://118.126.92.214:8083/extension/api/v2/findlost"
const stuUrl = "https://stuapps.com/interaction/api/v2/posts"
const myuid=5
const mytoken="100004"
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
    /*page_index的初始值为1，即当前请求第一页 */
    let page_index=that.data.page_index
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    function init_load(list){
      let currentModeList = list
      let showList = []
      /*addList为增加的数组，用来判断显示加载更多还是已加载完毕 */
      let addList=[]
      for (let i in currentModeList) {
        currentModeList[i].myid=i
        currentModeList[i].likeNumber=currentModeList[i].thumb_ups.length
        currentModeList[i].commentNumber=currentModeList[i].comments.length
        currentModeList[i].user.image = "https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132"
        let isLike=false
        for(let j in currentModeList[i].thumb_ups){
          if(currentModeList[i].thumb_ups[j].uid==myuid){
            isLike=true
            break
          }
        }
        currentModeList[i].isLike=isLike
        showList.push(currentModeList[i])
        addList.push(currentModeList[i])
      }
      //wx.setStorageSync('post_list', currentModeList)
      
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
        page_index:page_index,
        page_size:10
      },
      success(res){
        console.log(res)
        //wx.setStorageSync('post_list', res.data.data)
        init_load(res.data.data)
        wx.hideLoading()
      },
      fail(res){
        wx.showToast({
          title: '请求失败',
          icon:'none',
          duration:2000,
        })
      }
    })

    //let currentModeList=wx.getStorageSync('messageList')
    //console.log(currentModeList)
    // let that=this
    // let showList=[]
    // for(var i in currentModeList){
    //   if(currentModeList[i].mode=='生活'){
    //     showList.push(currentModeList[i])
    //   } 
    // }
    // that.setData({
    //   currentModeList,
    //   showList
    // })
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
    /*init_load函数的作用主要是为请求回来的数据增加一些参数
      包括点赞数、评论数、当前用户是否已点赞、头像（随便加一个）
      用于校园动态的消息 */
    function init_load(list) {
      for (let i in list) {
        list[i].myid = i
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        list[i].user.image = "https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132"
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == myuid) {
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
          if (list[i].thumb_ups[j].uid == myuid) {
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
          init_load(res.data.data)
          wx.hideLoading()
          wx.showToast({
            title: '刷新成功',
          })
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

    /*处理表白墙的下拉刷新 */
    if(isSelected2){
      wx.showLoading({
        title: '加载中',
        mask:true
      })

      let mode=1
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
          init_load2(res.data.data)
          wx.hideLoading()
          wx.showToast({
            title: '刷新成功',
          })
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
          list[i].myid = i
          list[i].likeNumber = list[i].thumb_ups.length
          list[i].commentNumber = list[i].comments.length
          list[i].user.image = "https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132"
          let isLike = false
          for (let j in list[i].thumb_ups) {
            if (list[i].thumb_ups[j].uid == myuid) {
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
      else if(type==2){
        for (let i in list) {
          list[i].myid = i
          list[i].likeNumber = list[i].thumb_ups.length
          list[i].commentNumber = list[i].comments.length
          let isLike = false
          for (let j in list[i].thumb_ups) {
            if (list[i].thumb_ups[j].uid == myuid) {
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
            uid: Number.parseInt(myuid),
            token: mytoken,
            kind: 1,
          },
          success(res) {
            console.log(res)
            if(res.statusCode==200){
              let showList=res.data.data.findlost_list
              that.setData({
                showList
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
        // currentModeList=wx.getStorageSync('thingsList')
        // for(let i in currentModeList){
        //   if(currentModeList[i].mode=='寻物'){
        //     showList.push(currentModeList[i])
        //   }
        // }
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
            mode:1,
            topic_id: 6,
            page_index: 1,
            page_size: 10
          },
          success(res) {
            console.log(res)
            let showList=res.data.data
            init_load(showList,2)
            wx.hideLoading()
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
            let showList = res.data.data
            init_load(showList, 0)
            wx.hideLoading()
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
        isSelected2 = false
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
            mode: 1,
            topic_id: 6,
            page_index: 1,
            page_size: 10
          },
          success(res) {
            console.log(res)
            let showList = res.data.data
            init_load(showList, 2)
            wx.hideLoading()
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
            let showList = res.data.data
            init_load(showList, 0)
            wx.hideLoading()
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
        isSelected2 = false
      }
      else if (e.currentTarget.dataset.item == "1") {
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
            uid: Number.parseInt(myuid),
            token: mytoken,
            kind: 1,
          },
          success(res) {
            console.log(res)
            if (res.statusCode == 200) {
              let showList = res.data.data.findlost_list
              that.setData({
                showList
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
        list[i].myid = i
        list[i].likeNumber = list[i].thumb_ups.length
        list[i].commentNumber = list[i].comments.length
        list[i].user.image = "https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132"
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == myuid) {
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
        init_load(res.data.data)
        wx.hideLoading()
      },
      fail(res) {
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
    let showList=[]
    if(ThingSelected0&&current==0)
      return
    if (ThingSelected1 && current == 1)
      return
    if(ThingSelected0&&current==1){
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
          uid: Number.parseInt(myuid),
          token: mytoken,
          kind: 0,
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            that.setData({
              showList
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
          uid: Number.parseInt(myuid),
          token: mytoken,
          kind: 1,
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            let showList = res.data.data.findlost_list
            that.setData({
              showList
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
      showList
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
          if (list[i].thumb_ups[j].uid == myuid) {
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
          let showList = res.data.data
          init_load(showList)
          wx.hideLoading()
        },
        fail(res) {
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
          mode: 1,
          topic_id: 6,
          page_index: 1,
          page_size: 10
        },
        success(res) {
          console.log(res)
          let showList = res.data.data
          init_load(showList)
          wx.hideLoading()
        },
        fail(res) {
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
  toDetail:function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    let category = e.currentTarget.dataset.category
    wx.navigateTo({
       url: 'contentDetail/contentDetail?id='+id+'&category='+category,
    })
  },
  dianzan:function(e){
    let id=e.currentTarget.dataset.id
    let myid=Number.parseInt(e.currentTarget.dataset.myid)
    let that=this
    let showList=that.data.showList
    if(!showList[myid].isLike){
      showList[myid].isLike=true
      showList[myid].likeNumber++
      wx.request({
        url: likeUrl,
        method:"POST",
        data:{
          uid:myuid,
          token:mytoken,
          post_id:id,
        },
        success(res){
          console.log(res)
        }
      })
    }
    else{
      showList[myid].isLike = false
      showList[myid].likeNumber--
      let like_id=-1
      for(let i in showList[myid].thumb_ups){
        if(myuid==showList[myid].thumb_ups[i].uid){
          like_id = showList[myid].thumb_ups[i].id
          break
        }
      }
      console.log(like_id)
      wx.request({
        url: likeUrl,
        header: {
          uid: myuid,
          token: mytoken,
          id: like_id,
        },
        method:"delete",
        success(res){
          console.log(res)
        }
      })
    }
    that.setData({
      showList
    })
  },
  previewIcon:function(e){
    wx.previewImage({
      urls: ['https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132'],
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
        list[i].likeNumber =list[i].thumb_ups.length
        list[i].commentNumber =list[i].comments.length
        list[i].user.image = "https://wx.qlogo.cn/mmopen/vi_32/7DlxFtROxV23k87nMiasic9SbttTYmJ9YOsEvdqULa3crMSED8XCk5DPBp0UNSoac4M38VEZbkibFQic3zC2M0zTxg/132"
        let isLike = false
        for (let j in list[i].thumb_ups) {
          if (list[i].thumb_ups[j].uid == myuid) {
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
        if(res.errMsg=='request:ok'){
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
          if (list[i].thumb_ups[j].uid == myuid) {
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
        if (res.errMsg == 'request:ok') {
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