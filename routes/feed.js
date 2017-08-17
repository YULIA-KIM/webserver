var express = require('express');
var router = express.Router();
const controller = require('./feed.cotroller');

router.post('/delete', controller.delete());

router.get('', controller.read());

module.exports = router;