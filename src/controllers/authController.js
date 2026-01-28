const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { validateEmail, validatePassword } = require('../utils/validation');

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

  // Validate name
  if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
    return res.status(400).json({
      error: 'Name must be between 2 and 100 characters'
    });
  }

  // Validate role
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      error: 'Invalid role. Must be "user" or "admin"'
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  // Validate password strength
  if (!validatePassword(password)) {
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

/**
 * Authenticate user and return JWT token
 * POST /signin
 * Body: { email, password }
 * 
 * SECURITY: Returns generic error message for non-existent users
 * to prevent user enumeration attacks
 */
const signin = (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing required fields: email, password'
    });
  }

  // Fetch user from database
  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, user) => {
    if (err) {
      return res.status(500).json({
        error: 'Database error'
      });
    }

    // User not found - return generic error to prevent user enumeration
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Compare passwords using bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          error: 'Error comparing passwords'
        });
      }

      // Password doesn't match - return generic error
      if (!isMatch) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token with user id and role
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
        {
          expiresIn: process.env.JWT_EXPIRATION || '7d'
        }
      );

      res.status(200).json({
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    });
  });
};

module.exports = { signup, signin };
