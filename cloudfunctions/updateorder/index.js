// 云函数入口文件
const cloud = require('wx-server-sdk');
const hasUserInfo = require('./hasUserInfo');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  let error = null;
  if (!hasUserInfo(wxContext.OPENID)) {
    return { error: '该用户不存在' };
  }

  switch (event.kind) {
    case 'cancel':
      await db.collection('orderlist').where({
        // eslint-disable-next-line no-underscore-dangle
        _id: event._id,
      }).update({
        data: {
          canceled: true,
          canceledTime: new Date(),
        },
        fail() {
          error = '操作失败';
        },
      });
      break;
    case 'confirm':
      await db.collection('orderlist').where({
        // eslint-disable-next-line no-underscore-dangle
        _id: event._id,
      }).update({
        data: {
          deliveried: true,
          deliveriedTime: new Date(),
        },
        fail() {
          error = '操作失败';
        },
      });
      break;
    case 'receive': {
      const order = await db.collection('orderlist').where({
        // eslint-disable-next-line no-underscore-dangle
        _id: event._id,
      }).get();
      if (order.data[0].receiver) {
        error = '订单已无';
        break;
      }
      db.collection('orderlist').where({
        // eslint-disable-next-line no-underscore-dangle
        _id: event._id,
      }).update({
        data: {
          receiver: wxContext.OPENID,
          receiveTime: new Date(),
        },
        fail() {
          error = '操作失败';
        },
      });
      break;
    }
    default:
      error = '未知请求';
  }

  return {
    error,
  };
};
