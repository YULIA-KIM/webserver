const model = require('../models/Model');
const jwt = require('jsonwebtoken');

exports.create = function(req, res){
    let token = req.body.token;
    console.log(token);

    let check = function( token ){
        if(!token) {
            console.log("token is undefined");
        }
        var decoded = jwt.verify(token, "AdeFESddfTg765JhhgIu");
            console.log(decoded);
            model.User.findOne({
              where: {
                userId: decoded.userID //어떻게 받아오는지 확인해야한다
              }
            }).then(function(user){
                console.log( user.userId );
              if(!user){
                console.log("권한이 없습니다.");
              }else {
                console.log("권한이 있네 ㅊㅋ");
                model.Url.create({
                    address : req.body.address,
                    name : req.body.name,
                    userId : user.userId,
                    feed : req.body.feed })
                    .then(function() {
                        model.Url.findAll()
                        .then(function(urls) {
                            res.status(201).send({ isOK : true , urls});
                        })
                    })
              }
            });
      }
    check(token);
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
    const Id = parseInt(req.params.Id, 10);
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

exports.ischecked = function (req, res) {
    const Id = parseInt(req.params.Id, 10);

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
