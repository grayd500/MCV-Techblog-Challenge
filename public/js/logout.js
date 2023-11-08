// public/js/logout.js
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
  
    // Check if the logoutButton element exists
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
  
        fetch('/api/users/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            if (response.ok) {
              window.location.href = '/login';
            } else {
              // Instead of throwing an error, handle the failed response
              response.text().then(text => {
                console.error('Logout failed:', text);
                alert(text);
              });
            }
          })
          .catch((error) => {
            console.error('Logout error:', error);
            alert('An error occurred while trying to log out.');
          });
      });
    }
  });
  
