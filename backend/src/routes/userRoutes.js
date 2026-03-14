
const express = require('express');
const router = express.Router();
const { prepare } = require('../config/database');

// GET all users - Read
router.get('/', (req, res) => {
  try {
    const users = prepare('SELECT * FROM users ORDER BY id').all();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET user by ID - Read
router.get('/:id', (req, res) => {
  try {
    const user = prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and role are required'
      });
    }
    
    const result = prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)').run(name, email, role);
    
    const newUser = prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT - Update existing user
router.put('/:id', (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and role are required'
      });
    }
    
    prepare('UPDATE users SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, email, role, id);
    
    const updatedUser = prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Remove user
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    prepare('DELETE FROM users WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;


