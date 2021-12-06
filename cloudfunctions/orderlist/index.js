// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const _ = db.command;
  const order = db.collection('orderlist');
  let orderlist = await order.orderBy('announceTime', 'desc')
    .where({
      canceled: false,
      deliveried: false,
      receiver: null,
      announcer: _.neq(wxContext.OPENID),
      package: {
        moveTo: _.and(_.in(event.searchAim.buildings), _.in(event.searchAim.floors)),
        kind: _.in(event.searchAim.kinds),
        getPack: _.in(event.searchAim.packageaddr),
      },
    })
    .skip(event.start)
    .limit(event.limit)
    .get();
  orderlist = orderlist.data;

  for (let i = 0; i < orderlist.length; i += 1) {
    orderlist[i].month = orderlist[i].announceTime.getMonth() + 1;
    orderlist[i].day = orderlist[i].announceTime.getDate();
    orderlist[i].hour = (orderlist[i].announceTime.getHours() < 10) ? `0${orderlist[i].announceTime.getHours()}` : orderlist[i].announceTime.getHours();
    orderlist[i].minutes = (orderlist[i].announceTime.getMinutes() < 10) ? `0${orderlist[i].announceTime.getMinutes()}` : orderlist[i].announceTime.getMinutes();
  }
  return {
    orderlist,
  };
};
