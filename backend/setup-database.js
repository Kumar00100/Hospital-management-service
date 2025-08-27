const mysql = require('mysql2/promise');
require('dotenv').config();

// Common MySQL passwords to try
const commonPasswords = ['', 'password', 'root', 'admin', '123456', 'mysql'];

// Database connection without specifying database (to create it)
const createConnection = async (password = '') => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: password || process.env.DB_PASSWORD || '',
    });
    return connection;
  } catch (error) {
    return null;
  }
};

// Try to connect with different passwords
const findWorkingConnection = async () => {
  console.log('🔍 Trying to connect to MySQL...');
  
  // First try with environment variable
  if (process.env.DB_PASSWORD) {
    const connection = await createConnection(process.env.DB_PASSWORD);
    if (connection) {
      console.log('✅ Connected using .env password');
      return connection;
    }
  }
  
  // Try common passwords
  for (const password of commonPasswords) {
    console.log(`🔑 Trying password: ${password || '(empty)'}`);
    const connection = await createConnection(password);
    if (connection) {
      console.log(`✅ Connected successfully with password: ${password || '(empty)'}`);
      return connection;
    }
  }
  
  throw new Error('Could not connect to MySQL with any password. Please check your MySQL installation and credentials.');
};

// Create database if it doesn't exist
const createDatabase = async () => {
  try {
    console.log('🔧 Creating database...');
    const connection = await findWorkingConnection();
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'hospital_management'}`);
    console.log('✅ Database created successfully!');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
};

// Run the complete setup
const setupDatabase = async () => {
  try {
    console.log('🚀 Starting Hospital Management System Database Setup...\n');
    
    // Step 1: Create database
    await createDatabase();
    
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with the working password');
    console.log('2. Run: npm run migrate');
    console.log('3. Run: npm run seed');
    console.log('\n🎉 Database setup completed!');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('- Make sure MySQL is running');
    console.log('- Check your MySQL root password');
    console.log('- Try these common passwords: (empty), password, root, admin, 123456');
    console.log('- Or create a new MySQL user with: CREATE USER "hospital"@"localhost" IDENTIFIED BY "password";');
    console.log('- Grant privileges: GRANT ALL PRIVILEGES ON *.* TO "hospital"@"localhost";');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
