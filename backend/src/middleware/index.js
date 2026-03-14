const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Request logger middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
}

// Error handler middleware
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  
  // Handle SQLite unique constraint errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(400).json({
      success: false,
      error: 'A user with this email already exists'
    });
  }
  
  // Handle SQLite not found errors
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
}

module.exports = { requestLogger, errorHandler };
