const express = require('express');
const { getAllBlogs } = require('../controllers/blogController');

const router = express.Router();

/**
 * GET /blogs
 * Public endpoint - get all blogs
 */
router.get('/blogs', getAllBlogs);

module.exports = router;
