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
    this.data.receiveList[i].announceMonth = orderlist[i].announceTime.getMonth() + 1;
    this.data.receiveList[i].announceDay = orderlist[i].announceTime.getDate();
    this.data.receiveList[i].announceHour = (orderlist[i].announceTime.getHours() < 10) ? `0${orderlist[i].announceTime.getHours()}` : orderlist[i].announceTime.getHours();
    this.data.receiveList[i].announceMinutes = (orderlist[i].announceTime.getMinutes() < 10) ? `0${orderlist[i].announceTime.getMinutes()}` : orderlist[i].announceTime.getMinutes();
    if (orderlist[i].receiveTime != null) {
      this.data.receiveList[i].receiveMonth = orderlist[i].receiveTime.getMonth() + 1;
      this.data.receiveList[i].receiveDay = orderlist[i].receiveTime.getDate();
      this.data.receiveList[i].receiveHour = (orderlist[i].receiveTime.getHours() < 10) ? `0${orderlist[i].receiveTime.getHours()}` : orderlist[i].receiveTime.getHours();
      this.data.receiveList[i].receiveMinutes = (orderlist[i].receiveTime.getMinutes() < 10) ? `0${orderlist[i].receiveTime.getMinutes()}` : orderlist[i].receiveTime.getMinutes();
    }
    if (orderlist[i].canceledTime != null) {
      this.data.receiveList[i].canceledMonth = orderlist[i].canceledTime.getMonth() + 1;
      this.data.receiveList[i].canceledDay = orderlist[i].canceledTime.getDate();
      this.data.receiveList[i].canceledHour = (orderlist[i].canceledTime.getHours() < 10) ? `0${orderlist[i].canceledTime.getHours()}` : orderlist[i].canceledTime.getHours();
      this.data.receiveList[i].canceledMinutes = (orderlist[i].canceledTime.getMinutes() < 10) ? `0${orderlist[i].canceledTime.getMinutes()}` : orderlist[i].canceledTime.getMinutes();
    }
    if (orderlist[i].deliveriedTime != null) {
      this.data.receiveList[i].deliveriedMonth = orderlist[i].deliveriedTime.getMonth() + 1;
      this.data.receiveList[i].deliveriedDay = orderlist[i].deliveriedTime.getDate();
      this.data.receiveList[i].deliveriedHour = (orderlist[i].deliveriedTime.getHours() < 10) ? `0${orderlist[i].deliveriedTime.getHours()}` : orderlist[i].deliveriedTime.getHours();
      this.data.receiveList[i].deliveriedMinutes = (orderlist[i].deliveriedTime.getMinutes() < 10) ? `0${orderlist[i].deliveriedTime.getMinutes()}` : orderlist[i].deliveriedTime.getMinutes();
    }
  }
  return {
    orderlist,
  };
};
