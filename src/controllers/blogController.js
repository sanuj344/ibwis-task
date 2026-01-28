const db = require('../db/database');

/**
 * Get all blogs
 * GET /blogs
 * Public endpoint - accessible to everyone
 */
const getAllBlogs = (req, res) => {
  const query = `
    SELECT 
      b.id,
      b.title,
      b.content,
      b.user_id,
      b.created_at,
      b.updated_at,
      u.name as author_name,
      u.email as author_email
    FROM blogs b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error fetching blogs'
      });
    }

    res.status(200).json({
      message: 'Blogs retrieved successfully',
      count: rows.length,
      blogs: rows
    });
  });
};

/**
 * Create a new blog
 * POST /blogs
 * Protected: User & Admin only
 * 
 * User ID is extracted from JWT token, NOT from request body
 * This prevents users from creating blogs on behalf of others
 */
const createBlog = (req, res) => {
  const { title, content } = req.body;

  // Validate inputs
  if (!title || !content) {
    return res.status(400).json({
      error: 'Missing required fields: title, content'
    });
  }

  // Extract user ID from authenticated token (never trust request body)
  const userId = req.user.id;

  // Insert blog into database
  const query = 'INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)';
  db.run(query, [title, content, userId], function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Error creating blog'
      });
    }

    res.status(201).json({
      message: 'Blog created successfully',
      blog: {
        id: this.lastID,
        title,
        content,
        user_id: userId,
        created_at: new Date().toISOString()
      }
    });
  });
};

/**
 * Update a blog
 * PUT /blogs/:id
 * Protected: Blog owner or Admin only
 * 
 * Authorization check:
 * - User must be the blog owner OR have admin role
 * - Returns 403 Forbidden if not authorized
 */
const updateBlog = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validate inputs
  if (!title || !content) {
    return res.status(400).json({
      error: 'Missing required fields: title, content'
    });
  }

  // Fetch blog from database
  const selectQuery = 'SELECT * FROM blogs WHERE id = ?';
  db.get(selectQuery, [id], (err, blog) => {
    if (err) {
      return res.status(500).json({
        error: 'Error fetching blog'
      });
    }

    // Blog not found
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check authorization: must be blog owner OR admin
    const isOwner = blog.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to update this blog'
      });
    }

    // Update blog
    const updateQuery = 'UPDATE blogs SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(updateQuery, [title, content, id], (err) => {
      if (err) {
        return res.status(500).json({
          error: 'Error updating blog'
        });
      }

      res.status(200).json({
        message: 'Blog updated successfully',
        blog: {
          id,
          title,
          content,
          user_id: blog.user_id,
          updated_at: new Date().toISOString()
        }
      });
    });
  });
};

module.exports = { getAllBlogs, createBlog, updateBlog };
