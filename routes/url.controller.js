const model = require('../models/Model');
const jwt = require('jsonwebtoken');

exports.create = function(req, res){
    let userId = req.body.userId;
    model.User.findOne({
        where: {
            userId: userId
        }
    }).then(function (user) {
        model.Url.create({
            address : req.body.address,
            name : req.body.name,
            userId : user.Id,
            feed : req.body.feed })
            .then(function() {
                model.Url.findAll()
                    .then(function(urls) {
                        res.status(201).send({ isOK : true , urls});
                    })
            });
    })
};

exports.readAllUrls = function (req, res) {
    let token = req.body;
    console.log(token);
    model.Url.findAll()
        .then(function(urls) {            
            res.json(urls);
        })
};

exports.delete = function (req, res){
    let Id = parseInt(req.params.Id, 10);
    if(!Id){
        return res.status(400).json({error: 'Incorrect Id'});
    }

    model.Url.destroy({
        where: {
            Id: Id
        }
    }).then(function () {
        res.status(204).send( { isOK : true } );
    })
};

exports.update = function (req, res) {
    let Id = parseInt(req.body.Id, 10);
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

exports.ischecked = function (req, res) {
    let Id = parseInt(req.params.Id, 10);

    if(!Id){
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
            state: 1
        }, {
            where: {
                Id: Id
            }
        }).then(function () {
            res.status(201).send()
        }).catch(function (error) {
            console.log(error)
        })
    })
};
