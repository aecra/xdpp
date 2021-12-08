// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  let error = null;
  const namePatt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  const studentIdPatt = /^(17|18|19|20)[0-9]{9}$/;
  const phonePatt = /^[0-9]{4}$/;
  const emailPatt = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

  if (!namePatt.test(event.name)) {
    error = '请正确输入姓名';
  } else if (!studentIdPatt.test(event.studentid)) {
    error = '请正确输入学号';
  } else if (!phonePatt.test(Number(event.phone))) {
    error = '正确输入后四位';
  } else if (!emailPatt.test(event.email)) {
    error = '请正确输入邮箱';
  }

  if (error == null) {
    const wxContext = cloud.getWXContext();
    const db = cloud.database();
    await db.collection('userlist').add({
      data: {
        openid: wxContext.OPENID,
        registerTime: new Date(),
        name: event.name,
        phone: event.phone,
        email: event.email,
        studentid: event.studentid,
        addr: [event.addr[0], event.addr[1], event.addr[2]],
      },
      fail() {
        error = '注册失败';
      },
    });
  }

  return {
    error,
  };
};
