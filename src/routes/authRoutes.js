const express = require('express');
const { signup, signin } = require('../controllers/authController');

const router = express.Router();

/**
 * POST /signup
 * Register a new user with name, email, password
 */
router.post('/signup', signup);

/**
 * POST /signin
 * Authenticate user and return JWT token
 */
router.post('/signin', signin);

module.exports = router;
