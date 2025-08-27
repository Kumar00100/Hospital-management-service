const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          message: 'Access denied. No token provided.',
          code: 'NO_TOKEN'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists and is active
      const [users] = await pool.execute(
        'SELECT id, email, role, status FROM users WHERE id = ? AND status = 1',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({ 
          message: 'User not found or account deactivated.',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = users[0];
      
      // Check if user role matches the token
      if (user.role !== decoded.role) {
        return res.status(401).json({ 
          message: 'Token invalid - role mismatch.',
          code: 'ROLE_MISMATCH'
        });
      }

      // Add user info to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      // Role-based access control
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredRoles: roles,
          userRole: user.role
        });
      }

      // Log successful authentication
      console.log(`✅ Authenticated: ${user.email} (${user.role}) - ${req.method} ${req.path}`);

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired. Please login again.',
          code: 'TOKEN_EXPIRED'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token.',
          code: 'INVALID_TOKEN'
        });
      }
      
      console.error('Auth middleware error:', error);
      res.status(500).json({ 
        message: 'Authentication error.',
        code: 'AUTH_ERROR'
      });
    }
  };
};

// Rate limiting middleware for login
const rateLimitLogin = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 0, firstAttempt: now });
  }
  
  const attempts = loginAttempts.get(ip);
  
  // Check if IP is locked out
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceFirstAttempt = now - attempts.firstAttempt;
    
    if (timeSinceFirstAttempt < LOCKOUT_DURATION) {
      const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceFirstAttempt) / 1000 / 60);
      return res.status(429).json({
        message: `Too many login attempts. Try again in ${remainingTime} minutes.`,
        code: 'RATE_LIMITED',
        remainingTime
      });
    } else {
      // Reset attempts after lockout period
      loginAttempts.set(ip, { count: 0, firstAttempt: now });
    }
  }
  
  next();
};

// Session validation middleware
const validateSession = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    // Check if user session is still valid in database
    const [sessions] = await pool.execute(
      'SELECT last_activity FROM user_sessions WHERE user_id = ? AND is_active = 1',
      [req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(401).json({
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }

    const lastActivity = new Date(sessions[0].last_activity);
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    
    if (Date.now() - lastActivity.getTime() > sessionTimeout) {
      // Deactivate expired session
      await pool.execute(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
        [req.user.id]
      );
      
      return res.status(401).json({
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }

    // Update last activity
    await pool.execute(
      'UPDATE user_sessions SET last_activity = NOW() WHERE user_id = ? AND is_active = 1',
      [req.user.id]
    );

    next();
  } catch (error) {
    console.error('Session validation error:', error);
    next();
  }
};

// Logout middleware
const logout = async (req, res, next) => {
  try {
    if (req.user) {
      // Deactivate all sessions for the user
      await pool.execute(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
        [req.user.id]
      );
      
      console.log(`🔓 Logout: ${req.user.email} (${req.user.role})`);
    }
    next();
  } catch (error) {
    console.error('Logout middleware error:', error);
    next();
  }
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict transport security (for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content security policy (relaxed for dev)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  
  next();
};

// Input validation middleware
const validateInput = (req, res, next) => {
  // Check for SQL injection patterns
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i;
  
  const checkValue = (value) => {
    if (typeof value === 'string' && sqlInjectionPattern.test(value)) {
      return false;
    }
    return true;
  };
  
  const validateObject = (obj) => {
    // Handle null/undefined cases
    if (!obj || typeof obj !== 'object') {
      return true;
    }
    
    try {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          if (!validateObject(value)) return false;
        } else if (!checkValue(value)) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };
  
  // Only validate if the objects exist and are not null
  const bodyValid = !req.body || validateObject(req.body);
  const queryValid = !req.query || validateObject(req.query);
  const paramsValid = !req.params || validateObject(req.params);
  
  if (!bodyValid || !queryValid || !paramsValid) {
    return res.status(400).json({
      message: 'Invalid input detected.',
      code: 'INVALID_INPUT'
    });
  }
  
  next();
};

module.exports = {
  auth,
  rateLimitLogin,
  validateSession,
  logout,
  securityHeaders,
  validateInput
};
