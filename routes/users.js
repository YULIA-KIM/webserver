const model = require('../models/Model');
const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET = 'AdeFESddfTg765JhhgIu';
const EXPIRES = 3 * 60 * 60;
const router = express.Router();

//로그인
router.post('/loginOk', function (req, res, next) {
  let password = req.body.password.toString();
  let userId = req.body.userId.toString();

  const bverifyUser = (userId, password) => {
    model.User.findOne({
      where: { userID: userId, password: password }
    }).then(function (result) {
      if (result) {
        const token = jwt.sign({ userID: userId, password: password }, SECRET, { expiresIn: EXPIRES });
        console.log(token);
        model.User.findOne({ where: { userID: userId }, attributes: ['Id'] }).then(function (result) {
          model.Url.findAll({ where: { userId: result.Id }, attributes: ['name', 'address', 'Id'] }).then(function (result) {
            res.json({ isOK: true, token: token, urlData: result });
          });
        })
      } else {
        console.log("아이디 존재안해");
        res.json({ isOK: false });
      };
    })
  };

  bverifyUser(userId, password);
});

//회원가입
router.post('/signUpOk', function (req, res, next) {
  let password = req.body.password.toString();
  let userId = req.body.userId.toString();

  model.User.findOne({
    where: { userId: userId }
  }).then(function (result) {
    if (result) {
      console.log("중복아이디있다");
      res.json({ isOK: false });
    } else {
      model.User.create({ userId: userId, password: password }).then(function (result) {
        console.log("회원가입 완료");
        res.json({ isOK: true });
      });
    }
  });
});

module.exports = router;
