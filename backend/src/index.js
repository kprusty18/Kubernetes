const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, requestLogger } = require('./middleware');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================
// Middleware
// =============================
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// Serve static frontend content (React/Vite/Angular build)
app.use(express.static(path.join(__dirname, '../public')));

// =============================
// API Routes
// =============================
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// =============================
// SPA Fallback (IMPORTANT FIX)
// =============================
// This ensures ANY non-API route loads index.html
app.get('*', (req, res, next) => {
  // Allow API + health routes to pass through
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }

  // Serve frontend index.html
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// =============================
// Error Handling Middleware
// =============================
app.use(errorHandler);

// =============================
// Start Server + Initialize DB
// =============================
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    console.log('Full-stack app ready at http://0.0.0.0:3000');

    // IMPORTANT FIX FOR KUBERNETES:
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;