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
                            saveDate.fileName = fileName;
                            db.collection('iphone').insertOne(saveDate, function (err) {
                                if (err) {
                                    console.log('插入数据库失败');
                                    res.send({ code: 1, msg: '新增手机失败' });
                                } else {
                                    console.log('ok');
                                    res.send({ code: 0, msg: 'ok' });
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
router.get('/list', function (req, res) {
    console.log(121312412425235)

    var page = parseInt(req.query.page);
    var pageSize = parseInt(req.query.pageSize);
    var totalPage = 0;
    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log('数据库连接失败');
            res.send({ code: 1, msg: '获取列表失败' });
        } else {
            var db = client.db('shenqi');
            async.parallel([
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
                    res.send({ code: 0, msg: 'ok' , data:{
                        list: result[1],
                        totalPage: totalPage
                     } });
                }
                client.close();
            })
        }
    })
})






































module.exports = router;
