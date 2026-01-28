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

module.exports = { getAllBlogs };
