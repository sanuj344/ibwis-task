const express = require('express');
const { signup } = require('../controllers/authController');

const router = express.Router();

/**
 * POST /signup
 * Register a new user with name, email, password
 */
router.post('/signup', signup);

module.exports = router;
