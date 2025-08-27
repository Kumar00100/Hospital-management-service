const fetch = require('node-fetch');

const testMeEndpoint = async () => {
  const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with a valid token
  const response = await fetch('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log('Response from /me endpoint:', data);
};

testMeEndpoint();
