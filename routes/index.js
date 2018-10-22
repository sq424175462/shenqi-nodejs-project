var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' ,nickname:'nickname',isAdmin:'isAdmin'});
// });
//首页
router.get('/',function (req,res,next) {
   console.log('返回是否进来');
   if(req.cookies.username){
     res.render('index',{
       username:req.cookies.username,
       nickname:req.cookies.nickname,
       isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' :''

     })

   }else{
     res.redirect('/login.html');
   }
})
router.get('/register.html',function(req,res){
      // console.log(1)
      res.render('register');
       
})
router.get('/login.html', function (req, res) {
  // console.log(1)
  res.render('login');

})
module.exports = router;
