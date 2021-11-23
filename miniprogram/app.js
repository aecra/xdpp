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
  }
});