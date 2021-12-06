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
    receiveOrderOver: false,
    receiveListSkip: 18,
    receiveListStep: 15,
    outReceiveOrder: {},
    // 发布订单
    announceList: [],
    announceOrderOver: false,
    announceListSkip: 18,
    announceListStep: 15,
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
    userInfo: {
      _id: '',
      _openid: '',
      openid: '',
      addr: ['', '', ''],
      name: '',
      qq: '',
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
    if (result.error === null) {
      wx.showToast({
        title: '发布成功',
      });
      this.DisplayChange({ display: 'addOrder' });
    } else {
      wx.showToast({
        title: result.error,
        icon: 'none',
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

  Capture() {},

  // 从 app 页面同步数据
  DataSync() {
    wx.event.on('loginDisplay', (data) => {
      this.setData({
        loginDisplay: data,
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
