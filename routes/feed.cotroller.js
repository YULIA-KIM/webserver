var model = require('../models/Model');
var reader = require('feed-read');
var async = require('async');

exports.parse = function (){

  model.Url.findAll( { attributes: ['address', 'Id'] } ).then( function( arrDBResults ) {

    let tasks = [

      function(callback){
        async.map( arrDBResults, function( oDBResult, fnCallback ) {
          reader( oDBResult.address, function( err, arrArticles ) {
            if ( err ) {
              let strError = 'Reader Error (URL: ' + oDBResult.address + ') - ' + err;
              console.log( strError );
              return fnCallback( strError );
            }
            let arrTitles = [];
            for(let i=0; i<arrArticles.length; i++){
              arrTitles.push(arrArticles[i].title);
            }

            return fnCallback( null, arrTitles );
          } );
        }, function( err, arrTitles ) {
          if ( err ) {
            console.log( err );
          }
          //디비에 저장된 가장 마지막 글의 제목이 새로 읽어온 글 arr에서 어느 인덱스에 있는지 확인한 뒤에 그 인덱스가 그 arr의 끝이라면 새글이 없는거고
          //만약 끝이 아니고 그 글 뒤에 다른글이 추가가 됐다면 그 추가된 글들만 디비에 추가를 한다.
          callback(null, arrTitles);
        } );
      },

      function(callback){
        async.map( arrDBResults, function( oDBResult, fnCallback2 ) {

            model.Feed.findAll({
              where: { urlId: oDBResult.Id },
              attributes: ['title'],
              order: [['Id', 'DESC']],
              limit: 1
            }).then(function(arrDBresult){
              return fnCallback2( null, arrDBresult[0].title );
            }).catch(function(err){
              console.log(err);
            });


        }, function( err, arrarrDBresult ) {
          if ( err ) {
            console.log( err );
          }
          callback(null, arrarrDBresult);

        } );
      }

    ];

    async.parallel( tasks, function(err, results){ //results에는 위의 두개의 task가 실행된 결과가 순서대로 담겨있다.
      let arrarrTitles = results[0]; //여긴 읽어들인 urlId개수만큼의 title모음 arr가 들어있다.
      let arrtitle = results[1]; //여긴 기사들의 마지막 title 들이 순서대로 들어가있다.

      for ( let i = 0; i < arrarrTitles.length; ++i ) { //여기서 길이는 urlId개수만큼 있다
        let arrTitles = arrarrTitles[ i ]; //첫번째 urlId의 title들이 들어가있다
        let dbTitle = arrtitle[i]; //마지막 title들의 첫번째 title이 들어가있다
        let strDbTitle = "'" + dbTitle + "'"; //문자열로 만들어주고

        if( arrTitles[arrTitles.length-1] === dbTitle){
          console.log("아직 새로운 기사가 없다");
          let titleIndex = arrTitles.indexOf(strDbTitle);//49

          console.log(arrTitles.length-1);//49

        }else{
          console.log("새로운 기사가 있다");
          let titleIndex = arrTitles.indexOf(strDbTitle); //이 인덱스 바로 뒤부터 끝까지 디비에 넣으면 된다.

          reader( arrDBResults[i].address, function( err, arrArticles ) {
            if ( err ) {
              let strError = 'Reader Error (URL: ' + oDBResult.address + ') - ' + err;
              console.log( strError );
              return fnCallback( strError );
            }
            for( let i = titleIndex+1; i<arrArticles.length; i++ ){
              let newArticle = [];
              newArticle.push({
                urlId: arrDBResults[i].Id,
                title: arrArticles[i].title,
                content: arrArticles[i].content,
                link: arrArticles[i].link
              });
            }

            model.Feed.bulkCreate( newArticle ).then(function (result) { //이미지 정보도 있는거로 바꿔야한다
            }).catch(function (err) {
              console.log("db에 정보 넣기 실패");
            });

          });

        }
      }
    });
  } ).catch( function( err ) {
    console.log("Db에서 urlId전체 가져오기 실패, err:" + err);
  } );
}



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
    const address = req.body.address;
    const urlId = req.body.urlId;
    const feeds = [];

    reader(address, function (err, responses) {
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
