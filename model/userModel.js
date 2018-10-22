//首先引入mongodb 这个模板用来操作user 相关的后台数据库处理
const MongoClient = require('mongodb').MongoClient;
//定义url地址
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');
//定义一个对象
const userModel = {
    //创建一个add方法
    /**
    **注册操作
    *@para{data}注册信息 的对象
    *@para{cb}* 回调函数
    ***/
    add: function (data, cb) {
        //连接url 地址
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({
                    code: -100,
                    msg: '数据库连接失败'
                })
                return;
                //因为没有连接成功，所以不需要关闭
            }
            //选择数据库
            const db = client.db('shenqi');
            //
            let saveData = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                iphone: data.phone,
                is_admin: data.isAdmin
            }
            //选择集合并操作
            async.series([
                function (callback) {
                    //查询是否注册过了
                    db.collection('user').find({ username: saveData.username }).count(function (err, num) {
                        if (err) {
                            callback({ code: 101, msg: '查询注册是否失败' });
                        } else if (num != 0) {
                            callback({ code: 102, msg: '用户已经注册过了' });
                            console.log('用户已经注册过了');
                        } else {
                            callback(null);
                            console.log('可以注册');
                        }
                    });
                },
                function (callback) {
                    //查询注册了多少条
                    db.collection('user').find().count(function (err, num) {
                        if (err) {
                            callback({ code:101,msg: '查询注册总条数失败' });
                        } else {
                            saveData._id = num + 1;
                            callback(null);
                        }

                    })
                },
                function (callback) {
                    //写入数据库
                    db.collection('user').insertOne(saveData, function (err) {
                        if (err) {
                            callback({code: 101,msg :'写入数据库失败' });
                        } else {
                            callback(null);
                            console.log('写入成功');
                        }
                    })
                }
            ], function (err, results) {
                if (err) {
                    cb(err);
                } else {
                    cb(null);
                }
                client.close();
            })
        })

    },
    /**
     * *
     * *
     * *@para{data}登录信息  对象{username:''
     *                               password:''}
     * *@para{cb} 回调函数   cb
     * ***
     * 
     * 
     * */
    login:function (data,cb) {
        MongoClient.connect(url,function (err,client) {
            if(err){
                console.log('连接数据库失败');
                cb({code:101,msg:'连接数据库失败'})
            }else{
                const db = client.db('shenqi');
                db.collection('user').find({
                    username:data.username,
                    password:data.password
                }).toArray(function (err,data) {
                    if(err){
                        console.log('查询数据库失败',err);
                        cb({code:101,msg:err});
                        client.close();
                    }else if(data.length<=0){
                        //没有找到相应的用户名就不能登录
                        console.log('用户不能登录,账号密码错误');
                        cb({code:102,msg:'用户名或者密码不对'});

                    }else{
                        console.log('可以登录');
                        cb(null,{
                            username:data[0].username,
                            nickname:data[0].nickname,
                            isAdmin:data[0].is_admin
                        })
                    }
                    client.close();
                })
            }

        })
    }




}
module.exports = userModel;

