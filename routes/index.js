var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel.js');

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
//注册
router.get('/register.html',function(req,res){
      // console.log(1)
      res.render('register');
       
})
// 登陆
router.get('/login.html', function (req, res) {
  // console.log(1)
  res.render('login');

})

//用户管理页面

router.get('/user_manager.html',function (req,res) {
  // console.log(req.query)
    //判断是都登陆，还要判断是都是管理员
    if(req.cookies.username && parseInt(req.cookies.isAdmin)){
      let page = req.query.page ||1;//页码
      // console.log(page)
      let pageSize = req.query.pageSize ||5;//每页的条数
      // console.log(pageSize)
      userModel.getUserList({
        page:page,
        pageSize:pageSize
      },function (err,data) {
          if(err){
             res.render(myerror,err);
          }else{
            console.log(data)

            res.render('user_manager',{

              username:req.cookies.username,
              nickname:req.cookies.nickname,
              isAdmin:parseInt(req.cookies.isAdmin)?'(管理员)':'',
              userList:data.userList,
              totalPage:data.totalPage,
              page:data.page
            })
          }        
      })
    }else{
      res.redirect('/login.html');
    }
})







module.exports = router;
