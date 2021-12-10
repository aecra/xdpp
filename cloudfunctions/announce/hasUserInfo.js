const cloud = require('wx-server-sdk');

async function hasUserInfo(openid) {
  const db = cloud.database();
  const userList = await db
    .collection('userlist')
    .where({
      openid,
    })
    .get({});

  if (userList.data.length === 0) {
    return false;
  }
  return true;
}

module.exports = hasUserInfo;
