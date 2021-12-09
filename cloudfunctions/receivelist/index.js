// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const order = db.collection('orderlist');
  const { data: orderlist } = await order.where({
    receiver: wxContext.OPENID,
  })
    .orderBy('receiveTime', 'desc')
    .skip(event.start)
    .limit(event.limit)
    .get();

  for (let i = 0; i < orderlist.length; i += 1) {
    orderlist[i].announceMonth = orderlist[i].announceTime.getMonth() + 1;
    orderlist[i].announceDay = orderlist[i].announceTime.getDate();
    orderlist[i].announceHour = (orderlist[i].announceTime.getHours() < 10) ? `0${orderlist[i].announceTime.getHours()}` : orderlist[i].announceTime.getHours();
    orderlist[i].announceMinutes = (orderlist[i].announceTime.getMinutes() < 10) ? `0${orderlist[i].announceTime.getMinutes()}` : orderlist[i].announceTime.getMinutes();
    if (orderlist[i].receiveTime != null) {
      orderlist[i].receiveMonth = orderlist[i].receiveTime.getMonth() + 1;
      orderlist[i].receiveDay = orderlist[i].receiveTime.getDate();
      orderlist[i].receiveHour = (orderlist[i].receiveTime.getHours() < 10) ? `0${orderlist[i].receiveTime.getHours()}` : orderlist[i].receiveTime.getHours();
      orderlist[i].receiveMinutes = (orderlist[i].receiveTime.getMinutes() < 10) ? `0${orderlist[i].receiveTime.getMinutes()}` : orderlist[i].receiveTime.getMinutes();
    }
    if (orderlist[i].canceledTime != null) {
      orderlist[i].canceledMonth = orderlist[i].canceledTime.getMonth() + 1;
      orderlist[i].canceledDay = orderlist[i].canceledTime.getDate();
      orderlist[i].canceledHour = (orderlist[i].canceledTime.getHours() < 10) ? `0${orderlist[i].canceledTime.getHours()}` : orderlist[i].canceledTime.getHours();
      orderlist[i].canceledMinutes = (orderlist[i].canceledTime.getMinutes() < 10) ? `0${orderlist[i].canceledTime.getMinutes()}` : orderlist[i].canceledTime.getMinutes();
    }
    if (orderlist[i].deliveriedTime != null) {
      orderlist[i].deliveriedMonth = orderlist[i].deliveriedTime.getMonth() + 1;
      orderlist[i].deliveriedDay = orderlist[i].deliveriedTime.getDate();
      orderlist[i].deliveriedHour = (orderlist[i].deliveriedTime.getHours() < 10) ? `0${orderlist[i].deliveriedTime.getHours()}` : orderlist[i].deliveriedTime.getHours();
      orderlist[i].deliveriedMinutes = (orderlist[i].deliveriedTime.getMinutes() < 10) ? `0${orderlist[i].deliveriedTime.getMinutes()}` : orderlist[i].deliveriedTime.getMinutes();
    }
  }
  return {
    orderlist,
  };
};
