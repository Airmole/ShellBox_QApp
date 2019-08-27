// pages/features/about.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: '100%',
    height: '',
    coder: [{
      avatar: 'https://z4a.net/images/2019/06/22/_20180513195821.th.jpg',
      nickName: 'Airmole'
    }, {
      avatar: 'https://z4a.net/images/2019/07/24/_20190724200849.th.jpg',
      nickName: '很奔放'
    }],
    servicer: [{
      avatar: 'https://z4a.net/images/2019/06/22/_20180513195821.th.jpg',
      nickName: 'Airmole'
    }, {
      avatar: 'https://z4a.net/images/2019/07/24/_20190724200849.th.jpg',
      nickName: '很奔放'
    }, {
      avatar: 'https://z4a.net/images/2019/06/22/hzj.th.jpg',
      nickName: 'hzj'
    }, {
      avatar: 'https://z4a.net/images/2019/06/22/zhx.th.jpg',
      nickName: '淡然微笑'
    }, {
      avatar: 'https://z4a.net/images/2019/06/22/fwj.th.jpg',
      nickName: '非晚'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      width: wx.getSystemInfoSync().windowWidth * 0.9 + 'px',
      height: wx.getSystemInfoSync().windowWidth * 0.9 * 0.5625 + 'px'
    })

    qq.pageScrollTo({
      scrollTop: 500,
      duration: 3000
    })
  },
  copyID: function () {
    wx.setClipboardData({
      data: 'wxf0ba93e3faff4eda'
    })
    wx.showToast({
      title: '已复制到粘贴版',
      duration: 1000
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    qq.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    });
  },
  notSupport: function () {
    app.notSupport();
  }
})