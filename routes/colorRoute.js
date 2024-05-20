const express = require('express');
const router = express.Router();
const { createColor, updateColor, deleteColor, getaColor, getallColor} = require('../controller/colorCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/',authMiddleware, isAdmin, createColor)
router.put('/:id',authMiddleware, isAdmin, updateColor)
router.delete('/:id',authMiddleware, isAdmin, deleteColor)
router.get('/getall', getallColor)
router.get('/:id', getaColor)


module.exports = router;