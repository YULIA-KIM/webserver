const express = require('express');
const router = express.Router();
const controller = require('./feed.cotroller');

setInterval( controller.parse, 1 * 36000 );

module.exports = router;
