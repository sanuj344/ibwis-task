const express = require('express');
const { initializeDatabase } = require('./src/db/init');
const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();

// Middleware for security & parsing
app.use(express.json({ limit: '10kb' })); // Limit request body size
app.set('trust proxy', false); // Don't trust proxy headers for auth
app.disable('x-powered-by'); // Hide Express version

// Initialize database
initializeDatabase();

// Routes
app.use('/', authRoutes);
app.use('/', blogRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

