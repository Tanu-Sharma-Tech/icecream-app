fetch('https://sweet-movement-api.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Origin': 'https://sweet-movement.vercel.app'
  },
  body: JSON.stringify({ name: 'pooja', email: 'pooja216979@gmail.com', password: 'password123' })
}).then(res => res.json()).then(console.log).catch(console.error);
