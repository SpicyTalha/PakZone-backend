const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getaBlog, getallBlog, deleteBlog } = require('../controller/blogCtrl');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getaBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.get('/', getallBlog)

module.exports = router;