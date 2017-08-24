const model = require('../models/Model');
var reader = require('feed-read');
var async = require('async');

exports.parse = function () { //urlId를 받아와서 하는거구나
  var newArticle = [];
  var arrOldTitle = [];
  var arrNewTitle = [];
  var arrUrlAndId = [];

  model.Url.findAll({
    attributes: ['address', 'Id']
  }).then(function (result) {
    //TODO: query결과가 담긴 result에 대한 처리 진행
    console.log("url테이블에서 url주소 가져오기:" + result);

    for (let i in result) {
      console.log("결과:" + result[i].address);
      arrUrlAndId.push(result);
      reader(result[i].address, function (err, article) {
        for (i = 0; i < article.length; i++) {
          newArticle.push({
            title: article[i].title,
            content: article[i].content,
            link: article[i].link,
            description: article[i].description,
          });
        }//이부분 수정..
        //newArticle.push(article);//이부분 매칭해서 저장하기
      });

      models.Feed.find({//원래 디비에 저장돼있던 Feed들 가져오기
        where: { urlId: arrUrlAndId[i].Id },
        attributes: ['title'],
        order: 'Id DESC'
      }).then(function (result) {
        console.log("feed테이블에서 가장 마지막title 1개 가져오기. 결과:" + result);
        //arrOldTitle.push(result); //어떻게 나오나
        var articleLength = newArticle.length;
        if (result[0].title !== newArticle[articleLength - 1].title) { //같다면 아무짓도 안하고 다르면 디비에 저장

          model.Feed.bulkCreate(newArticle).then(function (result) { //다섯가지 정보가 들어가야해
          }).catch(function (err) {
            //TODO: error handling
          });
        } else {
          console.log("최신 정보니까 아무것도 안하고 다음 url 검사하자");
        }
      }).catch(function (err) {
        //TODO: error handling
      });
    }
  });

};

exports.delete = function (req, res) {
    const start = parseInt(req.params.start, 10);
    const end = parseInt(req.params.end, 10);
    const destroyIndex = [];
    for(let i = start; i <= end; i++){
        destroyIndex.push(i);
    }
    model.Feed.destroy({
        where: {
            Id: destroyIndex
        }
    }).then(function () {
        res.status(204).send();
    })
};

exports.init = function (req, res) {
    const url = req.body.url;
    const urlId = req.body.urlId;
    const feeds = [];

    reader(url, function (err, responses) {
        for(let i = 0; i < responses.length; i++){
            var feed = {
                urlId: urlId,
                title: responses[i].title,
                content: responses[i].content,
                link: responses[i].link
            };
            feeds.push(feed);
        };

        model.Feed.bulkCreate(feeds)
            .then(function () {
                res.status(200).send();
            })
    });
};

exports.read = function (req, res) {
    const urlId = parseInt(req.params.urlId);

    model.Feed.findAll({
        where: {
            urlId: urlId
        }
    }).then(function (feeds) {
        res.json(feeds);
    })
};
