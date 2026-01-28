const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token and attaches decoded user info to req.user
 * 
 * Responds with 401 if:
 * - No token provided
 * - Token is invalid
 * - Token is expired
 */
const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Missing authorization header'
    });
  }

  // Extract token (format: "Bearer <token>")
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Invalid authorization header format. Expected: Bearer <token>'
    });
  }

  const token = parts[1];

  // Verify JWT token
  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Invalid or expired token'
        });
      }

      // Attach decoded user info to request object
      // This is extracted ONLY from the JWT, never trusting client input
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };

      next();
    }
  );
};

module.exports = { authMiddleware };
