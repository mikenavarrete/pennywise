document.addEventListener('DOMContentLoaded', () => {
  const showLoginForm = document.getElementById('showLogin');
  const showSignupForm = document.getElementById('showSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const backFromLogin = document.getElementById('backFromLogin');
  const backFromSignup = document.getElementById('backFromSignup');
  const buttonsContainer = document.getElementById('buttonsContainer');

  // Function to toggle visibility
  function toggleVisibility(element, show) {
    element.style.display = show ? 'block' : 'none';
  }

  // Show login form
  showLoginForm.addEventListener('click', () => {
    toggleVisibility(buttonsContainer, false);
    toggleVisibility(loginForm, true);
    toggleVisibility(signupForm, false);
  });

  // Show signup form
  showSignupForm.addEventListener('click', () => {
    toggleVisibility(buttonsContainer, false);
    toggleVisibility(signupForm, true);
    toggleVisibility(loginForm, false);
  });

  // Return to initial buttons view from login
  backFromLogin.addEventListener('click', () => {
    toggleVisibility(loginForm, false);
    toggleVisibility(buttonsContainer, true);
  });

  // Return to initial buttons view from signup
  backFromSignup.addEventListener('click', () => {
    toggleVisibility(signupForm, false);
    toggleVisibility(buttonsContainer, true);
  });

  // Login form submission handling
  document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    // Here, implement your API call for login
    console.log('Logging in...', { email, password });
    // Example: redirect on success
    // window.location.href = '/profile';
  });

  // Signup form submission handling
  document.querySelector('.signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // Here, implement your API call for signup
    console.log('Signing up...', { name, email, password });
    // Example: redirect on success
    // window.location.href = '/profile';
  });
});
