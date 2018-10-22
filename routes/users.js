var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册的路由

router.post('/register', function (req, res, next) {
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
      res.redirect('/login');
    }

  })
});
//登录的路由




module.exports = router;
