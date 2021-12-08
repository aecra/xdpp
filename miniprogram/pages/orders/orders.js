// pages/orders/orders.js

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 本页面独有数据
    display: {
      addOrder: 'none',
      receiveOrder: 'none',
      announceOrder: 'none',
    },
    receiveSwiper: 'active',
    announceSwiper: '',
    swiperIndex: 0,
    orderListHeight: 500,

    // 接收订单
    receiveList: [],
    receiveListSkip: 0,
    receiveListStep: 10,
    outReceiveOrder: {},
    // 发布订单
    announceList: [],
    announceListSkip: 0,
    announceListStep: 10,
    outAnnounceOrder: {},

    // 待发布订单
    package: {
      moveTo: ['竹园1号楼', '一层', '1-101'],
    },

    loginDisplay: 'none',

    // 快递种类
    kindArray: [],
    // 快递地点
    packIndex: 0,
    packArray: [],

    // 宿舍地址信息
    addrInfo: {
      multiArray: [[], [], []],
      mybuilding: '竹园1号楼',
      myfloor: '一层',
      myroom: '1-101',
      multiIndex: [0, 0, 0],
      allAddrData: [],
    },

    // 用户信息
    registered: false,
    userInfo: {
      _id: '',
      _openid: '',
      openid: '',
      addr: ['竹园1号楼', '一层', '1-101'],
      name: '',
      email: '',
      registerTime: null,
      studentid: null,
      phone: null,
    },
  },

  DisplayChange(e) {
    const display = e.display || e.currentTarget.dataset.display;
    this.setData({
      [`display.${display}`]: this.data.display[display] === 'none' ? 'flex' : 'none',
    });
  },

  bindMultiPickerColumnChange(e) {
    app.bindMultiPickerColumnChange(e);
  },
  bindMultiPickerChange(e) {
    app.bindMultiPickerChange(e);
    this.data.package.moveTo[0] = this.data.addrInfo.mybuilding;
    this.data.package.moveTo[1] = this.data.addrInfo.myfloor;
    this.data.package.moveTo[2] = this.data.addrInfo.myroom;
    this.setData({
      package: this.data.package,
    });
  },

  async Announce(e) {
    if (!this.Registered()) { return; }

    wx.showLoading({
      mask: true,
    });

    const data = e.detail.value;
    data.getPack = this.data.packArray[data.getPack];
    data.moveTo[0] = this.data.addrInfo.mybuilding;
    data.moveTo[1] = this.data.addrInfo.myfloor;
    data.moveTo[2] = this.data.addrInfo.myroom;
    let result = await wx.cloud.callFunction({
      name: 'announce',
      data,
    });
    result = result.result;

    wx.hideLoading();

    if (result.error === null) {
      wx.showToast({
        title: '发布成功',
      });
      this.DisplayChange({ display: 'addOrder' });
    } else {
      wx.showToast({
        title: result.error,
        icon: 'error',
      });
    }
  },

  UpdataorderListHeight() {
    let height = 0;
    if (this.data.swiperIndex === 0) {
      height = this.data.receiveList.length * 200 + 20;
    } else {
      height = this.data.announceList.length * 200 + 20;
    }
    if (height < 800) {
      height = 800;
    }
    this.setData({
      orderListHeight: height,
    });
  },
  SwiperChange() {
    this.data.swiperIndex = (this.data.swiperIndex === 0) ? 1 : 0;
    const middleVar = this.data.receiveSwiper;
    this.setData({
      receiveSwiper: this.data.announceSwiper,
      announceSwiper: middleVar,
    });
    this.UpdataorderListHeight();
  },

  async ReceiveList() {
    const result = await wx.cloud.callFunction({
      name: 'receivelist',
      data: {
        start: this.data.receiveListSkip,
        limit: this.data.receiveListStep,
      },
    });
    const { orderlist } = result.result;
    this.data.receiveListSkip += orderlist.length;
    if (orderlist.length === 0) {
      wx.showToast({
        title: '无更多订单',
        icon: 'error',
      });
    }
    this.setData({
      receiveList: this.data.receiveList.concat(orderlist),
    });
    this.UpdataorderListHeight();
  },

  async AnnounceList() {
    const result = await wx.cloud.callFunction({
      name: 'announcelist',
      data: {
        start: this.data.announceListSkip,
        limit: this.data.announceListStep,
      },
    });
    const { orderlist } = result.result;
    this.data.announceListSkip += orderlist.length;
    if (orderlist.length === 0) {
      wx.showToast({
        title: '无更多订单',
        icon: 'error',
      });
    }
    this.setData({
      announceList: this.data.announceList.concat(orderlist),
    });
    this.UpdataorderListHeight();
  },

  async UpdateOutReceiveOrder(e) {
    wx.showLoading({
      mask: true,
    });

    const { id } = e.currentTarget;
    this.data.outReceiveOrder = this.data.receiveList[id];
    if (!this.data.outReceiveOrder.deliveried) {
      let result = await wx.cloud.callFunction({
        name: 'userinfo',
        data: {
          OPENID: this.data.outReceiveOrder.announcer,
        },
      });
      result = result.result;
      if (result.hasUserInfo) {
        this.data.outReceiveOrder.announcerName = result.userInfo.name;
        this.data.outReceiveOrder.announcerPhone = result.userInfo.phone;
        this.data.outReceiveOrder.announceremail = result.userInfo.email;
      }
    }
    this.setData({
      outReceiveOrder: this.data.outReceiveOrder,
    });
    this.DisplayChange({ display: 'receiveOrder' });

    wx.hideLoading();
  },

  // 发布订单列表处理
  async UpdateOutAnnounceOrder(e) {
    wx.showLoading({
      mask: true,
    });

    const { id } = e.currentTarget;
    this.data.outAnnounceOrder = this.data.announceList[id];
    const order = this.data.outAnnounceOrder;
    if (!order.canceled && order.receiver && !order.deliveried) {
      let result = await wx.cloud.callFunction({
        name: 'userinfo',
        data: {
          OPENID: this.data.outAnnounceOrder.receiver,
        },
      });
      result = result.result;
      if (result.hasUserInfo) {
        this.data.outAnnounceOrder.receiverName = result.userInfo.name;
        this.data.outAnnounceOrder.receiverPhone = result.userInfo.phone;
        this.data.outAnnounceOrder.receiveremail = result.userInfo.email;
      }
    }
    this.setData({
      outAnnounceOrder: this.data.announceList[id],
    });
    this.DisplayChange({ display: 'announceOrder' });

    wx.hideLoading();
  },

  async UpdateOrder(e) {
    wx.showLoading({
      mask: true,
    });

    let result = await wx.cloud.callFunction({
      name: 'updateorder',
      data: {
        kind: e.detail.target.dataset.kind,
        // eslint-disable-next-line no-underscore-dangle
        _id: this.data.outAnnounceOrder._id,
      },
    });
    result = result.result;

    if (result.error === null) {
      wx.showToast({
        title: '操作成功',
      });
      this.DisplayChange({ display: 'announceOrder' });
    } else {
      wx.hideLoading();
      wx.showToast({
        title: result.error,
        icon: 'error',
      });
    }

    wx.hideLoading();
  },

  LoginMultiPickerColumnChange(e) {
    app.bindMultiPickerColumnChange(e);
    app.UpdataAddr();
  },

  LoginMultiPickerChange(e) {
    app.bindMultiPickerChange(e);
    app.UpdataAddr();
  },

  Register(e) {
    const values = e.detail.value;
    values.addr[0] = this.data.addrInfo.multiArray[0][values.addr[0]];
    values.addr[1] = this.data.addrInfo.multiArray[1][values.addr[1]];
    values.addr[2] = this.data.addrInfo.multiArray[2][values.addr[2]];
    app.Register(values);
  },

  LoginDisplay() {
    this.setData({
      loginDisplay: this.data.loginDisplay === 'none' ? 'flex' : 'none',
    });
  },

  Registered() {
    if (!this.data.received) {
      const that = this;
      wx.showModal({
        title: '提示',
        content: '是否注册？',
        confirmText: '注册',
        success(res) {
          if (res.confirm) {
            that.setData({
              loginDisplay: true,
            });
          }
        },
      });
      return false;
    }
    return true;
  },

  Capture() {},

  // 从 app 页面同步数据
  DataSync() {
    wx.event.on('registered', (data) => {
      this.setData({
        registered: data,
      });
    });
    wx.event.on('addrInfo', (data) => {
      this.setData({
        addrInfo: data,
      });
    });
    wx.event.on('userInfo', (data) => {
      this.setData({
        userInfo: data,
      });
    });
    wx.event.on('kindArray', (data) => {
      this.setData({
        kindArray: data,
      });
    });
    wx.event.on('packArray', (data) => {
      this.setData({
        packArray: data,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.DataSync();
    this.ReceiveList();
    this.AnnounceList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.data.registered) {
      this.LoginDisplay();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    if (this.data.receiveSwiper === 'active') {
      this.data.receiveListSkip = 0;
      this.data.receiveList = [];
      this.ReceiveList();
    } else {
      this.data.announceListSkip = 0;
      this.data.announceList = [];
      this.AnnounceList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.receiveSwiper === 'active') {
      this.ReceiveList();
    } else {
      this.AnnounceList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
