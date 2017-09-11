const express = require('express');
const router = express.Router();
const controller = require('./feed.cotroller');

router.get('/delete/:start/:end', controller.delete);

router.post('/', controller.read);

router.post('/init', controller.init);

module.exports = router;
