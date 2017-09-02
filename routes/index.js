var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');
var url = "http://www.naver.com";
var md5 = require("md5");
var window = require("window");
var crawl = "";
var before = "";

var passport = require('passport');
const controller = require('./feed.cotroller');

//controller.parse(); //이렇게 실행하는데 먼저 저장이 되어있어야한다..
//setInterval( controller.parse, 1 * 30000 ); //5초마다 돌린다

//테스트용
// var aa = function(){
//   console.log("안녕");
// }
// // aa();
//  setInterval( aa, 5 * 1000 );


module.exports = router;
