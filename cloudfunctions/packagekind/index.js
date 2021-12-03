// 云函数入口文件
const cloud = require('wx-server-sdk');

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

  const db = cloud.database();
  const addr = db.collection('packagekind');
  const resAddr = await addr.get();

  return {
    result: resAddr,
  };
};
