const model = require('../models/Model');
const feedController = require('./feed.cotroller');

exports.create = function(req, res){

    model.Url.create({
        address : req.body.address,
        name : req.body.name,
        userId : req.body.userId,
        feed : req.body.feed })
        .then(function() {
            res.status(201).send();
            //feedController.init();
        })
};

exports.readAllUrls = function (req, res) {
    model.Url.findAll()
        .then(function(urls) {
            res.json(urls);
        })
};

exports.delete = function (req, res){
    const Id = parseInt(req.params.Id, 10);
    if(!Id){
        return res.status(400).json({error: 'Incorrect Id'});
    }

    model.Url.destroy({
        where: {
            Id: Id
        }
    }).then(function () {
        res.status(204).send()
    })
};

exports.update = function (req, res) {
    const Id = parseInt(req.body.Id, 10);
    if(!Id){
        console.log(Id);
        return res.status(400).json({error: 'Incorrect Id'});
    }

    model.Url.findOne({
        where: {
            Id: Id
        }
    }).then(function (url) {
        if(!url){
            return res.status(404).json({error: 'Not found'})
        }

        model.Url.update({
            address : req.body.address,
            name : req.body.name,
            userId : req.body.userId,
            feed : req.body.feed}, {
            where: {
                Id: Id
            }})
            .then(function() {
                res.status(201).send()
            })
            .catch(function (error) {
                console.log(error)
            })
    })
};
