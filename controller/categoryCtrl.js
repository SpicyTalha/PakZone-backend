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

const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json(deleteCategory);

    }catch(error){
        throw new Error(error)
    }
})

const getaCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const findCategory = await Category.findById(id);
        res.json(findCategory)
    }catch(error){
        throw new Error(error)
    }
})

const getallCategory = asyncHandler(async (req, res) => {
    try{
        const findCategory = await Category.find();
        res.json(findCategory)
    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createCategory, updateCategory, deleteCategory, getaCategory, getallCategory}