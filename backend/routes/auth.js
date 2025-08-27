const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ✅ Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user with status = 1 (active)
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, 1]
    );

    const userId = result.insertId;

    // ✅ Create role-specific record
    if (role === 'patient') {
      await pool.execute(
        'INSERT INTO patients (user_id, age, gender, phone, address, blood_group) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, null, null, null, null, null]
      );
    } else if (role === 'doctor') {
      await pool.execute(
        'INSERT INTO doctors (user_id, department_id, qualification, experience, availability, photo, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, null, null, null, null, null, null]
      );
    } else if (role === 'staff') {
      await pool.execute(
        'INSERT INTO staff (user_id, department_id, phone, shift_time) VALUES (?, ?, ?, ?)',
        [userId, null, null, null]
      );
    }

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create Admin
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const [existingAdmins] = await pool.execute(
      'SELECT * FROM users WHERE role = "admin" LIMIT 1'
    );

    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with admin role and status = 1
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin', 1]
    );

    res.status(201).json({ message: 'Admin user created successfully', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is active
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND status = 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials or inactive account' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Get mobile number based on user role
    let mobile = '';
    if (user.role === 'patient') {
      const [patients] = await pool.execute(
        'SELECT phone FROM patients WHERE user_id = ?',
        [user.id]
      );
      mobile = patients.length > 0 ? patients[0].phone : '';
    } else if (user.role === 'staff') {
      const [staff] = await pool.execute(
        'SELECT phone FROM staff WHERE user_id = ?',
        [user.id]
      );
      mobile = staff.length > 0 ? staff[0].phone : '';
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ✅ Manage sessions
    try {
      const [existingSessions] = await pool.execute(
        'SELECT id FROM user_sessions WHERE user_id = ? AND is_active = 1',
        [user.id]
      );

      if (existingSessions.length > 0) {
        await pool.execute(
          'UPDATE user_sessions SET last_activity = NOW() WHERE user_id = ? AND is_active = 1',
          [user.id]
        );
      } else {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await pool.execute(
          'INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, is_active, expires_at) VALUES (?, ?, ?, ?, 1, ?)',
          [user.id, token, req.ip || 'unknown', req.get('User-Agent') || 'unknown', expiresAt]
        );
      }
    } catch (sessionError) {
      console.error('Session creation error:', sessionError);
    }

    // Generate registration number based on user ID
    const registrationNumber = `REG${user.id.toString().padStart(6, '0')}`;

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: mobile,
        registrationNumber: registrationNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get current user
router.get('/me', auth(), async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    
    // Get mobile number based on user role
    let mobile = '';
    if (user.role === 'patient') {
      const [patients] = await pool.execute(
        'SELECT phone FROM patients WHERE user_id = ?',
        [user.id]
      );
      mobile = patients.length > 0 ? patients[0].phone : '';
    } else if (user.role === 'staff') {
      const [staff] = await pool.execute(
        'SELECT phone FROM staff WHERE user_id = ?',
        [user.id]
      );
      mobile = staff.length > 0 ? staff[0].phone : '';
    }

    // Generate registration number based on user ID
    const registrationNumber = `REG${user.id.toString().padStart(6, '0')}`;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: mobile,
      registrationNumber: registrationNumber
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
