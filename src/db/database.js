const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ibwis.db');

// Create and configure database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('✗ Database connection failed:', err.message);
  } else {
    console.log(`✓ Database connected: ${dbPath}`);
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
});

module.exports = db;

