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

    if (email && password) {
      // Send a POST request to the API endpoint
      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the dashboard page
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  });

  // Signup form submission handling
  document.querySelector('.signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const username = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && email && password) {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status===200) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  });

  // document
  //   .querySelector('.login-form')
  //   .addEventListener('submit', loginFormHandler);
