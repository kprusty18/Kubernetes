
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../../data/users.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

// Initialize database with tables and mock data
async function initializeDatabase() {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if data exists
  const result = db.exec('SELECT COUNT(*) as count FROM users');
  const userCount = result.length > 0 ? result[0].values[0][0] : 0;

  if (userCount === 0) {
    // Insert mock data
    const mockUsers = [
      { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      { name: 'Bob Wilson', email: 'bob@example.com', role: 'User' },
      { name: 'Alice Brown', email: 'alice@example.com', role: 'Manager' },
    ];

    for (const user of mockUsers) {
      db.run('INSERT INTO users (name, email, role) VALUES (?, ?, ?)', 
        [user.name, user.email, user.role]);
    }
    
    saveDatabase();
    console.log('Mock data inserted successfully');
  }
  
  return db;
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Helper functions to mimic better-sqlite3 API
function prepare(sql) {
  return {
    all: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }
      let result = null;
      if (stmt.step()) {
        result = stmt.getAsObject();
      }
      stmt.free();
      return result;
    },
    run: (...params) => {
      db.run(sql, params);
      saveDatabase();
      return {
        lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0]?.values[0][0] || 0,
        changes: db.getRowsModified()
      };
    }
  };
}

module.exports = { 
  getDb: () => db, 
  initializeDatabase, 
  prepare 
};


