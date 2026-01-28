const express = require('express');
const { getAllBlogs, createBlog, updateBlog } = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /blogs
 * Public endpoint - get all blogs
 */
router.get('/blogs', getAllBlogs);

/**
 * POST /blogs
 * Protected endpoint - create blog (User & Admin only)
 * Authorization is handled by authMiddleware
 */
router.post('/blogs', authMiddleware, createBlog);

/**
 * PUT /blogs/:id
 * Protected endpoint - update blog (Owner or Admin only)
 */
router.put('/blogs/:id', authMiddleware, updateBlog);

module.exports = router;
