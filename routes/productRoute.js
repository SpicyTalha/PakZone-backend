const express = require('express');
const router = express.Router();
const { createProduct, getaProduct, getallProduct, updateProduct, deleteProduct } = require('../controller/productCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, isAdmin, createProduct)
router.get('/:id', getaProduct)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.get('/', getallProduct)

module.exports = router;