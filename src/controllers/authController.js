const bcrypt = require('bcrypt');
const db = require('../db/database');

/**
 * Register a new user
 * POST /signup
 * Body: { name, email, password, role }
 */
const signup = (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, password'
    });
  }

  // Validate role
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      error: 'Invalid role. Must be "user" or "admin"'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long'
    });
  }

  // Hash password with bcrypt (10 salt rounds)
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({
        error: 'Error hashing password'
      });
    }

    // Insert user into database
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.run(query, [name, email, hashedPassword, role], (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({
            error: 'Email already registered'
          });
        }
        return res.status(500).json({
          error: 'Error creating user'
        });
      }

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          email,
          name,
          role
        }
      });
    });
  });
};

module.exports = { signup };
