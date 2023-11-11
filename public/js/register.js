// public/js.register.js:
document.querySelector('form[action="/auth/register"]').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Gather the data from the form
  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  // Check if all fields are filled
  if (username && email && password) {
    // Send the username, email, and password to the server
    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Handle the response from the server
    if (response.ok) {
      // If successful, redirect the browser to the dashboard
      document.location.replace('/dashboard');
    } else {
      // Alert the user if the sign-up fails
      alert('Failed to sign up');
    }
  }
});
