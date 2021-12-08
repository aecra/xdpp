// app.js
import Event from './utils/event';
// 挂载到wx的实例上
wx.event = new Event();
App({
  globalData: {
    loginDisplay: 'none',

    // 快递种类
    kindArray: [],

    // 快递地点
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
      addr: ['竹园1号楼', '一层', '1-101'],
      name: '',
      email: '',
      registerTime: null,
      studentid: null,
      phone: null,
    },
  },

  async AddrInit() {
    const result = await wx.cloud.callFunction({
      name: 'addr',
    });
    const resAddr = result.result.result;
    this.globalData.addrInfo.allAddrData = resAddr.data[0].addr;
    const { addrInfo } = this.globalData;

    for (let i = 0; i < addrInfo.allAddrData.length; i += 1) {
      addrInfo.multiArray[0][i] = addrInfo.allAddrData[i].building;
    }
    for (let i = 0; i < addrInfo.allAddrData[addrInfo.multiIndex[0]].floors.length; i += 1) {
      addrInfo.multiArray[1][i] = addrInfo.allAddrData[addrInfo.multiIndex[0]].floors[i].floor;
    }
    const { floors } = addrInfo.allAddrData[addrInfo.multiIndex[0]];
    for (let i = 0; i < floors[addrInfo.multiIndex[1]].rooms.length; i += 1) {
      addrInfo.multiArray[2][i] = floors[addrInfo.multiIndex[1]].rooms[i].room;
    }
    wx.event.emit('addrInfo', this.globalData.addrInfo);
    wx.event.emit('searchAddrInfo', this.globalData.addrInfo);
  },

  async PackInit() {
    const result = await wx.cloud.callFunction({
      name: 'packageaddr',
    });
    const resAddr = result.result.result;
    for (let i = 0; i < resAddr.data.length; i += 1) {
      this.globalData.packArray[i] = resAddr.data[i].addr;
    }
    wx.event.emit('packArray', this.globalData.packArray);
  },

  async KindInit() {
    const result = await wx.cloud.callFunction({
      name: 'packagekind',
    });
    const reskinds = result.result.result;
    for (let i = 0; i < reskinds.data.length; i += 1) {
      this.globalData.kindArray[i] = reskinds.data[i].kind;
    }
    wx.event.emit('kindArray', this.globalData.kindArray);
  },

  bindMultiPickerColumnChange(e) {
    const data = {
      multiArray: this.globalData.addrInfo.multiArray,
      multiIndex: this.globalData.addrInfo.multiIndex,
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    const { addrInfo } = this.globalData;
    const { allAddrData } = addrInfo;
    const { multiIndex } = addrInfo;
    switch (e.detail.column) {
      case 0:
        // 第一列改变  设置第二列数据
        addrInfo.multiArray[1] = [];
        addrInfo.multiArray[2] = [];

        for (let i = 0; i < allAddrData[multiIndex[0]].floors.length; i += 1) {
          addrInfo.multiArray[1][i] = allAddrData[multiIndex[0]].floors[i].floor;
        }
        for (let i = 0; i < allAddrData[multiIndex[0]].floors[multiIndex[1]].rooms.length; i += 1) {
          const { room } = allAddrData[multiIndex[0]].floors[multiIndex[1]].rooms[i];
          addrInfo.multiArray[2][i] = room;
        }
        break;
      case 1:
        // 第二列改变 设置第三列数据
        addrInfo.multiArray[2] = [];
        for (let i = 0; i < allAddrData[multiIndex[0]].floors[multiIndex[1]].rooms.length; i += 1) {
          const { room } = allAddrData[multiIndex[0]].floors[multiIndex[1]].rooms[i];
          addrInfo.multiArray[2][i] = room;
        }
        break;
      case 2:
        addrInfo.multiArray = data.multiArray;
        break;
      default:
        break;
    }
    wx.event.emit('addrInfo', this.globalData.addrInfo);
  },
  bindMultiPickerChange(e) {
    const { addrInfo } = this.globalData;
    addrInfo.multiIndex = e.detail.value;
    addrInfo.mybuilding = addrInfo.multiArray[0][addrInfo.multiIndex[0]];
    addrInfo.myfloor = addrInfo.multiArray[1][addrInfo.multiIndex[1]];
    addrInfo.myroom = addrInfo.multiArray[2][addrInfo.multiIndex[2]];
    wx.event.emit('addrInfo', this.globalData.addrInfo);
  },
  UpdataAddr() {
    this.globalData.userInfo.addr[0] = this.globalData.addrInfo.mybuilding;
    this.globalData.userInfo.addr[1] = this.globalData.addrInfo.myfloor;
    this.globalData.userInfo.addr[2] = this.globalData.addrInfo.myroom;
    wx.event.emit('userInfo', this.globalData.userInfo);
  },

  async Register(data) {
    wx.showLoading({
      mask: true,
    });
    let result = await wx.cloud.callFunction({
      name: 'register',
      data,
    });
    result = result.result;
    if (result.error === null) {
      this.LoadInfo();
    } else {
      wx.showToast({
        title: result.error,
        icon: 'error',
      });
    }
  },

  async LoadInfo() {
    let result = await wx.cloud.callFunction({
      name: 'userinfo',
    });
    result = result.result;

    if (result.hasUserInfo) {
      this.globalData.userInfo = result.userInfo;
      this.globalData.loginDisplay = 'none';
      wx.event.emit('userInfo', result.userInfo);
    } else {
      this.globalData.loginDisplay = 'flex';
    }
    wx.event.emit('loginDisplay', this.globalData.loginDisplay);

    wx.hideLoading();
  },

  onLaunch() {
    if (!wx.cloud) {
      // eslint-disable-next-line no-console
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-9g3jxgcr2ffa5389',
        traceUser: true,
      });
    }

    this.LoadInfo();
    this.AddrInit();
    this.PackInit();
    this.KindInit();
  },
});
