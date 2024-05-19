const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');


const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    }catch(error){
        throw new Error(error)
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const updateBlog = await Blog.findOneAndUpdate({_id: id}, req.body, {new:true})
        res.json(updateBlog);

    }catch(error){
        throw new Error(error)
    }
})

const getaBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const findBlog = await Blog.findById({_id: id});
        await Blog.findByIdAndUpdate(id, {
            $inc: {numViews: 1}
        }, {new: true});
        res.json(findBlog)
    }catch(error){
        throw new Error(error)
    }
})

const getallBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const findBlog = await Blog.find();
        res.json(findBlog)
    }catch(error){
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog);

    }catch(error){
        throw new Error(error)
    }
})



module.exports = {createBlog, updateBlog, getaBlog, getallBlog, deleteBlog};