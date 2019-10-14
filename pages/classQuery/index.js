//获取应用实例
var app = getApp();
Page({
  data: {
    uid: '',
    pwd: '',
    nickName: '',
    remind: '加载中',
    isLoading: true,
    _days: ['一', '二', '三', '四', '五', '六', '日'],
    activeClass: '',
    activeClassItem: 0,
    whichDayOfWeek: '',
    scroll: {
      left: 0 //判断今天是不周末，是的话滚一下
    },
    timeRow: [{
        l1: '第一小节',
        l2: '第二小节',
        t1: '8:00-8:45',
        t2: '8:50-9:35'
      },
      {
        l1: '第三小节',
        l2: '第四小节',
        t1: '9:55-10:40',
        t2: '10:45-11:30'
      },
      {
        l1: '第五小节',
        l2: '第六小节',
        t1: '13:10-13:55',
        t2: '14:00-14:45'
      },
      {
        l1: '第七小节',
        l2: '第八小节',
        t1: '15:00-15:45',
        t2: '15:50-16:35'
      },
      {
        l1: '第九小节',
        l2: '第十小节',
        t1: '16:50-17:35',
        t2: '17:40-18:25'
      },
    ],
    classJson: '',
    targetLessons: [],
    targetX: 0, //target x轴top距离
    targetY: 0, //target y轴left距离
    targetDay: 0, //target day
    targetWid: 0, //target wid
    targetI: 0, //target 第几个active
    targetLen: 0, //target 课程长度
    blur: false,
    is_vacation: false, // 是否为假期
  },
  onLoad: function(options) {

    var uid = wx.getStorageSync('uid');
    var pwd = wx.getStorageSync('newpwd');
    var courseCache = wx.getStorageSync('personal19Class');
    var cookie = options.cookie;
    var vcode = options.vcode;

    if ((typeof(options.cookie) == 'undefined' || typeof(options.vcode) == 'undefined') && courseCache.length == 0) {
      wx.redirectTo({
        url: '/pages/index/vcode?to=grkb&update=0',
      })
    }
    var that = this;
    that.setInfo();
    console.log(pwd)
    that.setData({
      uid: uid,
      pwd: pwd,
    })


    let showCache = true;
    if (options.update == '1') {
      showCache = false;
      that.getTable(uid, pwd, false, cookie, vcode);
    }
    if (options.isShareFrom == 'tiue'){
      showCache = false;
      that.getTable(options.uid,options.pwd, showCache, 'cookie', 'code');
    }

    if (courseCache != "" && showCache) {
      that.setData({
        uid: uid,
        pwd: pwd,
        classJson: courseCache,
        isLoading: false
      })
    } else if ((uid == '' || pwd == '') || (vcode == '' || cookie == '')) {
      wx.navigateTo({
        url: '/pages/index/index'
      })

    } else {
      that.getTable(uid, pwd, false, cookie, vcode);
    }

    that.setData({
      nickName: app.globalData.nickName
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  setInfo: function() {
    var that = this;
    const whichDayOfWeek = new Date().getDay();
    const arr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'staturday'];
    that.setData({
      whichDayOfWeek: arr[whichDayOfWeek],
    })
  },
  getTable: function(uid, pwd, showCookieClass, cookie, vcode) {
    var that = this;
    wx.request({
      url: app.globalData.apiURL + '/v4/courseTable.php',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        username: uid,
        password: pwd,
        cookie: cookie,
        vcode: vcode
      },
      success: function(res) {
        that.setData({
          classJson: res.data,
          isLoading: false
        })
        console.log(res.data);
        if (res.data.status == 200) {
          wx.setStorageSync('personal19Class', res.data);
          wx.showToast({
            title: "刷新完成",
            icon: "succeed",
            duration: 2000
          })
        }
        if (res.data.status == 401) {
          wx.navigateTo({
            url: '/pages/error/queryerror?ErrorTips=' + "学号密码不对，请重新登录",
          })
        }
        if (res.data.status == 500) {
          var personalClass = wx.getStorageSync('personal19Class');
          if (personalClass != "" && showCookieClass == true) {
            that.setData({
              classJson: personalClass,
              isLoading: false
            })
            wx.showToast({
              title: '教务无法访问，当前展示离线缓存课表',
              icon: 'none',
              duration: 2000
            })
          } else {}
        }
      }
    })
  },
  changeActiveItem: function(e) {
    var that = this;
    // console.log(e);
    that.setData({
      activeClassItem: e.currentTarget.dataset.num,
    })
  },
  onShow: function() {
    var _this = this;

  },
  onReady: function() {
    var that = this;
  },
  showDetail: function(e) {
    console.log(e)
    // 点击课程卡片后执行
    var that = this;
    that.setData({
      targetX: e.detail.x,
      targetY: e.detail.y,
      targetDay: 1,
      targetWid: 2,
      targetI: 1,
      blur: true,
      activeClass: e.currentTarget.dataset
    });
  },
  goClassPlace: function(ep) {
      wx.showToast({
        icon: 'none',
        title: 'QQ小程序暂不支持导航',
      })
  },
  hideDetail: function() {
    var that = this;
    // 点击遮罩层时触发，取消主体部分的模糊，清空target
    that.setData({
      blur: false,
      targetLessons: [],
      targetX: 0,
      targetY: 0,
      targetDay: 0,
      targetWid: 0,
      targetI: 0,
      targetLen: 0,
      activeClassItem: 0,
    });
  },
  catchMoveDetail: function() { /*阻止滑动穿透*/ },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    // console.log(res);
    return {
      title: that.data.nickName + '的个人课表',
      path: 'pages/classQuery/index?isShareFrom=true&uid=' + that.data.uid + '&pwd=' + that.data.pwd,
    }
  },
  refreshData: function() {
    wx.redirectTo({
      url: '/pages/index/vcode?to=grkb&update=1',
    })
  }
});