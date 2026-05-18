fetch('https://sweet-movement-api.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Dhananjay', email: 'tanu10122001@gmai.com', password: 'password123' })
}).then(res => res.json()).then(console.log).catch(console.error);
