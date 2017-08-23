var express = require('express');
var router = express.Router();
const controller = require('./feed.cotroller');

router.get('/delete/:start/:end', controller.delete);

router.get('/:urlId', controller.read);

router.post('/init', controller.init);

module.exports = router;