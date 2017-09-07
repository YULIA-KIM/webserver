const model = require('../models/Model');
const jwt = require('jsonwebtoken');

exports.create = function(req, res){
    let userId = req.body.userId;
    let address = req.body.address;
    let name = req.body.name;

    model.User.findOne({
        where: {
            userId: userId
        }
    }).then(function (user) {
        if( address && name ){
            model.Url.create({
                address : address,
                name : name,
                userId : user.Id,
                feed : req.body.feed })
                .then(function() {
                    model.Url.findAll()
                        .then(function(urls) {
                            res.status(201).send({ isOK : true , urls});
                        })
                });
        }
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
        res.status(204).json( { isOK : true } );
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
