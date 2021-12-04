// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  let error = null;
  const data = {};
  data[event.type] = event[event.type];

  await db.collection('userlist').where({
    openid: wxContext.OPENID,
  }).update({
    data,
    fail() {
      error = '修改失败';
    },
  });
  return {
    error,
  };
};
