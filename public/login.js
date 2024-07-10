async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  
    if (response.ok) {
      alert('Login successful');
    } else {
      alert('Invalid credentials');
    }
  }
  