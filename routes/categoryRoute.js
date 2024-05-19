const express = require('express');
const router = express.Router();
const { createCategory, updateCategory} = require('../controller/categoryCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/',authMiddleware, isAdmin, createCategory)
router.put('/:id',authMiddleware, isAdmin, updateCategory)

module.exports = router;