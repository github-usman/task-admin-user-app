const express = require('express');
const router = express.Router();
const userData = require('../controller/users.js');

// testing purpose API with the help of this you can all information of the db
router.get('/info', userData.getData);

router.get('/hello-world', (req, res) => {
    res.send('Hello World');
  });


module.exports = router;