// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async () => {
  if (!cloud) {
    // eslint-disable-next-line no-console
    console.error('请使用 2.2.3 或以上的基础库以使用云能力');
  } else {
    cloud.init({
      env: 'cloud1-9g3jxgcr2ffa5389',
    });
  }

  const wxContext = cloud.getWXContext();

  const db = cloud.database();
  const result = {};
  const userList = await db
    .collection('userlist')
    .where({
      openid: wxContext.OPENID,
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
