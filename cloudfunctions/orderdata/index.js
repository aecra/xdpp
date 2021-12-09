// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async () => {
  const db = cloud.database();
  const _ = db.command;
  const orderlist = db.collection('orderlist');
  const data = {};
  let result = await orderlist.aggregate()
    .count('package')
    .end();
  data.announce = result.list.length ? result.list[0].package : 0;
  result = await orderlist.aggregate()
    .match({
      canceled: true,
    })
    .count('package')
    .end();
  data.canceled = result.list.length ? result.list[0].package : 0;
  result = await orderlist.aggregate()
    .match({
      receiver: _.neq(null),
      deliverid: null,
    })
    .count('package')
    .end();
  data.received = result.list.length ? result.list[0].package : 0;
  result = await orderlist.aggregate()
    .match({
      deliverid: true,
    })
    .count('package')
    .end();
  data.deliveried = result.list.length ? result.list[0].package : 0;
  return {
    data,
  };
};
