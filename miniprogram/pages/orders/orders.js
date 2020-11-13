// pages/orders/orders.js
const app = getApp()

Page({
  data: {
    // 本页面独有数据
    addOrderDisplay: "none",
    receiveOrderDisplay: "none",
    announceOrderDisplay: "none",
    receiveSwiper: "active",
    announceSwiper: "",
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
      getPack: "中通快递",
      pickupCode: "",
      kind: "大",
      pickupReceiver: "",
      pickupNumber: "",
      moveTo: ["竹园1号楼", "一层", "1-101"],
      reward: "",
      remarks: ""
    },

    // 需要同步的数据
    loginDisplay: "none",

    // 快递种类
    kindArray: [],
    // 快递地点
    packIndex: 0,
    packArray: [],

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
      avatarUrl: "",
      defaultaddr: ["", "", ""],
      gender: 1,
      name: "",
      nickName: "",
      qq: "",
      registerTime: null,
      student_id: null,
      phone: null
    }
  },

  // 该页面函数
  ChangeAddOrderDisplayState: function () {
    if (this.data.addOrderDisplay == "none") {
      this.setData({
        addOrderDisplay: "flex"
      });
    } else if (this.data.addOrderDisplay == "flex") {
      this.setData({
        addOrderDisplay: "none"
      });
    }
  },
  ChangeReceiveOrderDisplayState: function () {
    if (this.data.receiveOrderDisplay == "none") {
      this.setData({
        receiveOrderDisplay: "flex"
      });
    } else if (this.data.receiveOrderDisplay == "flex") {
      this.setData({
        receiveOrderDisplay: "none"
      });
    }
  },
  ChangeAnnounceOrderDisplayState: function () {
    if (this.data.announceOrderDisplay == "none") {
      this.setData({
        announceOrderDisplay: "flex"
      });
    } else if (this.data.announceOrderDisplay == "flex") {
      this.setData({
        announceOrderDisplay: "none"
      });
    }
  },
  ReceiveListInit: async function () {
    if (this.data.userInfo.openid == "") {
      setTimeout(this.ReceiveListInit, 200);
      return;
    }

    this.data.receiveListSkip = 18;
    this.data.receiveOrderOver = false;

    const db = wx.cloud.database();
    const order = db.collection('orderlist');
    let orderlist = await order.where({
      receiver: this.data.userInfo.openid
    }).orderBy('receiveTime', 'desc').limit(this.data.receiveListSkip).get();
    this.setData({
      receiveList: orderlist.data
    })
    for (let i = 0; i < orderlist.data.length; i++) {
      this.data.receiveList[i].announceMonth = orderlist.data[i].announceTime.getMonth() + 1;
      this.data.receiveList[i].announceDay = orderlist.data[i].announceTime.getDate();
      this.data.receiveList[i].announceHour = (orderlist.data[i].announceTime.getHours() < 10) ? "0" + orderlist.data[i].announceTime.getHours() : orderlist.data[i].announceTime.getHours();
      this.data.receiveList[i].announceMinutes = (orderlist.data[i].announceTime.getMinutes() < 10) ? "0" + orderlist.data[i].announceTime.getMinutes() : orderlist.data[i].announceTime.getMinutes();
      if (orderlist.data[i].receiveTime != null) {
        this.data.receiveList[i].receiveMonth = orderlist.data[i].receiveTime.getMonth() + 1;
        this.data.receiveList[i].receiveDay = orderlist.data[i].receiveTime.getDate();
        this.data.receiveList[i].receiveHour = (orderlist.data[i].receiveTime.getHours() < 10) ? "0" + orderlist.data[i].receiveTime.getHours() : orderlist.data[i].receiveTime.getHours();
        this.data.receiveList[i].receiveMinutes = (orderlist.data[i].receiveTime.getMinutes() < 10) ? "0" + orderlist.data[i].receiveTime.getMinutes() : orderlist.data[i].receiveTime.getMinutes();
      }
      if (orderlist.data[i].canceledTime != null) {
        this.data.receiveList[i].canceledMonth = orderlist.data[i].canceledTime.getMonth() + 1;
        this.data.receiveList[i].canceledDay = orderlist.data[i].canceledTime.getDate();
        this.data.receiveList[i].canceledHour = (orderlist.data[i].canceledTime.getHours() < 10) ? "0" + orderlist.data[i].canceledTime.getHours() : orderlist.data[i].canceledTime.getHours();
        this.data.receiveList[i].canceledMinutes = (orderlist.data[i].canceledTime.getMinutes() < 10) ? "0" + orderlist.data[i].canceledTime.getMinutes() : orderlist.data[i].canceledTime.getMinutes();
      }
      if (orderlist.data[i].deliveriedTime != null) {
        this.data.receiveList[i].deliveriedMonth = orderlist.data[i].deliveriedTime.getMonth() + 1;
        this.data.receiveList[i].deliveriedDay = orderlist.data[i].deliveriedTime.getDate();
        this.data.receiveList[i].deliveriedHour = (orderlist.data[i].deliveriedTime.getHours() < 10) ? "0" + orderlist.data[i].deliveriedTime.getHours() : orderlist.data[i].deliveriedTime.getHours();
        this.data.receiveList[i].deliveriedMinutes = (orderlist.data[i].deliveriedTime.getMinutes() < 10) ? "0" + orderlist.data[i].deliveriedTime.getMinutes() : orderlist.data[i].deliveriedTime.getMinutes();
      }
    }
    this.setData({
      receiveList: this.data.receiveList
    })
    this.UpdataorderListHeight();
  },
  UpdataReceiveList: async function () {
    if (this.data.receiveOrderOver == true) {
      wx.showToast({
        title: "无更多订单",
        icon: "none"
      })
      return;
    }

    let that = this;
    const db = wx.cloud.database();
    const order = db.collection('orderlist');
    let orderlist = await order.where({
      receiver: that.data.userInfo.openid
    }).orderBy('receiveTime', 'desc').skip(that.data.receiveListSkip).limit(that.data.receiveListStep).get();

    if (orderlist.data.length == 0) {
      this.data.receiveOrderOver = true;
      return;
    }

    for (let i = 0; i < orderlist.data.length; i++) {
      orderlist.data[i].announceMonth = orderlist.data[i].announceTime.getMonth() + 1;
      orderlist.data[i].announceDay = orderlist.data[i].announceTime.getDate();
      orderlist.data[i].announceHour = (orderlist.data[i].announceTime.getHours() < 10) ? "0" + orderlist.data[i].announceTime.getHours() : orderlist.data[i].announceTime.getHours();
      orderlist.data[i].announceMinutes = (orderlist.data[i].announceTime.getMinutes() < 10) ? "0" + orderlist.data[i].announceTime.getMinutes() : orderlist.data[i].announceTime.getMinutes();
      if (orderlist.data[i].receiveTime != null) {
        orderlist.data[i].receiveMonth = orderlist.data[i].receiveTime.getMonth() + 1;
        orderlist.data[i].receiveDay = orderlist.data[i].receiveTime.getDate();
        orderlist.data[i].receiveHour = (orderlist.data[i].receiveTime.getHours() < 10) ? "0" + orderlist.data[i].receiveTime.getHours() : orderlist.data[i].receiveTime.getHours();
        orderlist.data[i].receiveMinutes = (orderlist.data[i].receiveTime.getMinutes() < 10) ? "0" + orderlist.data[i].receiveTime.getMinutes() : orderlist.data[i].receiveTime.getMinutes();
      }
      if (orderlist.data[i].canceledTime != null) {
        orderlist.data[i].canceledMonth = orderlist.data[i].canceledTime.getMonth() + 1;
        orderlist.data[i].canceledDay = orderlist.data[i].canceledTime.getDate();
        orderlist.data[i].canceledHour = (orderlist.data[i].canceledTime.getHours() < 10) ? "0" + orderlist.data[i].canceledTime.getHours() : orderlist.data[i].canceledTime.getHours();
        orderlist.data[i].canceledMinutes = (orderlist.data[i].canceledTime.getMinutes() < 10) ? "0" + orderlist.data[i].canceledTime.getMinutes() : orderlist.data[i].canceledTime.getMinutes();
      }
      if (orderlist.data[i].deliveriedTime != null) {
        orderlist.data[i].deliveriedMonth = orderlist.data[i].deliveriedTime.getMonth() + 1;
        orderlist.data[i].deliveriedDay = orderlist.data[i].deliveriedTime.getDate();
        orderlist.data[i].deliveriedHour = (orderlist.data[i].deliveriedTime.getHours() < 10) ? "0" + orderlist.data[i].deliveriedTime.getHours() : orderlist.data[i].deliveriedTime.getHours();
        orderlist.data[i].deliveriedMinutes = (orderlist.data[i].deliveriedTime.getMinutes() < 10) ? "0" + orderlist.data[i].deliveriedTime.getMinutes() : orderlist.data[i].deliveriedTime.getMinutes();
      }

      this.data.receiveList.push(orderlist.data[i])
    }
    this.setData({
      receiveList: this.data.receiveList,
      receiveListSkip: this.data.receiveListSkip + this.data.receiveListStep
    })

    this.UpdataorderListHeight()
  },
  AnnounceListInit: async function () {
    if (this.data.userInfo.openid == "") {
      setTimeout(this.AnnounceListInit, 200);
      return;
    }

    this.data.announceListSkip = 18;
    this.data.announceOrderOver = false;

    const db = wx.cloud.database();
    const order = db.collection('orderlist');
    let orderlist = await order.where({
      announcer: this.data.userInfo.openid
    }).orderBy('announceTime', 'desc').limit(this.data.announceListSkip).get();
    this.setData({
      announceList: orderlist.data
    })
    for (let i = 0; i < orderlist.data.length; i++) {
      this.data.announceList[i].announceMonth = orderlist.data[i].announceTime.getMonth() + 1;
      this.data.announceList[i].announceDay = orderlist.data[i].announceTime.getDate();
      this.data.announceList[i].announceHour = (orderlist.data[i].announceTime.getHours() < 10) ? "0" + orderlist.data[i].announceTime.getHours() : orderlist.data[i].announceTime.getHours();
      this.data.announceList[i].announceMinutes = (orderlist.data[i].announceTime.getMinutes() < 10) ? "0" + orderlist.data[i].announceTime.getMinutes() : orderlist.data[i].announceTime.getMinutes();
      if (orderlist.data[i].receiveTime != null) {
        this.data.announceList[i].receiveMonth = orderlist.data[i].receiveTime.getMonth() + 1;
        this.data.announceList[i].receiveDay = orderlist.data[i].receiveTime.getDate();
        this.data.announceList[i].receiveHour = (orderlist.data[i].receiveTime.getHours() < 10) ? "0" + orderlist.data[i].receiveTime.getHours() : orderlist.data[i].receiveTime.getHours();
        this.data.announceList[i].receiveMinutes = (orderlist.data[i].receiveTime.getMinutes() < 10) ? "0" + orderlist.data[i].receiveTime.getMinutes() : orderlist.data[i].receiveTime.getMinutes();
      }
      if (orderlist.data[i].canceledTime != null) {
        this.data.announceList[i].canceledMonth = orderlist.data[i].canceledTime.getMonth() + 1;
        this.data.announceList[i].canceledDay = orderlist.data[i].canceledTime.getDate();
        this.data.announceList[i].canceledHour = (orderlist.data[i].canceledTime.getHours() < 10) ? "0" + orderlist.data[i].canceledTime.getHours() : orderlist.data[i].canceledTime.getHours();
        this.data.announceList[i].canceledMinutes = (orderlist.data[i].canceledTime.getMinutes() < 10) ? "0" + orderlist.data[i].canceledTime.getMinutes() : orderlist.data[i].canceledTime.getMinutes();
      }
      if (orderlist.data[i].deliveriedTime != null) {
        this.data.announceList[i].deliveriedMonth = orderlist.data[i].deliveriedTime.getMonth() + 1;
        this.data.announceList[i].deliveriedDay = orderlist.data[i].deliveriedTime.getDate();
        this.data.announceList[i].deliveriedHour = (orderlist.data[i].deliveriedTime.getHours() < 10) ? "0" + orderlist.data[i].deliveriedTime.getHours() : orderlist.data[i].deliveriedTime.getHours();
        this.data.announceList[i].deliveriedMinutes = (orderlist.data[i].deliveriedTime.getMinutes() < 10) ? "0" + orderlist.data[i].deliveriedTime.getMinutes() : orderlist.data[i].deliveriedTime.getMinutes();
      }
    }
    this.setData({
      announceList: this.data.announceList
    })
    this.UpdataorderListHeight();
  },
  UpdataAnnounceList: async function () {
    if (this.data.announceOrderOver == true) {
      wx.showToast({
        title: "无更多订单",
        icon: "none"
      })
      return;
    }

    let that = this;
    const db = wx.cloud.database();
    const order = db.collection('orderlist');
    let orderlist = await order.where({
      announcer: that.data.userInfo.openid
    }).orderBy('announceTime', 'desc').skip(that.data.announceListSkip).limit(that.data.announceListStep).get();

    if (orderlist.data.length == 0) {
      this.data.announceOrderOver = true;
      return;
    }

    for (let i = 0; i < orderlist.data.length; i++) {
      orderlist.data[i].announceMonth = orderlist.data[i].announceTime.getMonth() + 1;
      orderlist.data[i].announceDay = orderlist.data[i].announceTime.getDate();
      orderlist.data[i].announceHour = (orderlist.data[i].announceTime.getHours() < 10) ? "0" + orderlist.data[i].announceTime.getHours() : orderlist.data[i].announceTime.getHours();
      orderlist.data[i].announceMinutes = (orderlist.data[i].announceTime.getMinutes() < 10) ? "0" + orderlist.data[i].announceTime.getMinutes() : orderlist.data[i].announceTime.getMinutes();
      if (orderlist.data[i].receiveTime != null) {
        orderlist.data[i].receiveMonth = orderlist.data[i].receiveTime.getMonth() + 1;
        orderlist.data[i].receiveDay = orderlist.data[i].receiveTime.getDate();
        orderlist.data[i].receiveHour = (orderlist.data[i].receiveTime.getHours() < 10) ? "0" + orderlist.data[i].receiveTime.getHours() : orderlist.data[i].receiveTime.getHours();
        orderlist.data[i].receiveMinutes = (orderlist.data[i].receiveTime.getMinutes() < 10) ? "0" + orderlist.data[i].receiveTime.getMinutes() : orderlist.data[i].receiveTime.getMinutes();
      }
      if (orderlist.data[i].canceledTime != null) {
        orderlist.data[i].canceledMonth = orderlist.data[i].canceledTime.getMonth() + 1;
        orderlist.data[i].canceledDay = orderlist.data[i].canceledTime.getDate();
        orderlist.data[i].canceledHour = (orderlist.data[i].canceledTime.getHours() < 10) ? "0" + orderlist.data[i].canceledTime.getHours() : orderlist.data[i].canceledTime.getHours();
        orderlist.data[i].canceledMinutes = (orderlist.data[i].canceledTime.getMinutes() < 10) ? "0" + orderlist.data[i].canceledTime.getMinutes() : orderlist.data[i].canceledTime.getMinutes();
      }
      if (orderlist.data[i].deliveriedTime != null) {
        orderlist.data[i].deliveriedMonth = orderlist.data[i].deliveriedTime.getMonth() + 1;
        orderlist.data[i].deliveriedDay = orderlist.data[i].deliveriedTime.getDate();
        orderlist.data[i].deliveriedHour = (orderlist.data[i].deliveriedTime.getHours() < 10) ? "0" + orderlist.data[i].deliveriedTime.getHours() : orderlist.data[i].deliveriedTime.getHours();
        orderlist.data[i].deliveriedMinutes = (orderlist.data[i].deliveriedTime.getMinutes() < 10) ? "0" + orderlist.data[i].deliveriedTime.getMinutes() : orderlist.data[i].deliveriedTime.getMinutes();
      }

      this.data.announceList.push(orderlist.data[i])
    }
    this.setData({
      announceList: this.data.announceList,
      announceListSkip: this.data.announceListSkip + this.data.announceListStep
    })
    this.UpdataorderListHeight()
  },
  // 发布订单的表单处理
  bindMultiPickerColumnChange: function (e) {
    app.bindMultiPickerColumnChange(e);
    this.DataSync();
  },
  bindMultiPickerChange: function (e) {
    app.bindMultiPickerChange(e);
    this.DataSync();
    this.data.package.moveTo[0] = this.data.addrInfo.mybuilding;
    this.data.package.moveTo[1] = this.data.addrInfo.myfloor;
    this.data.package.moveTo[2] = this.data.addrInfo.myroom;
    this.setData({
      package: this.data.package
    })
  },
  bindPickerChange: function (e) {
    this.data.package.getPack = this.data.packArray[e.detail.value];
    this.setData({
      package: this.data.package,
    })
  },
  InputKind: function (e) {
    this.data.package.kind = e.detail.value;
    this.setData({
      package: this.data.package,
    })
  },
  InputPickupCode: function (e) {
    this.data.package.pickupCode = e.detail.value;
    this.setData({
      package: this.data.package,
    })
  },
  InputPickupReceiver: function (e) {
    this.data.package.pickupReceiver = e.detail.value;
    this.setData({
      package: this.data.package,
    })
  },
  InputPickupNumber: function (e) {
    this.data.package.pickupNumber = Number(e.detail.value);
    this.setData({
      package: this.data.package,
    })
  },
  InputReward: function (e) {
    this.data.package.reward = e.detail.value;
    this.setData({
      package: this.data.package,
    })
  },
  InputRemarks: function (e) {
    this.data.package.remarks = e.detail.value;
    this.setData({
      package: this.data.package,
    })
  },

  // 订单事件处理
  Announce: function () {
    let that = this;
    if (that.data.package.pickupCode == "") {
      wx.showToast({
        title: "请输入取货码",
        icon: "none"
      })
      return;
    }
    if (that.data.package.pickupReceiver == "") {
      wx.showToast({
        title: "请输入姓名",
        icon: "none"
      })
      return;
    }
    let pickup_number_patt = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    if (!pickup_number_patt.test(that.data.package.pickupNumber)) {
      wx.showToast({
        title: "请正确输入手机号",
        icon: "none"
      })
      return;
    }
    if (that.data.reward == "") {
      wx.showToast({
        title: "请输入酬劳",
        icon: "none"
      })
      return;
    }

    that.ChangeAddOrderDisplayState();

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法发单")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    const db = wx.cloud.database();
    db.collection('orderlist').add({
      data: {
        announcer: that.data.userInfo.openid,
        announceTime: new Date(),
        receiver: null,
        receiveTime: null,
        deliveried: false,
        deliveriedTime: null,
        canceled: false,
        canceledTime: null,
        package: {
          getPack: that.data.package.getPack,
          pickupCode: that.data.package.pickupCode,
          kind: that.data.package.kind,
          pickupReceiver: that.data.package.pickupReceiver,
          pickupNumber: that.data.package.pickupNumber,
          moveTo: [
            that.data.package.moveTo[0],
            that.data.package.moveTo[1],
            that.data.package.moveTo[2]
          ],
          reward: that.data.package.reward,
          remarks: that.data.package.remarks
        }
      },
      success: function (res) {
        wx.showToast({
          title: "发布成功"
        });

        const db = wx.cloud.database();
        const _ = db.command;
        const order = db.collection('orderdata');
        let orderdata = order.doc('e656fa635f64a4a3001384d46443f6be').update({
          data: {
            announceorder: _.inc(1)
          }
        });
      },
      fail: function (res) {
        wx.showToast({
          title: "注册失败",
          icon: '"none'
        })
      }
    })
  },
  Cancel: function () {
    this.ChangeAnnounceOrderDisplayState()

    let that = this;
    const db = wx.cloud.database();
    db.collection('orderlist').where({
      _id: that.data.outAnnounceOrder._id
    }).update({
      data: {
        canceled: true,
        canceledTime: new Date()
      },
      success: function (res) {
        wx.showToast({
          title: "取消成功"
        });

        const db = wx.cloud.database();
        const _ = db.command;
        const order = db.collection('orderdata');
        let orderdata = order.doc('e656fa635f64a4a3001384d46443f6be').update({
          data: {
            announceorder: _.inc(-1),
            canceledorder: _.inc(1)
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: "取消失败",
          icon: "none"
        })
      }
    })
  },
  ConfirmReceipt: function () {
    this.ChangeAnnounceOrderDisplayState()

    let that = this;
    const db = wx.cloud.database();
    db.collection('orderlist').where({
      _id: that.data.outAnnounceOrder._id
    }).update({
      data: {
        deliveried: true,
        deliveriedTime: new Date()
      },
      success: function (res) {
        wx.showToast({
          title: "收货成功"
        });

        const db = wx.cloud.database();
        const _ = db.command;
        const order = db.collection('orderdata');
        let orderdata = order.doc('e656fa635f64a4a3001384d46443f6be').update({
          data: {
            receivedorder: _.inc(-1),
            deliveriedorder: _.inc(1)
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: "收货失败",
          icon: "none"
        })
      }
    })
  },
  // 接收订单列表处理
  UpdateOutReceiveOrderDetails: async function (id) {
    this.setData({
      outReceiveOrder: this.data.receiveList[id]
    })
    if (this.data.outReceiveOrder.deliveried == true) {
      console.log("已完成的订单");
    } else {
      console.log("未完成的订单");
      const db = wx.cloud.database();
      let user_list = await db.collection('userlist').where({
        openid: this.data.outReceiveOrder.announcer
      }).get({});

      this.data.outReceiveOrder.announcerName = user_list.data[0].name;
      this.data.outReceiveOrder.announcerPhone = user_list.data[0].phone;
      this.data.outReceiveOrder.announcerQq = user_list.data[0].qq;
      this.setData({
        outReceiveOrder: this.data.outReceiveOrder
      })
    }

  },
  ReceiveOrderDetails: function (e) {
    this.UpdateOutReceiveOrderDetails(e.currentTarget.id);
    this.ChangeReceiveOrderDisplayState();
  },
  // 发布订单列表处理
  UpdateOutAnnounceOrderDetails: async function (id) {
    this.setData({
      outAnnounceOrder: this.data.announceList[id]
    })
    if (this.data.outAnnounceOrder.canceled == true) {
      console.log("已取消的订单")
    } else if (this.data.outAnnounceOrder.canceled != true && this.data.outAnnounceOrder.receiver == null) {
      console.log("已发布的订单")
    } else if (this.data.outAnnounceOrder.canceled != true && this.data.outAnnounceOrder.receiver != null && this.data.outAnnounceOrder.deliveried == false) {
      console.log("已接收的订单")
      const db = wx.cloud.database();
      let user_list = await db.collection('userlist').where({
        openid: this.data.outAnnounceOrder.receiver
      }).get({});
      this.data.outAnnounceOrder.receiverName = user_list.data[0].name;
      this.data.outAnnounceOrder.receiverPhone = user_list.data[0].phone;
      this.data.outAnnounceOrder.receiverQq = user_list.data[0].qq;
      this.setData({
        outAnnounceOrder: this.data.outAnnounceOrder
      })
    } else if (this.data.outAnnounceOrder.canceled != true && this.data.outAnnounceOrder.receiver != null && this.data.outAnnounceOrder.deliveried == true) {
      console.log("已完成的订单")
    }
  },
  AnnounceOrderDetails: function (e) {
    this.UpdateOutAnnounceOrderDetails(e.currentTarget.id);
    this.ChangeAnnounceOrderDisplayState();
  },


  UpdataorderListHeight: function () {
    let height = 0;
    if (this.data.swiperIndex == 0) {
      height = this.data.receiveList.length * 200 + 20;
    } else {
      height = this.data.announceList.length * 200 + 20;
    }
    if (height < 800) {
      height = 800
    }
    this.setData({
      orderListHeight: height
    })
  },
  SwiperChange: function (e) {
    this.data.swiperIndex = (this.data.swiperIndex == 0) ? 1 : 0;
    var middle_var = this.data.receiveSwiper;
    this.setData({
      receiveSwiper: this.data.announceSwiper,
      announceSwiper: middle_var
    });
    this.UpdataorderListHeight();
  },
  kongbai: function () {
    console.log("专业避免父节点点击事件侵入子节点的空事件");
  },

  // 从app页面同步数据
  DataSync: function () {
    this.setData({
      loginDisplay: app.globalData.loginDisplay,
      addrInfo: app.globalData.addrInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo,
      kindArray: app.globalData.kindArray,
      packArray: app.globalData.packArray
    })

    // 处理异步问题
    if (this.data.userInfo.openid == "") {
      setTimeout(this.DataSync, 200);
      return;
    }
  },

  // 默认设置信息同步
  DefaultSync: function () {
    this.data.package.moveTo = this.data.userInfo.defaultaddr;
    this.data.package.pickupReceiver = this.data.userInfo.name;
    this.data.package.pickupNumber = this.data.userInfo.phone;
    this.setData({
      package: this.data.package
    })

    // 处理异步问题
    if (this.data.userInfo.openid == "") {
      setTimeout(this.DefaultSync, 200);
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
    this.UpdataorderListHeight();
    this.DataSync();
    this.DefaultSync();
    this.ReceiveListInit();
    this.AnnounceListInit();
  },
  onReady: function () {
    // 页面首次渲染完毕时执行

  },
  onShow: function () {
    // 页面出现在前台时执行
    this.DataSync();
  },
  onHide: function () {
    // 页面从前台变为后台时执行

  },
  onUnload: function () {
    // 页面销毁时执行

  },
  onPullDownRefresh: function () {
    // 触发下拉刷新时执行
    if (this.data.swiperIndex == 0) {
      this.ReceiveListInit()
    } else {
      this.AnnounceListInit()
    }
  },
  onReachBottom: function () {
    // 页面触底时执行
    if (this.data.swiperIndex == 0) {
      this.UpdataReceiveList()
    } else {
      this.UpdataAnnounceList()
    }
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行

  }
})