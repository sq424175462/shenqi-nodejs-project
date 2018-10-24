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
                is_admin: data.isAdmin,

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
                    db.collection('user').find().toArray(function (err, arr) {
                        // console.log(arr[arr.length - 1]._id);
                        if (err) {
                            callback({ code: 101, msg: '查询注册总条数失败' });
                        } else {
                            saveData._id = arr.length  ?  arr[arr.length - 1]._id + 1   :  1;//?????怎么自增需要解决

                            callback(null);
                        }

                    })
                },
                function (callback) {
                    //写入数据库
                    db.collection('user').insertOne(saveData, function (err) {
                        if (err) {
                            callback({ code: 101, msg: '写入数据库失败' });
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
     * 
     * 
     *  @para{data}登录信息  对象{username:''
     *                               password:''}
     * @para{cb} 回调函数   cb
     * ***
     * 
     * 
     * */
    login: function (data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({ code: 101, msg: '连接数据库失败' })
            } else {
                const db = client.db('shenqi');
                db.collection('user').find({
                    username: data.username,
                    password: data.password
                }).toArray(function (err, data) {
                    if (err) {
                        console.log('查询数据库失败', err);
                        cb({ code: 101, msg: err });
                        client.close();
                    } else if (data.length <= 0) {
                        //没有找到相应的用户名就不能登录
                        console.log('用户不能登录,账号密码错误');
                        cb({ code: 102, msg: '用户名或者密码不对' });

                    } else {
                        console.log('可以登录');
                        cb(null, {
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isAdmin: data[0].is_admin
                        })
                    }
                    client.close();
                })
            }

        })
    },
    getUserList: function (data, cb) {

        // console.log(1111111111111112222)
        // console.log(data);

        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({ code: 100, msg: '连接数据库失败' });
            } else {
                var db = client.db('shenqi');
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    //查询所有数据库
                    function (callback) {
                        // console.log(data.snickname)
                        console.log(22222)
                        if (data.snickname) {
                            var nick = new RegExp(data.snickname);
                            db.collection('user').find({ nickname: nick }).count(function (err, num) {
                                if (err) {
                                    callback({ code: 101, msg: '查询数据库失败' });
                                } else {
                                    callback(null, num);
                                }
                            })
                        } else {
                            db.collection('user').find().count(function (err, num) {
                                if (err) {
                                    callback({ code: 101, msg: '查询数据库失败' });
                                } else {
                                    callback(null, num);
                                }
                            })
                        }

                    },
                    function (callback) {
                        //查询分页的数据
                        if (data.snickname) {
                            var nick = new RegExp(data.snickname);
                            db.collection("user").find({ nickname: nick }).toArray(function (err, data) {
                                if (err) {
                                    callback({ code: 101, msg: '查询失败' });
                                } else {
                                    callback(null, data);
                                    // console.log(data)
                                }
                            })
                        } else {
                            db.collection('user').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                                if (err) {
                                    callback({ code: 101, msg: '查询数据库失败' });

                                } else {
                                    callback(null, data)
                                }
                            })
                        }

                    }
                ],
                    function (err, results) {

                        if (err) {
                            cb(err);
                        } else {
                            cb(null, {
                                totalPage: Math.ceil(results[0] / data.pageSize),
                                userList: results[1],
                                page: data.page
                            })
                        }
                        client.close();
                    })
            }

        })
    },
    //修改操作

    /**
    * 
    * 
    *  @para{data}修改信息  对象
    * @para{cb} 回调函数   cb
    * ***
    * 
    * 
    * */
    updataList: function (udata, cb) {
        // console.log(udata);
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({ code: 101, msg: '连接数据库失败' });
            } else {
                var db = client.db('shenqi');
                let upData = {
                    username: udata.username,
                    nickname: udata.nickname,
                    iphone: udata.iphone,
                    sex: udata.sex,
                    age: udata.age,
                }
                // 、串行无关联
                async.waterfall([
                    function (callback) {
                        db.collection('user').updateOne({ 'username': upData.username }, {
                            '$set': {
                                'nickname': upData.nickname,
                                'iphone': upData.iphone,
                                'sex': upData.sex,
                                'age': upData.age,

                            }
                        }, function (err) {
                            if (err) {
                                console.log('修改失败');
                                callback({ code: 102, msg: err })
                            } else {
                                // console.log('hhhhhhhh, 到这里了没有');
                                callback(null);
                            }
                        })
                    }

                ], function (err, results) {
                    // console.log(results)
                    if (err) {
                        console.log('上面两步可能出了问题');
                        cb(err);
                    } else {
                        cb(null);
                    }
                    client.close();
                })

            }
        })
    },
    deleteList: function (data, cb) {
        // console.log(data)
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: 101, msg: '连接数据库失败' })
                return;
            }
            var db = client.db('shenqi');
            db.collection('user').remove({ _id: data }, function (err) {
                if (err) {
                    cb({ code: 101, msg: '删除失败' });
                    client.close();
                } else {
                    console.log(1111111)
                    console.log('删除成功');
                    cb(null);
                }
                client.close();

            })


        })
    }

}
module.exports = userModel;

