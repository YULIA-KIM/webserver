const model = require('../models/Model');
var reader = require('feed-read');
var async = require('async');


exports.parse = function(req, res){

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