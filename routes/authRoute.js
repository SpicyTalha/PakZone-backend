const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl, getallUser, getaUser, deleteaUser} = require('../controller/userCtrl')

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/getall', getallUser);
router.get('/:id', getaUser);
router.delete('/:id', deleteaUser);

module.exports = router;