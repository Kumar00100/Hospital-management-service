const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { 
  auth, 
  rateLimitLogin, 
  validateSession, 
  logout, 
  securityHeaders, 
  validateInput 
} = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const feedbackRoutes = require('./routes/feedbacks');
const galleryRoutes = require('./routes/gallery');

dotenv.config({ path: './config.env' });

const app = express();

// ✅ Security middleware
app.use(securityHeaders);
app.use(validateInput);

// ✅ CORS setup
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Body parser limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running', 
    timestamp: new Date().toISOString(), 
    environment: process.env.NODE_ENV || 'development' 
  });
});

// ✅ API Routes
app.use('/api/auth', rateLimitLogin, authRoutes);
app.use('/api/users', userRoutes); // No authentication required for users
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', auth(), validateSession, patientRoutes);
app.use('/api/appointments', auth(), validateSession, appointmentRoutes);
app.use('/api/prescriptions', auth(), validateSession, prescriptionRoutes);
app.use('/api/feedbacks', auth(), validateSession, feedbackRoutes);
app.use('/api/gallery', galleryRoutes); // Public access

// ✅ Logout
app.post('/api/auth/logout', auth(), logout, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ✅ Refresh token
app.post('/api/auth/refresh', auth(), validateSession, (req, res) => {
  try {
    const token = require('jsonwebtoken').sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: req.user.id, email: req.user.email, role: req.user.role } });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
});

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl, method: req.method });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message;
  res.status(err.status || 500).json({ message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
});

// ✅ Start Server with Port Handling
const PORT = process.env.PORT || 3002; // Changed to 3002 to avoid conflict
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// ✅ Handle Port Conflict (EADDRINUSE)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process or set a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});
