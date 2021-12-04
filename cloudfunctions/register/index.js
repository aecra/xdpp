// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  let error = null;
  const namePatt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  const studentIdPatt = /^(17|18|19|20)[0-9]{9}$/;
  const phonePatt = /^1([35689][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
  const qqPatt = /^[1-9][0-9]{4,13}$/;

  if (!namePatt.test(event.name)) {
    error = '请正确输入姓名';
  } else if (!studentIdPatt.test(event.student_id)) {
    error = '请正确输入学号';
  } else if (!phonePatt.test(Number(event.phone))) {
    error = '请正确输入手机号';
  } else if (!qqPatt.test(event.qq)) {
    error = '请正确输入QQ号';
  }

  if (error !== null) {
    const wxContext = cloud.getWXContext();
    const db = cloud.database();
    await db.collection('userlist').add({
      data: {
        openid: wxContext.OPENID,
        registerTime: new Date(),
        name: event.name,
        phone: event.phone,
        qq: event.qq,
        student_id: event.student_id,
        defaultaddr: [event.addr[0], event.addr[1], event.addr[2]],
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
