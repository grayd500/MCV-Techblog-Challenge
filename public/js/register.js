// public/js/register.js:
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[action="/auth/register"]');
  const passwordInput = document.querySelector('#password');

  passwordInput.addEventListener('input', (event) => {
    evaluatePasswordStrength(event.target.value);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = passwordInput.value.trim();

    // Check if the password is strong enough
    if (!isPasswordStrong(password)) {
      alert('Password is not strong enough. Please use a stronger password.');
      return;
    }

    // Check if all fields are filled
    if (username && email && password) {
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          document.location.replace('/dashboard');
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to sign up');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please fill in all fields.');
    }
  });
});

function isPasswordStrong(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLengthy = password.length >= 8;

  const requiredCriteria = 3;
  const metCriteria = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars, isLengthy].filter(Boolean).length;

  return metCriteria >= requiredCriteria;
}

function evaluatePasswordStrength(password) {
  const strengthMessage = document.querySelector('#password-strength-message');
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLengthy = password.length >= 8;

  const requiredCriteria = 3;
  const metCriteria = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars, isLengthy].filter(Boolean).length;

  if (metCriteria < requiredCriteria) {
    strengthMessage.textContent = 'Password is too weak';
    strengthMessage.style.color = 'red';
  } else if (metCriteria === requiredCriteria) {
    strengthMessage.textContent = 'Password is moderate';
    strengthMessage.style.color = 'orange';
  } else {
    strengthMessage.textContent = 'Password is strong';
    strengthMessage.style.color = 'green';
  }
}


