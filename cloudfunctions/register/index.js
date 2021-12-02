// 云函数入口文件
const cloud = require('wx-server-sdk')

// 云函数入口函数
exports.main = async (event, context) => {
  if (!cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力');
  } else {
    cloud.init({
      env: 'cloud1-9g3jxgcr2ffa5389',
    });
  }

  let error = null;
  let name_patt = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
  let student_id_patt = /^(17|18|19|20)[0-9]{9}$/
  let phone_patt = /^1([35689][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  let qq_patt = /^[1-9][0-9]{4,13}$/

  if (!name_patt.test(event.name)) {
    error = "请正确输入姓名";
  } else if (!student_id_patt.test(event.student_id)) {
    error = "请正确输入学号";
  } else if (!phone_patt.test(Number(event.phone))) {
    error = "请正确输入手机号";
  } else if (!qq_patt.test(event.qq)) {
    error = "请正确输入QQ号";
  }

  if (error !== null) {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    db.collection('userlist').add({
      data: {
        openid: wxContext.OPENID,
        registerTime: new Date(),
        name: event.name,
        phone: event.phone,
        qq: event.qq,
        student_id: event.student_id,
        defaultaddr: [
          event.addr[0],
          event.addr[1],
          event.addr[2]
        ]
      },
      fail: function () {
        error = "注册失败";
      }
    })
  }

  return {
    error
  };
}