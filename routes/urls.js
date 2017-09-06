var express = require('express');
var router = express.Router();
const controller = require('./url.controller');

router.post('/', controller.create);

router.post('/all', controller.readAllUrls);

router.put('/update', controller.update);

router.delete('/delete/:Id', controller.delete);

router.put('/state/:Id', controller.ischecked);

module.exports = router;