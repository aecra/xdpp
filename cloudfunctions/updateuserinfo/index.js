// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  let error = null;
  const data = {};
  data[event.type] = event[event.type];
  const namePatt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  const studentIdPatt = /^(17|18|19|20)[0-9]{9}$/;
  const phonePatt = /^1([35689][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
  const emailPatt = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

  if (event.type === 'name' && !namePatt.test(event.name)) {
    error = '请正确输入姓名';
  } else if (event.type === 'studentid' && !studentIdPatt.test(event.studentid)) {
    error = '请正确输入学号';
  } else if (event.type === 'phone' && !phonePatt.test(Number(event.phone))) {
    error = '正确输入后四位';
  } else if (event.type === 'email' && !emailPatt.test(event.email)) {
    error = '请正确输入邮箱';
  }

  if (error === null) {
    await db.collection('userlist').where({
      openid: wxContext.OPENID,
    }).update({
      data,
      fail() {
        error = '修改失败';
      },
    });
  }
  return {
    error,
  };
};
