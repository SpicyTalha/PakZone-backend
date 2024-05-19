const express = require('express');
const router = express.Router();
const { createProduct, getaProduct, getallProduct, updateProduct, deleteProduct } = require('../controller/productCtrl');

router.post('/', createProduct)
router.get('/:id', getaProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/', getallProduct)

module.exports = router;