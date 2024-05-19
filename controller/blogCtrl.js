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
    validateMongoDbId(id);
    try{
        const updateBlog = await Blog.findOneAndUpdate({_id: id}, req.body, {new:true})
        res.json(updateBlog);

    }catch(error){
        throw new Error(error)
    }
})

const getaBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const findBlog = await Blog.findById({_id: id}).populate('likes').populate('dislikes');
        await Blog.findByIdAndUpdate(id, {
            $inc: {numViews: 1}
        }, {new: true});
        res.json(findBlog)
    }catch(error){
        throw new Error(error)
    }
})

const getallBlog = asyncHandler(async (req, res) => {
    try{
        const findBlog = await Blog.find();
        res.json(findBlog)
    }catch(error){
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog);

    }catch(error){
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog which you want to like
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    // Find the user that is logged in
    const loginUserId = req?.user?._id;
    if (!loginUserId) {
        res.status(401);
        throw new Error('User not authenticated');
    }

    // Check if the user has already liked the blog
    const isLiked = blog.likes.some(userId => userId.toString() === loginUserId.toString());

    // Check if the user has disliked the blog
    const isDisliked = blog.dislikes.some(userId => userId.toString() === loginUserId.toString());

    let updatedBlog;

    // If the user has disliked the blog, remove the dislike
    if (isDisliked) {
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
    }

    // If the user has liked the blog, remove the like
    if (isLiked) {
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
    } else {
        // Otherwise, add the like
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        }, { new: true });
    }

    res.json(updatedBlog);
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog which you want to dislike
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    // Find the user that is logged in
    const loginUserId = req?.user?._id;
    if (!loginUserId) {
        res.status(401);
        throw new Error('User not authenticated');
    }

    // Check if the user has already liked the blog
    const isLiked = blog.likes.some(userId => userId.toString() === loginUserId.toString());

    // Check if the user has disliked the blog
    const isDisliked = blog.dislikes.some(userId => userId.toString() === loginUserId.toString());

    let updatedBlog;

    // If the user has liked the blog, remove the like
    if (isLiked) {
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
    }

    // If the user has disliked the blog, remove the dislike
    if (isDisliked) {
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
    } else {
        // Otherwise, add the dislike
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        }, { new: true });
    }

    res.json(updatedBlog);
});

module.exports = {createBlog, updateBlog, getaBlog, getallBlog, deleteBlog, likeBlog, dislikeBlog};