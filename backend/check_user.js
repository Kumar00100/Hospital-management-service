const pool = require('./config/database');

async function checkUser() {
  try {
    const [results] = await pool.execute(
      'SELECT id, email, role, status FROM users WHERE email = ?',
      ['admin@hospital.com']
    );
    
    console.log('User status:', results);
    
    if (results.length === 0) {
      console.log('User not found');
    } else {
      const user = results[0];
      console.log(`User: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
    }
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    process.exit();
  }
}

checkUser();
