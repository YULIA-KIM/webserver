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
  const { user_id, user_password } = req.body;

  const bverifyUser = (username, password) => {
     User.findOne({
       where: {userID: username, password: password }
     }).then(function(result){
       if(result){
         const signToken = jwt.sign({userID: username, password: password}, SECRET, { expiresIn: EXPIRES })
         console.log(signToken);

         //res.json({ token: signToken });//이게 로컬에 저장한거야?? 일단 화면에 토큰정보가 보이긴 한다.
         res.render('loginOk',{ token: signToken });
     }else{
         console.log("아이디 존재안해")
       };
     })
   };

    bverifyUser( user_id, user_password );
  });

  //인증
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

        User.findOne({
          where: {
            userID: decoded.userID
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

  const { user_id, user_password } = req.body;


  const bfindOneByUsername = (username, password) => {
     User.findOne({
       where: {userID: username}
     }).then(function(result){
       if(result){
         console.log("중복아이디있다");
         res.redirect("/signup/1");//이건 변수를 뒤에 보내면서 url주소로 창 이동하나봥 render는 그냥 뷰 화면을 보여주는 거고
     }else{
       //console.log("중복아이디없다");
       User.create({ userID: username, password: password }).then(function(result){
         //res.json(result);
         res.render('signUpOk');
       });
     }
     })
  };

  bfindOneByUsername( user_id, user_password );

});

module.exports = router;
