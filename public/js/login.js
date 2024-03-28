document.addEventListener('DOMContentLoaded', () => {
  const showLoginForm = document.getElementById('showLogin');
  const showSignupForm = document.getElementById('showSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const backFromLogin = document.getElementById('backFromLogin');
  const backFromSignup = document.getElementById('backFromSignup');
  const buttonsContainer = document.getElementById('buttonsContainer');

  function hideElement(element) {
    element.classList.add('d-none');
  }

  function showElement(element) {
    element.classList.remove('d-none');
  }

  showLoginForm.addEventListener('click', () => {
    hideElement(buttonsContainer);
    showElement(loginForm);
  });

  showSignupForm.addEventListener('click', () => {
    hideElement(buttonsContainer);
    showElement(signupForm);
  });

  backFromLogin.addEventListener('click', () => {
    showElement(buttonsContainer);
    hideElement(loginForm);
  });

  backFromSignup.addEventListener('click', () => {
    showElement(buttonsContainer);
    hideElement(signupForm);
  });
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
;
