// pages/index/index.js

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
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
            defaultaddr: ["", "", ""],
            name: "",
            qq: "",
            registerTime: null,
            student_id: null,
            phone: null
        }
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

    Register(e) {
        let values = e.detail.value;
        values.addr[0] = this.data.addrInfo.multiArray[0][values.addr[0]];
        values.addr[1] = this.data.addrInfo.multiArray[1][values.addr[1]];
        values.addr[2] = this.data.addrInfo.multiArray[2][values.addr[2]];
        app.Register(values);
    },

    // 从 app 页面同步数据
    DataSync: function () {
        this.setData({
            loginDisplay: app.globalData.loginDisplay,
            addrInfo: app.globalData.addrInfo,
            hasUserInfo: app.globalData.hasUserInfo,
            userInfo: app.globalData.userInfo,
        })

        // 处理异步问题
        if (this.data.userInfo.openid == "") {
            setTimeout(this.DataSync, 200);
            return;
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.DataSync();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})