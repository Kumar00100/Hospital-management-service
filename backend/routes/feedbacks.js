const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all feedbacks
router.get('/', async (req, res) => {
  try {
    const [feedbacks] = await pool.execute(`
      SELECT f.*, u.name as patient_name
      FROM feedbacks f
      JOIN patients p ON f.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      ORDER BY f.created_at DESC
    `);
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const [feedbacks] = await pool.execute(`
      SELECT f.*, u.name as patient_name
      FROM feedbacks f
      JOIN patients p ON f.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE f.id = ?
    `, [req.params.id]);

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedbacks[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create feedback
router.post('/', auth(['patient']), async (req, res) => {
  try {
    const { patient_id, message, rating } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO feedbacks (patient_id, message, rating) VALUES (?, ?, ?)',
      [patient_id, message, rating]
    );

    res.status(201).json({ message: 'Feedback created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update feedback
router.put('/:id', auth(['patient']), async (req, res) => {
  try {
    const { message, rating } = req.body;

    const [result] = await pool.execute(
      'UPDATE feedbacks SET message = ?, rating = ? WHERE id = ?',
      [message, rating, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback
router.delete('/:id', auth(['patient']), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM feedbacks WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
