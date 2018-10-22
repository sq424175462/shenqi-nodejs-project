const  MongoClient = require('mongodb').MongoClient;
const url = 'mongodb"//127.0.0.1:27017';
MongoClient.connect(url,function (err,client) {
    const db = client.db('shenqi');
    db.collection('user').find();
})