//index.js
const app = getApp()

Page({
  data: {
    // 本页面独有数据
    orderDetailsDisplay: "none",
    searchMethodDisplay: "none",

    orderList: [],
    orderListLoaded: false,
    orderOver: false,
    outOrder: {},
    orderListSkip: 18,
    orderListStep: 15,

    searchData: {
      buildings: [],
      floors: [],
      kinds: [],
      packageaddr: []
    },
    searchAim: {
      buildings: [],
      floors: [],
      kinds: [],
      packageaddr: []
    },
    orderData: {
      announceorder: 0,
      canceledorder: 0,
      deliveriedorder: 0,
      receivedorder: 0
    },

    // 需同步数据
    loginDisplay: "none",

    // 宿舍地址信息
    addrInfo: {
      multiArray: [
        [],
        [],
        []
      ],
      mybuilding: "竹园1号楼",
      myfloor: "一层",
      myroom: "1-101",
      multiIndex: [0, 0, 0],
      allAddrData: [],
    },

    // 用户信息
    hasUserInfo: false,
    userInfo: {
      _id: "",
      _openid: "",
      openid: "",
      agreement: false,
      defaultaddr: ["", "", ""],
      name: "",
      qq: "",
      registerTime: null,
      student_id: null,
      phone: null
    }
  },

  // 该页面函数
  ChangeOrderDetailsDisplayState: function () {
    if (this.data.orderDetailsDisplay == "none") {
      this.setData({
        orderDetailsDisplay: "flex"
      });
    } else if (this.data.orderDetailsDisplay == "flex") {
      this.setData({
        orderDetailsDisplay: "none"
      });
    }
  },
  ChangeSearchMethodDisplayState: function () {
    if (this.data.searchMethodDisplay == "none") {
      this.setData({
        searchMethodDisplay: "flex"
      });
    } else if (this.data.searchMethodDisplay == "flex") {
      this.setData({
        searchMethodDisplay: "none"
      });
    }
  },
  BannerSee: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: ['https://web-1255835707.cos.ap-beijing.myqcloud.com/app/index_banner_1.png',
        'https://web-1255835707.cos.ap-beijing.myqcloud.com/app/index_banner_2.png',
      ]
    })
  },
  UpdateOutOrderDetails: function (id) {
    this.setData({
      outOrder: this.data.orderList[id]
    })
  },
  ChangeSearchBuildings: function (e) {
    this.data.searchAim.buildings = e.detail.value;
    this.data.orderOver = false;
  },
  ChangeSearchFloors: function (e) {
    this.data.searchAim.floors = e.detail.value;
    this.data.orderOver = false;
  },
  ChangeSearchKinds: function (e) {
    this.data.searchAim.kinds = e.detail.value;
    this.data.orderOver = false;
  },
  ChangeSearchPackageaddr: function (e) {
    this.data.searchAim.packageaddr = e.detail.value;
    this.data.orderOver = false;
  },
  OrderdataInit: async function () {
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    const order = db.collection('orderdata');
    let orderdata = await order.get();

    this.setData({
      orderData: orderdata.data[0]
    })
  },
  OrderListInit: async function () {
    if (this.data.userInfo.openid == "" || this.data.searchAim.buildings.length == 0 || this.data.searchAim.floors.length == 0 || this.data.searchAim.kinds.length == 0 || this.data.searchAim.packageaddr.length == 0) {
      setTimeout(this.OrderListInit, 200);
      return;
    }

    this.data.orderListSkip = 18;
    this.data.orderOver = false;

    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    const order = db.collection('orderlist');
    let orderlist = await order.where({
      canceled: false,
      deliveried: false,
      receiver: null,
      announcer: _.neq(that.data.userInfo.openid),
      package: {
        moveTo: _.and(_.in(that.data.searchAim.buildings), _.in(that.data.searchAim.floors)),
        kind: _.in(that.data.searchAim.kinds),
        getPack: _.in(that.data.searchAim.packageaddr)
      }
    }).orderBy('announceTime', 'desc').limit(this.data.orderListSkip).get();
    this.setData({
      orderList: orderlist.data
    })

    for (let i = 0; i < orderlist.data.length; i++) {
      this.data.orderList[i].month = orderlist.data[i].announceTime.getMonth() + 1;
      this.data.orderList[i].day = orderlist.data[i].announceTime.getDate();
      this.data.orderList[i].hour = (orderlist.data[i].announceTime.getHours() < 10) ? "0" + orderlist.data[i].announceTime.getHours() : orderlist.data[i].announceTime.getHours();
      this.data.orderList[i].minutes = (orderlist.data[i].announceTime.getMinutes() < 10) ? "0" + orderlist.data[i].announceTime.getMinutes() : orderlist.data[i].announceTime.getMinutes();
    }
    this.setData({
      orderList: this.data.orderList
    })
  },
  UpdataOrderList: async function () {
    if (this.data.orderOver == true) {
      wx.showToast({
        title: "无更多订单",
        icon: "none"
      })
      return;
    }

    if (this.data.userInfo.openid == "" || this.data.searchAim.buildings.length == 0 || this.data.searchAim.floors.length == 0 || this.data.searchAim.kinds.length == 0 || this.data.searchAim.packageaddr.length == 0) {
      setTimeout(this.OrderListInit, 200);
      return;
    }

    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    const order = db.collection('orderlist');
    let orderlist = await order.where({
      canceled: false,
      deliveried: false,
      receiver: null,
      announcer: _.neq(that.data.userInfo.openid),
      package: {
        moveTo: _.and(_.in(that.data.searchAim.buildings), _.in(that.data.searchAim.floors)),
        kind: _.in(that.data.searchAim.kinds),
        getPack: _.in(that.data.searchAim.packageaddr)
      }
    }).orderBy('announceTime', 'desc').skip(that.data.orderListSkip).limit(that.data.orderListStep).get();

    if (orderlist.data.length == 0) {
      this.data.orderOver = true;
      return;
    }

    for (let i = 0; i < orderlist.data.length; i++) {
      orderlist.data[i].month = orderlist.data[i].announceTime.getMonth() + 1;
      orderlist.data[i].day = orderlist.data[i].announceTime.getDate();
      orderlist.data[i].hour = (orderlist.data[i].announceTime.getHours() < 10) ? "0" + orderlist.data[i].announceTime.getHours() : orderlist.data[i].announceTime.getHours();
      orderlist.data[i].minutes = (orderlist.data[i].announceTime.getMinutes() < 10) ? "0" + orderlist.data[i].announceTime.getMinutes() : orderlist.data[i].announceTime.getMinutes();

      this.data.orderList.push(orderlist.data[i])
    }
    this.setData({
      orderList: this.data.orderList,
      orderListSkip: this.data.orderListSkip + this.data.orderListStep
    })
  },
  PickupOrderDetails: function (e) {
    this.UpdateOutOrderDetails(e.currentTarget.id);
    this.ChangeOrderDetailsDisplayState();
  },
  ReceiveOrder: async function () {
    this.ChangeOrderDetailsDisplayState()

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法接单")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    // 检查是不是已经被接单
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    const order = db.collection('orderlist');
    let orderitem = await order.where({
      _id: that.data.outOrder._id
    }).get();

    if (orderitem.data[0].receiver != null) {
      wx.showToast({
        title: "该单已被他人接",
        icon: "none"
      })
      return;
    }

    // 接单处理
    db.collection('orderlist').where({
      _id: that.data.outOrder._id
    }).update({
      data: {
        receiver: that.data.userInfo.openid,
        receiveTime: new Date()
      },
      success: function (res) {
        wx.showToast({
          title: "接单成功"
        });

        const db = wx.cloud.database();
        const _ = db.command;
        const order = db.collection('orderdata');
        let orderdata = order.doc('e656fa635f64a4a3001384d46443f6be').update({
          data: {
            announceorder: _.inc(-1),
            receivedorder: _.inc(1)
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: "接单失败",
          icon: "none"
        })
      }
    })
  },
  kongbai: function () {
    console.log("专业避免父节点点击事件侵入子节点的空事件");
  },
  SearchDataSync: function () {
    this.data.searchAim.buildings = app.globalData.addrInfo.multiArray[0];
    this.data.searchAim.floors = app.globalData.addrInfo.multiArray[1];
    this.data.searchAim.kinds = app.globalData.kindArray;
    this.data.searchAim.packageaddr = app.globalData.packArray;

    this.data.searchData.buildings = app.globalData.addrInfo.multiArray[0];
    this.data.searchData.floors = app.globalData.addrInfo.multiArray[1];
    this.data.searchData.kinds = app.globalData.kindArray;
    this.data.searchData.packageaddr = app.globalData.packArray;

    if (this.data.searchAim.buildings.length == 0 || this.data.searchAim.floors.length == 0 || this.data.searchAim.kinds.length == 0 || this.data.searchAim.packageaddr.length == 0) {
      setTimeout(this.SearchDataSync, 200);
    }
    if (this.data.searchData.buildings.length == 0 || this.data.searchData.floors.length == 0 || this.data.searchData.kinds.length == 0 || this.data.searchData.packageaddr.length == 0) {
      setTimeout(this.SearchDataSync, 200);
    }
  },
  Search: function () {
    this.ChangeSearchMethodDisplayState();
    this.OrderListInit();
  },

  // 从app页面同步数据
  DataSync: function () {
    this.setData({
      loginDisplay: app.globalData.loginDisplay,
      addrInfo: app.globalData.addrInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo,
      searchData: this.data.searchData,
    })

    // 处理异步问题
    if (this.data.userInfo.openid == "") {
      setTimeout(this.DataSync, 200);
      return;
    }
  },

  // 调用app的函数
  InputName: function (e) {
    app.InputName(e);
    this.DataSync();
  },
  InputStudentId: function (e) {
    app.InputStudentId(e);
    this.DataSync();
  },
  InputPhone: function (e) {
    app.InputPhone(e);
    this.DataSync();
  },
  InputQq: function (e) {
    app.InputQq(e);
    this.DataSync();
  },
  InputAgreement: function (e) {
    app.InputAgreement(e);
    this.DataSync();
  },
  LoginMultiPickerColumnChange: function (e) {
    app.bindMultiPickerColumnChange(e);
    app.UpdataAddr();
    this.DataSync();
  },
  LoginMultiPickerChange: function (e) {
    app.bindMultiPickerChange(e);
    app.UpdataAddr();
    this.DataSync();
  },
  Register: function (e) {
    app.Register(e);
    this.DataSync();

    // 注册补丁
    let that = this;
    setTimeout(function () {
      that.onShow()
    }, 500);
    setTimeout(function () {
      that.onShow()
    }, 1000);
    setTimeout(function () {
      that.onShow()
    }, 2000);
  },




  onLoad: function (options) {
    // 页面创建时执行
    this.DataSync();
    this.SearchDataSync();
    this.OrderListInit();
    this.OrderdataInit();
  },
  onShow: function () {
    // 页面出现在前台时执行
    this.DataSync();
  },
  onReady: function () {
    // 页面首次渲染完毕时执行
  },
  onHide: function () {
    // 页面从前台变为后台时执行
  },
  onUnload: function () {
    // 页面销毁时执行
  },
  onPullDownRefresh: function () {
    // 触发下拉刷新时执行
    this.OrderListInit();
    this.OrderdataInit();
  },
  onReachBottom: function () {
    // 页面触底时执行
    this.UpdataOrderList()
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onPageScroll: function () {
    // 页面滚动时执行
  },
  onResize: function () {
    // 页面尺寸变化时执行
  }
})