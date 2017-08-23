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

// var connection = mysql.createConnection({
//     host     :  'localhost',
//     user     :  'root',
//     password :  '1017',
//     port     :  3000,
//     database : 'pingpong'
// });

//크롤링 해오기
var crawling = function(){
    request(url, function(error, response, body){
        if (error) throw error;

        var $ = cheerio.load(body);
        var result = false;

        fs.readFile('test.txt', 'utf8', function(error, data){
            before = data;

            console.log(before);

            var postElements = $('.container');
            postElements.each(function() {
                crawl =  $(this).html();
            });

            var crawlEncode = md5(crawl);
            console.log(crawlEncode);

            if(before !== crawlEncode){
                this.result = true;
            }
            return(this.result);

        });
    });
}
// 알람 설정
var alarm = function(update){
    console.log(update);
    if(update == true){
        console.log("알람");
    }
}
//알람 실행
//alarm(crawling());

//controller.parse('http://blog.rss.naver.com/ki__chin.xml');



module.exports = router;
