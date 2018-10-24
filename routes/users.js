var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册的路由

router.post('/register', function (req, res) {
  console.log('传过来的信息');
  console.log(req.body);//请求过了 注册上面的注册数据 是个对象
  var userReg = /^\w{3,8}$/;
  //  用户名的正则
  if (!userReg.test(req.body.username)) {
    res.render('myerror', {
      code: 1,
      msg: '用户名必须是3到8位,请您重新输入!'
    });
    console.log('用户名必须是3到8位,请您重新输入!');
    //  return;
    // res.send();
  }
  //密码的正则
  var pwdReg = /^\S{3,8}$/;
  if (!pwdReg.test(req.body.password)) {
    res.render('myerror', {
      code: 2,
      msg: '密码必须是3到8位,请您重新输入!'
    })
    console.log('密码必须是3到8位,请您重新输入!');
  }
  userModel.add(req.body, function (err) {
    if (err) {
      //如果有错，就直接将错误信息渲染到页面
      res.render('myerror', err);
    } else {
      //注册成功跳转页面；
      res.redirect('/login.html');
    }

  })
});
//登录的路由
router.post('/login', function (req, res) {
  // console.log(req.body)
  console.log(11111111111);
  userModel.login(req.body, function (err, data) {
    if (err) {
      res.render('myerror', err);
    } else {
      //跳转到首页
      console.log('当前用户登录信息是', data);
      res.cookie('username', data.username, {
        maxAge: 1000 * 60 * 10000000
      })
      res.cookie('nickname', data.nickname, {
        maxAge: 1000 * 60 * 10000000
      })
      res.cookie('isAdmin', data.isAdmin, {
        maxAge: 1000 * 60 * 10000000
      })
      res.redirect('/');
    }
  })
})
//退出的路由
router.get('/out', function (req, res) {
  //此时要清除cookie  跳转到登陆页面
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');
  res.send('<script>location.replace("/")</script>');
})

//修改的路由
router.post('/user_manager', function (req, res) {

  console.log('======================');
  userModel.updataList(req.body, function (err) {
 
    if (err) {
      res.render('myerror', err);
    } else {
        res.redirect('/user_manager.html?')

    }
  })
})
//删除的路由
router.get('/delete', function (req, res) {
  userModel.deleteList(parseInt(req.query._id), function (err) {
    if (err) {
      res.render('myerror', err)
    } else {
      res.send('<script>location.replace("/user_manager.html")</script>');
    }
  })
})

module.exports = router;
