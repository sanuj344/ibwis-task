const express = require('express');
const { initializeDatabase } = require('./src/db/init');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/', authRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
