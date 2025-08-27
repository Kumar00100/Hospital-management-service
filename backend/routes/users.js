const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all users (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, status, created_at as createdAt FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent registrations (last 10)
router.get('/recent', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, status, created_at as createdAt FROM users ORDER BY created_at DESC LIMIT 10'
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (admin only)
router.get('/:id', auth(['admin']), async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (admin only)
router.put('/:id/status', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await pool.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { name, email, role, phone, status } = req.body;

    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, status = ? WHERE id = ?',
      [name, email, role, phone, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (no authentication required for testing)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
