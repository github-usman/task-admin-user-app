const express = require('express');
const router = express.Router();
const userData = require('../controller/users.js');


router.get('/info', userData.getData);

router.get('/hello-world', (req, res) => {
    res.send('Hello World');
  });


module.exports = router;