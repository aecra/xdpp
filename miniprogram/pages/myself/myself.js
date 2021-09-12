// pages/myself/myself.js
const app = getApp()

Page({

  // 本页面独有数据
  data: {
    motto: [
      "温柔半两 从容一生",
      "一切都会好的 城南的花都开了",
      "一定要站在你所热爱的世界里闪闪发光",
      "种自己的花 爱自己的宇宙",
      "少女的征途是星辰大海并非烟尘人间",
      "成为可以照亮这个世界的大人吧",
      "没关系 天空越黑 星星越亮",
      "万事都要全力以赴 包括开心",
      "无法阻止自己落俗，但浪漫不死",
      "把期望降到最低 所有遇见都是礼物",
      "未来会很明朗 好运正在路上",
      "一生温暖纯良 不舍爱与自由",
      "要有勇气成为他人的过去",
      "鲸落海底 哺暗界众生十五年",
      "夜暗方显万颗星 灯明始见一缕尘",
      "十里寒塘路 烟花一半醒",
      "极致的爱意会融化暴戾和不安",
      "熬过无人问津的日子才有诗和远方",
      "抬头仰望 别浪费了月亮",
      "愿你以渺小启程 以伟大结尾",
      "我们苛刻相待 却说这是诚实",
      "碧山人来 清酒深杯"
    ],
    oneMotto: "",
    nameSetDisplay: "none",
    phoneSetDisplay: "none",
    qqSetDisplay: "none",
    studentIdSetDisplay: "none",
    addressSetDisplay: "none",

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
  UpdataMotto: function () {
    this.setData({
      oneMotto: this.data.motto[(Math.floor(Math.random() * this.data.motto.length))]
    })
  },
  CopyMooto: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.oneMotto,
      success: function () {
        wx.showToast({
          title: '复制成功'
        })
      }
    })
  },
  BannerSee: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: ['https://web-1255835707.cos.ap-beijing.myqcloud.com/app/my_banner_1.png',
        'https://web-1255835707.cos.ap-beijing.myqcloud.com/app/my_banner_2.png',
      ]
    })
  },
  AdSee: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: ['https://web-1255835707.cos.ap-beijing.myqcloud.com/app/ad_1.png',
        'https://web-1255835707.cos.ap-beijing.myqcloud.com/app/ad_2.png',
        'https://web-1255835707.cos.ap-beijing.myqcloud.com/app/ad_3.png'
      ]
    })
  },
  ChangeNameSetDisplayState: function () {
    if (this.data.nameSetDisplay == "none") {
      this.setData({
        nameSetDisplay: "flex"
      });
    } else if (this.data.nameSetDisplay == "flex") {
      this.setData({
        nameSetDisplay: "none"
      });
    }
  },
  ChangePhoneSetDisplayState: function () {
    if (this.data.phoneSetDisplay == "none") {
      this.setData({
        phoneSetDisplay: "flex"
      });
    } else if (this.data.phoneSetDisplay == "flex") {
      this.setData({
        phoneSetDisplay: "none"
      });
    }
  },
  ChangeQqSetDisplayState: function () {
    if (this.data.qqSetDisplay == "none") {
      this.setData({
        qqSetDisplay: "flex"
      });
    } else if (this.data.qqSetDisplay == "flex") {
      this.setData({
        qqSetDisplay: "none"
      });
    }
  },
  ChangeStudentIdSetDisplayState: function () {
    if (this.data.studentIdSetDisplay == "none") {
      this.setData({
        studentIdSetDisplay: "flex"
      });
    } else if (this.data.studentIdSetDisplay == "flex") {
      this.setData({
        studentIdSetDisplay: "none"
      });
    }
  },
  ChangeAddressSetDisplayState: function () {
    if (this.data.addressSetDisplay == "none") {
      this.setData({
        addressSetDisplay: "flex"
      });
    } else if (this.data.addressSetDisplay == "flex") {
      this.setData({
        addressSetDisplay: "none"
      });
    }
  },
  ChangeLoginDisplayState: function () {
    if (this.data.loginDisplay == "none") {
      this.setData({
        loginDisplay: "flex"
      });
    } else if (this.data.loginDisplay == "flex") {
      this.setData({
        loginDisplay: "none"
      });
    }
  },
  kongbai: function () {
    console.log("专业避免父节点点击事件侵入子节点的空事件");
  },
  LeavingMessage: function () {
    wx.setClipboardData({
      data: "xdpp@aecra.cn",
      success: function () {
        wx.showToast({
          title: '邮箱复制成功'
        })
      }
    })
  },
  // 个人信息更新
  InputLocalName: function (e) {
    this.data.userInfo.name = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo,
    })
  },
  InputLocalStudentId: function (e) {
    this.data.userInfo.student_id = Number(e.detail.value);
    this.setData({
      userInfo: this.data.userInfo,
    })
  },
  InputLocalPhone: function (e) {
    this.data.userInfo.phone = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo,
    })
  },
  InputLocalQq: function (e) {
    this.data.userInfo.qq = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo,
    })
  },
  LocalMultiPickerColumnChange: function (e) {
    app.bindMultiPickerColumnChange(e);
    this.DataSync();
  },
  LocalMultiPickerChange: function (e) {
    app.bindMultiPickerChange(e);
    this.DataSync();
  },
  UpdataName: function () {
    let that = this;
    let name_patt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
    if (!name_patt.test(that.data.userInfo.name)) {
      wx.showToast({
        title: "请正确输入姓名",
        icon: "none"
      })
      return;
    }
    this.ChangeNameSetDisplayState();

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法修改个人信息")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    const db = wx.cloud.database();
    db.collection('userlist').where({
      openid: that.data.userInfo.openid
    }).update({
      data: {
        name: that.data.userInfo.name
      },
      success: function (res) {
        wx.showToast({
          title: "修改成功"
        })
        // 同步修改全局数据
        app.globalData.userInfo.name = that.data.userInfo.name
      },
      fail: function () {
        wx.showToast({
          title: "修改失败",
          icon: "none"
        })
      }
    })
  },
  UpdataPhone: function () {
    let that = this;
    let phone_patt = /^1([35689][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    if (!phone_patt.test(Number(that.data.userInfo.phone))) {
      wx.showToast({
        title: "请正确输入手机号",
        icon: "none"
      })
      return;
    }
    this.ChangePhoneSetDisplayState();

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法修改个人信息")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    const db = wx.cloud.database();
    db.collection('userlist').where({
      openid: that.data.userInfo.openid
    }).update({
      data: {
        phone: that.data.userInfo.phone
      },
      success: function (res) {
        wx.showToast({
          title: "修改成功"
        })
        // 同步修改全局数据
        app.globalData.userInfo.phone = that.data.userInfo.phone
      },
      fail: function () {
        wx.showToast({
          title: "修改失败",
          icon: "none"
        })
      }
    })
  },
  UpdataQq: function () {
    let that = this;
    let qq_patt = /^[1-9][0-9]{4,13}$/
    if (!qq_patt.test(that.data.userInfo.qq)) {
      wx.showToast({
        title: "请正确输入QQ号",
        icon: "none"
      })
      return;
    }
    this.ChangeQqSetDisplayState();

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法修改个人信息")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    const db = wx.cloud.database();
    db.collection('userlist').where({
      openid: that.data.userInfo.openid
    }).update({
      data: {
        qq: that.data.userInfo.qq
      },
      success: function (res) {
        wx.showToast({
          title: "修改成功"
        })
        // 同步修改全局数据
        app.globalData.userInfo.qq = that.data.userInfo.qq
      },
      fail: function () {
        wx.showToast({
          title: "修改失败",
          icon: "none"
        })
      }
    })
  },
  UpdataStudentId: function () {
    let that = this;
    let student_id_patt = /^(17|18|19|20)[0-9]{9}$/
    if (!student_id_patt.test(that.data.userInfo.student_id)) {
      wx.showToast({
        title: "请正确输入学号",
        icon: "none"
      })
      return;
    }
    this.ChangeStudentIdSetDisplayState();

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法修改个人信息")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    const db = wx.cloud.database();
    db.collection('userlist').where({
      openid: that.data.userInfo.openid
    }).update({
      data: {
        student_id: that.data.userInfo.student_id
      },
      success: function (res) {
        wx.showToast({
          title: "修改成功"
        })
        // 同步修改全局数据
        app.globalData.userInfo.student_id = that.data.userInfo.student_id
      },
      fail: function () {
        wx.showToast({
          title: "修改失败",
          icon: "none"
        })
      }
    })
  },
  UpdataAddress: function () {
    app.UpdataAddr();
    this.DataSync();
    this.ChangeAddressSetDisplayState();

    // 针对小人（未知手段跳过注册）
    app.InUserlist().then((res) => {
      if (!res) {
        // 加入黑名单
        app.AddInBlacklist("非法修改个人信息")
        // 流氓警告
        app.HandlingBlacklist()
        return;
      }
    })

    let that = this;
    const db = wx.cloud.database();
    db.collection('userlist').where({
      openid: that.data.userInfo.openid
    }).update({
      data: {
        defaultaddr: [
          that.data.addrInfo.mybuilding,
          that.data.addrInfo.myfloor,
          that.data.addrInfo.myroom
        ]
      },
      success: function (res) {
        wx.showToast({
          title: "修改成功"
        })
        app.UpdataAddr();
      },
      fail: function () {
        wx.showToast({
          title: "修改失败",
          icon: "none"
        })
      }
    })
  },

  // 从app页面同步数据
  DataSync: function () {
    this.setData({
      loginDisplay: app.globalData.loginDisplay,
      addrInfo: app.globalData.addrInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo
    })

    // 处理异步问题
    if (this.data.userInfo.openid == "") {
      setTimeout(this.DataSync, 100);
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
    this.UpdataMotto();
    this.DataSync();
  },
  // 页面创建时执行
  onReady: function () {
    // 页面创建时执行

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

  },
  onReachBottom: function () {
    // 页面触底时执行

  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行

  }
})