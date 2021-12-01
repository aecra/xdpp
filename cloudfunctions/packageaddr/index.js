// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    if (!cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
        cloud.init({
            env: 'cloud1-9g3jxgcr2ffa5389',
        });
    }

    const db = cloud.database();
    const addr = db.collection('packageaddr');
    let resAddr = await addr.get();

    return {
        result: resAddr
    }
}