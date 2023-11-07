// public/js/login.js:
document.querySelector('form[action="/api/users/login"]').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Gather the data from the form
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (email && password) {
      // Send the e-mail and password to the server
      const response = await fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
          // If successful, redirect the browser to the dashboard
          document.location.replace('/dashboard');
      } else {
          alert('Failed to log in');
      }
  }
});

  