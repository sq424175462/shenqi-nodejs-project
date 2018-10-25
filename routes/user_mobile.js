var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var url = 'mongodb://127.0.0.1:27017';
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var upload = multer({ dest: 'C:/tmp' });



router.post('/add', upload.single('iphoneImg'), function (req, res) {
    console.log(req.file)
    fs.readFile(req.file.path, function (err, fileData) {
        if (err) {
            console.log('读取失败');
            res.send({ code: 1, mgs: '新增失败' });
        } else {
            var fileName = new Date().getTime() + '_' + req.file.originalname;
            var dest_path = path.resolve(__dirname, '../public/iphoneImg/', fileName);
            fs.writeFile(dest_path, fileData, function (err) {
                if (err) {
                    console.log('写入失败');
                    res.send({ code: 1, msg: '新增手机失败' });
                } else {
                    MongoClient.connect(url, function (err, client) {
                        if (err) {
                            console.log('连接数据库失败');
                            res.send({ code: 1, msg: '新增手机失败' });
                        } else {
                            var db = client.db('shenqi');
                            var saveDate = req.body;
                            console.log(saveDate)
                            // console.log(9999900000)
                            saveDate.fileName = fileName;
                            async.series([
                                function (callback) {
                                    db.collection('iphone').find().toArray(function (err, arr) {
                                        if (err) {
                                            console.log('插入数据库失败');
                                            callback(err,{ code: 1, msg: '新增手机失败' });
                                        } else {
                                            console.log('ok');
                                            saveDate._id = arr.length >0? arr[arr.length - 1]._id + 1 : 1;
                                            callback(null);
                                        }

                                    })
                                },
                                function (callback) {
                                    db.collection('iphone').insertOne(saveDate, function (err) {
                                        if (err) {
                                            console.log('插入数据库失败');
                                            callback(err,{ code: 1, msg: '新增手机失败' });
                                        } else {
                                            console.log('ok');
                                            callback(null,{ code: 0, msg: 'ok' });
                                        }

                                    })
                                }
                               
                            ], function (err, result) {
                                if (err) {
                                    res.send(result);
                                } else {
                                    res.send(result);
                                }
                                client.close();

                            })

                        }

                    })
                }
            })

        }
    })

})

//修改

router.post('/updata', upload.single('iphoneImg'), function (req, res) {
    console.log(req.body)
    console.log(11111111111111111111111111111122222222)
    console.log('------------------------')
    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log('连接数据库失败');
            res.send({ code: 1, msg: '修改手机失败' });
        } else {
            var db = client.db('shenqi');
            var saveDate = req.body;
            console.log(saveDate)
            console.log(8988989898989)
            // saveDate.fileName = fileName;
            var upData = {
                iphoneBrand: saveDate.iphoneBrand,
                iphoneName: saveDate.iphoneName,
                priceG: saveDate.priceG,
                priceE: saveDate.priceE,
                _id: saveDate.ID
                // fileName: saveDate.fileName
            };
            console.log(upData);
            console.log(90909090909090)
            var id = parseInt(saveDate.ID)
            db.collection('iphone').updateOne({ _id: id }, {
                $set: {
                    iphoneBrand: upData.iphoneBrand,
                    iphoneName: upData.iphoneName,
                    priceG: upData.priceG,
                    priceE: upData.priceE             
                    // fileName: upData.fileName
                }
            }, function (err) {
                if (err) {
                    console.log('修改数据库失败');
                    res.send({ code: 1, msg: '修改手机失败' });
                } else {
                    console.log('ok');
                    
                    res.send({ code: 0, msg: 'ok' });
                }
                client.close();

            })
        }

    })


})

//删除
router.post('/delete',function (req,res) {
    // console.log(req.body.myID);
    // console.log(222222222222)
    var id =parseInt(req.body.myID);
    MongoClient.connect(url,function (err,client) {
        if(err){
            console.log('连接数据失败');
            res.send({ code: 1, msg: '查询失败' });

        }else{
            var db = client.db('shenqi');
            db.collection('iphone').remove({_id:id},function (err) {
                if(err){
                    res.send({code:1,msg:'修改失败'});
                }else{
                    res.send({code:0,msg:'修改成功'});
                }
                client.close();
                
            })
        }
    })
})
//获取列表
router.get('/list', function (req, res) {
    //     console.log(121312412425235)
    //    console.log(req.query)
    var page = parseInt(req.query.page);
    var pageSize = parseInt(req.query.pageSize);
    var totalPage = 0;
    var _id = parseInt(req.query_id);
    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log('数据库连接失败');
            res.send({ code: 1, msg: '获取列表失败' });
        } else {
            var db = client.db('shenqi');
            async.series([
                function (callback) {
                    db.collection('iphone').find().count(function (err, num) {
                        if (err) {
                            callback({ code: 1, msg: 'error' })
                        } else {
                            totalPage = Math.ceil(num / pageSize);
                            callback(null);
                        }
                    })
                },
                function (callback) {
                    db.collection('iphone').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function (err, arr) {
                        if (err) {
                            callback({ code: 1, msg: '查询失败' })
                        } else {
                            callback(null, arr);
                        }
                    })
                }

            ], function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        code: 0, msg: 'ok', data: {
                            list: result[1],
                            totalPage: totalPage
                        }
                    });
                }
                client.close();
            })
        }
    })
})






































module.exports = router;
