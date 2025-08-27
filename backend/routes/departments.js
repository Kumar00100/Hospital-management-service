const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all departments (public access)
router.get('/', async (req, res) => {
  try {
    const [departments] = await pool.execute('SELECT * FROM departments ORDER BY name');
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get department by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    const [departments] = await pool.execute(
      'SELECT * FROM departments WHERE id = ?',
      [req.params.id]
    );

    if (departments.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(departments[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create department (admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO departments (name, description, image) VALUES (?, ?, ?)',
      [name, description, image]
    );

    res.status(201).json({ message: 'Department created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update department (admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const [result] = await pool.execute(
      'UPDATE departments SET name = ?, description = ?, image = ? WHERE id = ?',
      [name, description, image, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete department (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM departments WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
