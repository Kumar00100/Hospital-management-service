const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all appointments (for admins and staff)
router.get('/', auth(['admin', 'staff']), async (req, res) => {
  try {
    const [appointments] = await pool.execute(`
      SELECT a.*, 
             up.name as patient_name, 
             ud.name as doctor_name, 
             dept.name as department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users ud ON doc.user_id = ud.id
      JOIN departments dept ON a.department_id = dept.id
      ORDER BY a.date DESC, a.time DESC
    `);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for a specific patient
router.get('/patient/:patientId', auth(['patient', 'admin', 'staff']), async (req, res) => {
  try {
    // Patients can only view their own appointments
    if (req.user.role === 'patient' && req.user.id !== parseInt(req.params.patientId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [appointments] = await pool.execute(`
      SELECT a.*, 
             up.name as patient_name, 
             ud.name as doctor_name, 
             dept.name as department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users ud ON doc.user_id = ud.id
      JOIN departments dept ON a.department_id = dept.id
      WHERE a.patient_id = ?
      ORDER BY a.date DESC, a.time DESC
    `, [req.params.patientId]);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for a specific doctor
router.get('/doctor/:doctorId', auth(['doctor', 'admin', 'staff']), async (req, res) => {
  try {
    // Doctors can only view their own appointments
    if (req.user.role === 'doctor' && req.user.id !== parseInt(req.params.doctorId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [appointments] = await pool.execute(`
      SELECT a.*, 
             up.name as patient_name, 
             ud.name as doctor_name, 
             dept.name as department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users ud ON doc.user_id = ud.id
      JOIN departments dept ON a.department_id = dept.id
      WHERE a.doctor_id = ?
      ORDER BY a.date DESC, a.time DESC
    `, [req.params.doctorId]);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const [appointments] = await pool.execute(`
      SELECT a.*, 
             up.name as patient_name, 
             ud.name as doctor_name, 
             dept.name as department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users ud ON doc.user_id = ud.id
      JOIN departments dept ON a.department_id = dept.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointments[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Appointment not found' });
    }
  }
);

// Create appointment
router.post('/', auth(['patient', 'staff', 'admin']), async (req, res) => {
  try {
    const { patient_id, doctor_id, department_id, date, time, description } = req.body;

    // Check if slot is available
    const [existingAppointments] = await pool.execute(
      'SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND time = ?',
      [doctor_id, date, time]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    const [result] = await pool.execute(
      'INSERT INTO appointments (patient_id, doctor_id, department_id, date, time, description) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, department_id, date, time, description]
    );

    res.status(201).json({ message: 'Appointment booked successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// Update appointment status
router.put('/:id/status', auth(['doctor', 'staff', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await pool.execute(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating appointment status' });
  }
});

// Cancel appointment
router.delete('/:id', auth(['patient', 'staff', 'admin']), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE appointments SET status = "cancelled" WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

module.exports = router;
