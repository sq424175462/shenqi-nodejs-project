var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register',function (req,res,next){ 
  // console.log(1);
  // res.render('myerror',{Num:1,msg:'用户名必须是5到10位'});
  var userReg=/^\w{5,11}$/;
  var pwdReg=/^\S{5,10}$/;
  if(!userReg.test(req.body.username)){
    res.render('myerror',{
      code: 1,
      msg: '用户名必须是6到12位,请您重新输入!'
    });
    res.send();
  }
});




module.exports = router;
