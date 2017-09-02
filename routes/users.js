var model = require('../models/Model');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//로그인 창
router.get('/login/:success', function(req, res, next) {
  var test = {"success":req.params.success};

  res.render('login',test);
});

//로그인 완료창
router.post('/loginOk', function(req, res, next) {
  const { userId, password } = req.body;

  const bverifyUser = (userId, password) => {
     model.User.findOne({
       where: {userID: userId, password: password }
     }).then(function(result){
       if(result){
         const token = jwt.sign({userID: userId, password: password}, SECRET, { expiresIn: EXPIRES })
         console.log(token);

         res.json({ token: token });//이게 로컬에 저장한거야?? 일단 화면에 토큰정보가 보이긴 한다.
         //res.render('loginOk',{ token: token });
     }else{
         console.log("아이디 존재안해");
       };
     })
   };

    bverifyUser( userId, password );
  });

  //인증 이부분은 다른 페이지를 요청할때 모두 시행되어야 하는부분// 인증을 한뒤 페이지 결과를 보여줘야한다.
  function check(req, res){
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.params.token

    console.log(token);

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    var decoded = jwt.verify(token, SECRET);
          console.log(decoded);

        model.User.findOne({
          where: {
            userId: decoded.userID //어떻게 받아오는지 확인해야한다
          }
        }).then(function(user){
          console.log(user);
          if(!user){
            console.log("권한이 없습니다.");
          }else {
            res.status(200).json({
              success: true
            })
          }
        });
  }



//회원가입 창
router.get('/signUp/:success', function(req, res, next) {
  var test = {"success":req.params.success}
  res.render('signUp',test);
});

//회원가입 완료창
router.post('/signUpOk',function(req, res, next) {
  //res.send('this router is working');

  const { userId, password } = req.body;

     model.User.findOne({
       where: {userId: userId}
     }).then(function(result){
       if(result){
         console.log("중복아이디있다");
         res.json( { isOK: false } );
         //res.redirect("/signup/1");//이건 변수를 뒤에 보내면서 url주소로 창 이동하나봥 render는 그냥 뷰 화면을 보여주는 거고
     }else{
       //console.log("중복아이디없다");
       model.User.create({ userId: userId, password: password }).then(function(result){
         console.log("회원가입 완료");
         res.json( { isOK: true } );
         //res.render('signUpOk');
       });
     }
   });
});

module.exports = router;
