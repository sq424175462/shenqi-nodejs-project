var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/register',function (req,res,next){ 
  // console.log(1);
  // res.render('myerror',{Num:1,msg:'用户名必须是3到8位'});
  var userReg=/^\w{3,8}$/;
  var pwdReg=/^\S{3,8}$/;
  if(!userReg.test(req.body.username)){
    res.render('myerror',{
      code: 1,
      msg: '用户名必须是3到8位,请您重新输入!'
    });
    res.send();
  }
});




module.exports = router;
