// app.js
App({
  globalData: {
    // 用户信息
    hasUserInfo: false,
    userInfo: {
      _id: "",
      _openid: "",
      openid: "",
      defaultaddr: ["竹园1号楼", "一层", "1-101"],
      name: "",
      qq: "",
      registerTime: null,
      student_id: null,
      phone: null
    }
  },

  AddrInit: async function () {
    let result = await wx.cloud.callFunction({
      name: 'addr'
    });
    let resAddr = result.result.result;
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

  LoadInfo: async function () {
    let result = await wx.cloud.callFunction({
      name: 'userinfo'
    });
    result = result.result;

    if (result.hasUserInfo) {
      this.globalData.hasUserInfo = true;
      this.globalData.userInfo = result.userInfo;
    }
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-9g3jxgcr2ffa5389',
        traceUser: true,
      });
    }

    this.LoadInfo();
    this.AddrInit()
  }
});