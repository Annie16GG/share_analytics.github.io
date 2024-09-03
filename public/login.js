document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
    console.log(data);
  
    if (response.ok) {
      // Guardar token de autenticación y rol en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role); // Guardar el rol del usuario
      localStorage.setItem('user_id', data.userId); 
      console.log(data.rol);
      console.log(data.token);
      console.log(data.userId);
      // Redirigir al usuario al dashboard en la misma pestaña
      window.location.href = '../dashboard/dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while logging in. Please try again.');
  }
});
