const express = require('express');
const router = express.Router();
const { createProduct, getaProduct, getallProduct } = require('../controller/productCtrl');

router.post('/', createProduct)
router.get('/:id', getaProduct)
router.get('/', getallProduct)

module.exports = router;