//app.js
App({
  globalData: {
    loginDisplay: "none",

    // 快递种类
    kindArray: [],
    // 快递地点
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
      defaultaddr: ["竹园1号楼", "一层", "1-101"],
      name: "",
      qq: "",
      registerTime: null,
      student_id: null,
      phone: null
    }
  },
  AddrInit: async function () {
    const db = wx.cloud.database();
    const addr = db.collection('addr');
    let resAddr = await addr.get();
    this.globalData.addrInfo.allAddrData = resAddr.data[0].addr

    for (let i = 0; i < this.globalData.addrInfo.allAddrData.length; i++) {
      this.globalData.addrInfo.multiArray[0][i] = this.globalData.addrInfo.allAddrData[i].building;
    }
    for (let i = 0; i < this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors.length; i++) {
      this.globalData.addrInfo.multiArray[1][i] = this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[i].floor;
    }
    for (let i = 0; i < this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[this.globalData.addrInfo.multiIndex[1]].rooms.length; i++) {
      this.globalData.addrInfo.multiArray[2][i] = this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[this.globalData.addrInfo.multiIndex[1]].rooms[i].room;
    }
  },
  PackInit: async function () {
    const db = wx.cloud.database();
    const addr = db.collection('packageaddr');
    let resAddr = await addr.get();
    for (let i = 0; i < resAddr.data.length; i++) {
      this.globalData.packArray[i] = resAddr.data[i].addr;
    }
  },
  KindInit: async function () {
    const db = wx.cloud.database();
    const kinds = db.collection('packagekind');
    let reskinds = await kinds.get();
    for (let i = 0; i < reskinds.data.length; i++) {
      this.globalData.kindArray[i] = reskinds.data[i].kind;
    }
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.globalData.addrInfo.multiArray,
      multiIndex: this.globalData.addrInfo.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        //第一列改变  设置第二列数据
        this.globalData.addrInfo.multiArray[1] = [];
        this.globalData.addrInfo.multiArray[2] = [];
        for (let i = 0; i < this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors.length; i++) {
          this.globalData.addrInfo.multiArray[1][i] = this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[i].floor;
        }
        for (let i = 0; i < this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[this.globalData.addrInfo.multiIndex[1]].rooms.length; i++) {
          this.globalData.addrInfo.multiArray[2][i] = this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[this.globalData.addrInfo.multiIndex[1]].rooms[i].room;
        }
        break;
      case 1:
        //第二列改变 设置第三列数据
        this.globalData.addrInfo.multiArray[2] = [];
        for (let i = 0; i < this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[this.globalData.addrInfo.multiIndex[1]].rooms.length; i++) {
          this.globalData.addrInfo.multiArray[2][i] = this.globalData.addrInfo.allAddrData[this.globalData.addrInfo.multiIndex[0]].floors[this.globalData.addrInfo.multiIndex[1]].rooms[i].room;
        }
        break;
      case 2:
        this.globalData.addrInfo.multiArray = data.multiArray;
        break;
    }
  },
  bindMultiPickerChange: function (e) {
    this.globalData.addrInfo.multiIndex = e.detail.value;
    this.globalData.addrInfo.mybuilding = this.globalData.addrInfo.multiArray[0][this.globalData.addrInfo.multiIndex[0]];
    this.globalData.addrInfo.myfloor = this.globalData.addrInfo.multiArray[1][this.globalData.addrInfo.multiIndex[1]];
    this.globalData.addrInfo.myroom = this.globalData.addrInfo.multiArray[2][this.globalData.addrInfo.multiIndex[2]];
  },
  ReadAddr: function () {
    this.addrInfo.mybuilding = this.globalData.userInfo.defaultaddr[0];
    this.addrInfo.myfloor = this.globalData.userInfo.defaultaddr[0];
    this.addrInfo.myroom = this.globalData.userInfo.defaultaddr[0];
  },
  UpdataAddr: function () {
    this.globalData.userInfo.defaultaddr[0] = this.globalData.addrInfo.mybuilding;
    this.globalData.userInfo.defaultaddr[1] = this.globalData.addrInfo.myfloor;
    this.globalData.userInfo.defaultaddr[2] = this.globalData.addrInfo.myroom;
  },
  InputName: function (e) {
    this.globalData.userInfo.name = e.detail.value;
  },
  InputStudentId: function (e) {
    this.globalData.userInfo.student_id = Number(e.detail.value);
  },
  InputPhone: function (e) {
    this.globalData.userInfo.phone = Number(e.detail.value);
  },
  InputQq: function (e) {
    this.globalData.userInfo.qq = e.detail.value;
  },
  InputAgreement: function (e) {
    this.globalData.userInfo.agreement = e.detail.value;
  },
  InBlacklist: async function () {
    let that = this;
    const db = wx.cloud.database();
    let user_list = await db.collection('blacklist').where({
      openid: that.globalData.userInfo.openid
    }).get({});
    if (user_list.data.length != 0) {
      return true;
    } else {
      return false;
    }
  },
  InUserlist: async function () {
    let that = this;
    const db = wx.cloud.database();
    let user_list = await db.collection('userlist').where({
      openid: that.globalData.userInfo.openid
    }).get({});
    if (user_list.data.length != 0) {
      return true;
    } else {
      return false;
    }
  },
  AddInBlacklist: async function (kind = "未知") {
    let that = this;
    const db = wx.cloud.database();
    db.collection('blacklist').add({
      data: {
        openid: that.globalData.userInfo.openid,
        time: new Date(),
        way: kind
      }
    })
  },
  HandlingBlacklist: function () {
    let that = this;
    wx.showModal({
      title: '警告',
      content: '您已被列入黑名单，若继续使用请联系开发者（QQ：2950045792）',
      success(res) {
        if (res.confirm) {
          that.HandlingBlacklist()
        } else if (res.cancel) {
          that.HandlingBlacklist()
        }
      }
    })
  },
  LoadInfo: async function () {
    let openid = await wx.cloud.callFunction({
      name: 'login'
    });
    openid = openid.result.openid;
    const db = wx.cloud.database();
    let user_list = await db.collection('userlist').where({
      openid: openid
    }).get({});

    if (user_list.data.length == 0) {
      this.globalData.userInfo.openid = openid;
      this.globalData.loginDisplay = "flex";
    } else {
      this.globalData.loginDisplay = "none";
      this.globalData.hasUserInfo = true;
      this.globalData.userInfo = user_list.data[0];
    }

    // 黑名单处理 
    this.InBlacklist().then((res) => {
      if (res) {
        console.log(this.InBlacklist())
        this.HandlingBlacklist()
      }
    })
  },
  Register: async function (e) {
    let that = this;
    let name_patt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
    if (!name_patt.test(that.globalData.userInfo.name)) {
      wx.showToast({
        title: "请正确输入姓名",
        icon: "none"
      })
      return;
    }
    let student_id_patt = /^(17|18|19|20)[0-9]{9}$/
    if (!student_id_patt.test(that.globalData.userInfo.student_id)) {
      wx.showToast({
        title: "请正确输入学号",
        icon: "none"
      })
      return;
    }
    let phone_patt = /^1([35689][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    if (!phone_patt.test(Number(that.globalData.userInfo.phone))) {
      wx.showToast({
        title: "请正确输入手机号",
        icon: "none"
      })
      return;
    }
    let qq_patt = /^[1-9][0-9]{4,13}$/
    if (!qq_patt.test(that.globalData.userInfo.qq)) {
      wx.showToast({
        title: "请正确输入QQ号",
        icon: "none"
      })
      return;
    }
    if (!that.globalData.userInfo.agreement) {
      wx.showToast({
        title: "请同意《用户协议》",
        icon: "none"
      })
      return;
    }

    const db = wx.cloud.database();
    db.collection('userlist').add({
      data: {
        openid: this.globalData.userInfo.openid,
        registerTime: new Date(),
        name: that.globalData.userInfo.name,
        agreement: true,
        phone: that.globalData.userInfo.phone,
        qq: that.globalData.userInfo.qq,
        student_id: that.globalData.userInfo.student_id,
        defaultaddr: [
          that.globalData.userInfo.defaultaddr[0],
          that.globalData.userInfo.defaultaddr[1],
          that.globalData.userInfo.defaultaddr[2]
        ]
      },
      success: function (res) {
        wx.showToast({
          title: "注册成功"
        })
        that.LoadInfo()
      },
      fail: function (res) {
        wx.showToast({
          title: "注册失败",
          icon: '"none'
        })
      }
    })
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'feiying-first',
        traceUser: true,
      })
    }

    // 初始化
    this.LoadInfo()
    this.AddrInit()
    this.PackInit()
    this.KindInit()
  }

})