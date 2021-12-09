// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();

  const db = cloud.database();
  const result = {};
  const userList = await db
    .collection('userlist')
    .where({
      openid: event.OPENID || wxContext.OPENID,
    })
    .get({});

  if (userList.data.length === 0) {
    result.hasUserInfo = false;
  } else {
    result.hasUserInfo = true;
    // eslint-disable-next-line prefer-destructuring
    result.userInfo = userList.data[0];
  }

  return result;
};
