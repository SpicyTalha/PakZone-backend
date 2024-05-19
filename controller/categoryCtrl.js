const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory)
    }catch(error){
        throw new Error(error)
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateCategory = await Category.findOneAndUpdate({_id: id}, req.body, {new:true})
        res.json(updateCategory);

    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createCategory, updateCategory}