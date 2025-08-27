const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all patients
router.get('/', auth(['admin', 'doctor', 'staff']), async (req, res) => {
  try {
    const [patients] = await pool.execute(`
      SELECT p.*, u.name, u.email, CONCAT('REG', LPAD(u.id, 6, '0')) as registrationNumber
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.name
    `);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by ID
router.get('/:id', auth(['admin', 'doctor', 'staff', 'patient']), async (req, res) => {
  try {
    const [patients] = await pool.execute(`
      SELECT p.*, u.name, u.email, CONCAT('REG', LPAD(u.id, 6, '0')) as registrationNumber
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patients[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by user ID
router.get('/user/:userId', auth(['admin', 'doctor', 'staff', 'patient']), async (req, res) => {
  try {
    const [patients] = await pool.execute(`
      SELECT p.*, u.name, u.email, CONCAT('REG', LPAD(u.id, 6, '0')) as registrationNumber
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE u.id = ?
    `, [req.params.userId]);

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patients[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/:id', auth(['patient', 'staff', 'admin']), async (req, res) => {
  try {
    const { age, gender, phone, address, blood_group } = req.body;

    const [result] = await pool.execute(
      'UPDATE patients SET age = ?, gender = ?, phone = ?, address = ?, blood_group = ? WHERE id = ?',
      [age, gender, phone, address, blood_group, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
