const express = require('express');
const { getAllBlogs, createBlog } = require('../controllers/blogController');
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

module.exports = router;
