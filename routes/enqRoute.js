const express = require('express');
const router = express.Router();
const { createEnquiry, updateEnquiry, deleteEnquiry, getaEnquiry, getallEnquiry} = require('../controller/enqCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/',createEnquiry)
router.put('/:id',authMiddleware, isAdmin, updateEnquiry)
router.delete('/:id',authMiddleware, isAdmin, deleteEnquiry)
router.get('/getall', getallEnquiry)
router.get('/:id', getaEnquiry)


module.exports = router;