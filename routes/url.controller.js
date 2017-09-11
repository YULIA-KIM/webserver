const model = require('../models/Model');
const jwt = require('jsonwebtoken');
const reader = require('feed-read');

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
                feed : req.body.feed
            }).then(function() {
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
    }).catch(function(err){
        res.status(404).json({error: 'Not found'});
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
            res.status(201).send({ isOK: true });
        }).catch(function (error) {
            console.log(error);
        })
    }).catch(function(err, res){
        res.status(404).json({ isOK: false });
        console.log("디비정보 찾기 실패");
    })
};

exports.validate = function(req, res) {
    let address = req.body.address;
  
    reader(address, function (err, responses) {
      if(err){
        res.status(400).send({ isOK : false });
      }
    });

    res.status(200).send({ isOK : true });

  }