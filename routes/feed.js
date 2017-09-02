var express = require('express');
var router = express.Router();
const controller = require('./feed.cotroller');

router.get('/delete/:start/:end', controller.delete);

router.get('/:urlId', controller.read);

router.post('/init', controller.init);

router.get('/parse/:urlId', controller.parse);//테스트용으로 잠시


module.exports = router;
