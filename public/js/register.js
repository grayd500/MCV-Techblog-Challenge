// public/js.register.js:
document.querySelector('form[action="/auth/register"]').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Gather the data from the form
  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && email && password) {
    // Send the username, email, and password to the server
    const response = await fetch('/api/users/register', { // Updated this line
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the dashboard
      document.location.replace('/dashboard');
    } else {
      alert('Failed to sign up');
    }
  }
});
document.querySelector('form[action="/api/users/register"]').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && email && password) {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to sign up');
    }
  }
});
