const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all prescriptions
router.get('/', async (req, res) => {
  try {
    const [prescriptions] = await pool.execute(`
      SELECT p.*, u.name as doctor_name, dept.name as department_name
      FROM prescriptions p
      JOIN users u ON p.doctor_id = u.id
      JOIN departments dept ON p.department_id = dept.id
      ORDER BY p.created_at DESC
    `);
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const [prescriptions] = await pool.execute(`
      SELECT p.*, u.name as doctor_name, dept.name as department_name
      FROM prescriptions p
      JOIN users u ON p.doctor_id = u.id
      JOIN departments dept ON p.department_id = dept.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescriptions[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create prescription (admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { patient_id, doctor_id, department_id, diagnosis, medicines, instructions } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO prescriptions (patient_id, doctor_id, department_id, diagnosis, medicines, instructions) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, department_id, diagnosis, medicines, instructions]
    );

    res.status(201).json({ message: 'Prescription created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update prescription (admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { patient_id, doctor_id, department_id, diagnosis, medicines, instructions } = req.body;

    const [result] = await pool.execute(
      'UPDATE prescriptions SET patient_id = ?, doctor_id = ?, department_id = ?, diagnosis = ?, medicines = ?, instructions = ? WHERE id = ?',
      [patient_id, doctor_id, department_id, diagnosis, medicines, instructions, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete prescription (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM prescriptions WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
