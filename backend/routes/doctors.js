const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const [doctors] = await pool.execute(`
      SELECT d.*, u.name, u.email, dept.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dept ON d.department_id = dept.id
      ORDER BY u.name
    `);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const [doctors] = await pool.execute(`
      SELECT d.*, u.name, u.email, dept.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dept ON d.department_id = dept.id
      WHERE d.id = ?
    `, [req.params.id]);

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctors[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctors by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const [doctors] = await pool.execute(`
      SELECT d.*, u.name, u.email, dept.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dept ON d.department_id = dept.id
      WHERE d.department_id = ?
      ORDER BY u.name
    `, [req.params.departmentId]);

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create doctor (admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { user_id, department_id, qualification, experience, availability, photo, bio } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO doctors (user_id, department_id, qualification, experience, availability, photo, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, department_id, qualification, experience, availability, photo, bio]
    );

    res.status(201).json({ message: 'Doctor created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor (admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { user_id, department_id, qualification, experience, availability, photo, bio } = req.body;

    const [result] = await pool.execute(
      'UPDATE doctors SET user_id = ?, department_id = ?, qualification = ?, experience = ?, availability = ?, photo = ?, bio = ? WHERE id = ?',
      [user_id, department_id, qualification, experience, availability, photo, bio, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete doctor (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM doctors WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
