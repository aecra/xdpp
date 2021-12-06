// pages/index/index.js

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    display: {
      orderDetails: 'none',
      searchMethod: 'none',
    },

    orderList: [],
    outOrder: {},
    orderListSkip: 0,
    orderListStep: 15,

    searchData: {
      buildings: [],
      floors: [],
      kinds: [],
      packageaddr: [],
    },
    searchAim: {
      buildings: [],
      floors: [],
      kinds: [],
      packageaddr: [],
    },
    orderData: {
      announce: 0,
      canceled: 0,
      deliveried: 0,
      received: 0,
    },

    loginDisplay: 'none',

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

  ChangeSearch(e) {
    this.data.searchAim[e.target.dataset.kind] = e.detail.value;
  },

  Search() {
    this.InitOrderList();
    this.DisplayChange({ display: 'searchMethod' });
  },

  async OrderData() {
    const result = await wx.cloud.callFunction({
      name: 'orderdata',
    });
    this.setData({
      orderData: result.result.data,
    });
  },

  async OrderList() {
    let orderlist = await wx.cloud.callFunction({
      name: 'orderlist',
      data: {
        start: this.data.orderListSkip,
        limit: this.data.orderListStep,
        searchAim: this.data.searchAim,
      },
    });
    orderlist = orderlist.result.orderlist;
    if (orderlist.length === 0) {
      wx.showToast({
        title: '无更多订单',
        icon: 'none',
      });
    }
    this.setData({
      orderList: this.data.orderList.concat(orderlist),
      orderListSkip: this.data.orderListSkip + orderlist.length,
    });
  },

  OrderDetails(e) {
    this.setData({
      outOrder: this.data.orderList[e.currentTarget.id],
    });
    this.DisplayChange({ display: 'orderDetails' });
  },

  async Receive() {
    let result = await wx.cloud.callFunction({
      name: 'updateorder',
      data: {
        kind: 'receive',
        // eslint-disable-next-line no-underscore-dangle
        _id: this.data.outOrder._id,
      },
    });
    result = result.result;

    if (result.error === null) {
      wx.showToast({
        title: '操作成功',
      });
      this.DisplayChange({ display: 'orderDetails' });
    } else {
      wx.showToast({
        title: result.error,
        icon: 'none',
      });
    }
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

  InitOrderList() {
    const aim = this.data.searchAim;
    if (aim.buildings.length && aim.kinds.length && aim.packageaddr) {
      this.setData({
        orderListSkip: 0,
        orderList: [],
      });
      this.OrderList();
    }
  },

  SearchDataSync() {
    wx.event.on('searchAddrInfo', (data) => {
      this.setData({
        'searchAim.buildings': data.multiArray['0'],
        'searchAim.floors': data.multiArray['1'],
        'searchData.buildings': data.multiArray['0'],
        'searchData.floors': data.multiArray['1'],
      });
      this.InitOrderList();
    });
    wx.event.on('kindArray', (data) => {
      this.setData({
        'searchAim.kinds': data,
        'searchData.kinds': data,
      });
      this.InitOrderList();
    });
    wx.event.on('packArray', (data) => {
      this.setData({
        'searchAim.packageaddr': data,
        'searchData.packageaddr': data,
      });
      this.InitOrderList();
    });
  },

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.DataSync();
    this.OrderData();
    this.SearchDataSync();
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
  onPullDownRefresh() {
    this.InitOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // this.OrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
