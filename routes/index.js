var express = require('express');
var router = express.Router();
const controller = require('./feed.cotroller');

setInterval( controller.parse, 1 * 36000 );

module.exports = router;
