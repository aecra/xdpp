// pages/myself/myself.js

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    motto: [
      '温柔半两 从容一生',
      '一切都会好的 城南的花都开了',
      '一定要站在你所热爱的世界里闪闪发光',
      '种自己的花 爱自己的宇宙',
      '少女的征途是星辰大海并非烟尘人间',
      '成为可以照亮这个世界的大人吧',
      '没关系 天空越黑 星星越亮',
      '万事都要全力以赴 包括开心',
      '无法阻止自己落俗，但浪漫不死',
      '把期望降到最低 所有遇见都是礼物',
      '未来会很明朗 好运正在路上',
      '一生温暖纯良 不舍爱与自由',
      '要有勇气成为他人的过去',
      '鲸落海底 哺暗界众生十五年',
      '夜暗方显万颗星 灯明始见一缕尘',
      '十里寒塘路 烟花一半醒',
      '极致的爱意会融化暴戾和不安',
      '熬过无人问津的日子才有诗和远方',
      '抬头仰望 别浪费了月亮',
      '愿你以渺小启程 以伟大结尾',
      '我们苛刻相待 却说这是诚实',
      '碧山人来 清酒深杯',
    ],
    oneMotto: '',
    change: '',
    updateDisplay: 'none',
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

  UpdataMotto() {
    this.setData({
      oneMotto: this.data.motto[(Math.floor(Math.random() * this.data.motto.length))],
    });
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

  LocalMultiPickerColumnChange(e) {
    app.bindMultiPickerColumnChange(e);
    app.UpdataAddr();
  },

  LocalMultiPickerChange(e) {
    app.bindMultiPickerChange(e);
    app.UpdataAddr();
  },

  UpdateDisplay(e) {
    this.setData({
      change: e.currentTarget.dataset.change,
    });
    this.ChangeUpdateDisplay();
  },

  ChangeUpdateDisplay() {
    this.setData({
      updateDisplay: this.data.updateDisplay === 'none' ? 'flex' : 'none',
    });
  },

  async UpdateUserInfo(e) {
    const data = e.detail.value;
    data.type = this.data.change;
    if (this.data.change === 'addr') {
      data.addr[0] = this.data.addrInfo.multiArray[0][data.addr[0]];
      data.addr[1] = this.data.addrInfo.multiArray[1][data.addr[1]];
      data.addr[2] = this.data.addrInfo.multiArray[2][data.addr[2]];
    }
    let result = await wx.cloud.callFunction({
      name: 'updateuserinfo',
      data,
    });
    result = result.result;
    if (result.error === null) {
      wx.showToast({
        title: '修改成功',
      });
      this.ChangeUpdateDisplay();
      app.LoadInfo();
    } else {
      wx.showToast({
        title: result.error,
        icon: 'none',
      });
    }
  },

  Capture() {},

  // 从 app 页面同步数据
  DataSync() {
    wx.event.on('userInfo', (data) => {
      this.setData({
        userInfo: data,
      });
    });
    wx.event.on('addrInfo', (data) => {
      this.setData({
        addrInfo: data,
      });
    });
    wx.event.on('loginDisplay', (data) => {
      this.setData({
        loginDisplay: data,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.UpdataMotto();
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
  onPullDownRefresh() {
    app.LoadInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
