const express = require('express');
const router = express.Router();
const controller = require('./feed.cotroller');

router.get('/delete/:start/:end', controller.delete);

router.get('/:urlId', controller.read);

router.post('/', controller.read);

router.post('/init', controller.init);

router.get('/parse', controller.parse);//테스트용으로 잠시


module.exports = router;
