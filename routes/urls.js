const express = require('express');
const router = express.Router();
const controller = require('./url.controller');

router.post('/', controller.create);

router.put('/update', controller.update);

router.delete('/delete/:Id', controller.delete);

router.put('/state/:Id', controller.ischecked);

module.exports = router;