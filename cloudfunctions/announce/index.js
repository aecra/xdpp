// 云函数入口文件
const cloud = require('wx-server-sdk');
const hasUserInfo = require('./hasUserInfo');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  if (!hasUserInfo(cloud.getWXContext().OPENID)) {
    return { error: '该用户不存在' };
  }

  let error = null;
  const namePatt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  const pickupNumberPatt = /^[0-9]{4}$/;

  if (event.pickupCode === '') {
    error = '请输入取货码';
  } else if (!namePatt.test(event.pickupReceiver)) {
    error = '请正确输入姓名';
  } else if (!pickupNumberPatt.test(event.pickupNumber)) {
    error = '正确输入后四位';
  } else if (event.reward === '') {
    error = '请输入酬劳';
  }

  if (error) {
    return { error };
  }

  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  await db.collection('orderlist').add({
    data: {
      announcer: wxContext.OPENID,
      announceTime: new Date(),
      receiver: null,
      receiveTime: null,
      deliveried: false,
      deliveriedTime: null,
      canceled: false,
      canceledTime: null,
      package: {
        getPack: event.getPack,
        pickupCode: event.pickupCode,
        kind: event.kind,
        pickupReceiver: event.pickupReceiver,
        pickupNumber: event.pickupNumber,
        moveTo: [
          event.moveTo[0],
          event.moveTo[1],
          event.moveTo[2],
        ],
        reward: event.reward,
        remarks: event.remarks,
      },
    },
    success() {
      wx.showToast({
        title: '发布成功',
      });
    },
    fail() {
      error = '注册失败';
    },
  });

  return {
    error,
  };
};
