const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// Create connection pool with better error handling
const createPool = () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    idleTimeout: 600000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };

  // If password is empty string, try without password
  if (!config.password) {
    delete config.password;
  }

  return mysql.createPool(config);
};

const pool = createPool();

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Try updating your .env file with the correct MySQL password');
  });

module.exports = pool;
