// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if (!cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力');
  } else {
    cloud.init({
      env: 'cloud1-9g3jxgcr2ffa5389',
    });
  }

  const wxContext = cloud.getWXContext()

  const db = cloud.database();
  const result = {};
  let user_list = await db.collection('userlist').where({
    openid: wxContext.OPENID
  }).get({});

  if (user_list.data.length == 0) {
    result.hasUserInfo = false;
  } else {
    result.hasUserInfo = true;
    result.userInfo = user_list.data[0];
  }

  return result;
}