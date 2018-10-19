var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register',function(req,res){
      // console.log(1)
      res.render('register');
      
 
})
router.get('/login', function (req, res) {
  // console.log(1)
  res.render('login');

})
module.exports = router;
