const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl, getallUser} = require('../controller/userCtrl')

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/getall', getallUser);

module.exports = router;