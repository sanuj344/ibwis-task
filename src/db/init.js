const db = require('./database');

/**
 * Initialize database schema
 * Creates users and blogs tables with proper constraints
 */
const initializeDatabase = () => {
  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create blogs table with foreign key constraint
  const createBlogsTable = `
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Execute table creation
  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('✗ Error creating users table:', err.message);
    } else {
      console.log('✓ Users table initialized');
    }
  });

  db.run(createBlogsTable, (err) => {
    if (err) {
      console.error('✗ Error creating blogs table:', err.message);
    } else {
      console.log('✓ Blogs table initialized');
    }
  });
};

module.exports = { initializeDatabase };
