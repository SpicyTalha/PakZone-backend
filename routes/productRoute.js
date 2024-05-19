const express = require('express');
const router = express.Router();
const { createProduct, getaProduct, getallProduct, updateProduct } = require('../controller/productCtrl');

router.post('/', createProduct)
router.get('/:id', getaProduct)
router.put('/:id', updateProduct)
router.get('/', getallProduct)

module.exports = router;