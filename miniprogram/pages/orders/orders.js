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
    hasUserInfo: false,
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
    const { display } = e.currentTarget.dataset;
    this.setData({
      [`display.${display}`]: this.data.display[display] === 'none' ? 'flex' : 'none',
    });
  },

  bindMultiPickerColumnChange(e) {
    app.bindMultiPickerColumnChange(e);
    this.DataSync();
  },
  bindMultiPickerChange(e) {
    app.bindMultiPickerChange(e);
    this.DataSync();
    this.data.package.moveTo[0] = this.data.addrInfo.mybuilding;
    this.data.package.moveTo[1] = this.data.addrInfo.myfloor;
    this.data.package.moveTo[2] = this.data.addrInfo.myroom;
    this.setData({
      package: this.data.package,
    });
  },

  Announce(e) {
    const data = e.detail.value;
    data.getPack = this.data.packArray[data.getPack];
    data.moveTo[0] = this.data.addrInfo.mybuilding;
    data.moveTo[1] = this.data.addrInfo.myfloor;
    data.moveTo[2] = this.data.addrInfo.myroom;
  },

  LoginMultiPickerColumnChange(e) {
    app.bindMultiPickerColumnChange(e);
    app.UpdataAddr();
    this.DataSync();
  },

  LoginMultiPickerChange(e) {
    app.bindMultiPickerChange(e);
    app.UpdataAddr();
    this.DataSync();
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
    this.setData({
      loginDisplay: app.globalData.loginDisplay,
      addrInfo: app.globalData.addrInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo,
      kindArray: app.globalData.kindArray,
      packArray: app.globalData.packArray,
    });

    // 处理异步问题
    if (this.data.userInfo.openid === '') {
      setTimeout(this.DataSync, 200);
    }
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
