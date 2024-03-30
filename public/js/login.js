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

  if (showLoginForm && loginForm) {
    showLoginForm.addEventListener('click', () => {
      hideElement(buttonsContainer);
      showElement(loginForm);
    });
  }

  if (showSignupForm && signupForm) {
    showSignupForm.addEventListener('click', () => {
      hideElement(buttonsContainer);
      showElement(signupForm);
    });
  }

  if (backFromLogin && buttonsContainer && loginForm) {
    backFromLogin.addEventListener('click', () => {
      showElement(buttonsContainer);
      hideElement(loginForm);
    });
  }

  if (backFromSignup && buttonsContainer && signupForm) {
    backFromSignup.addEventListener('click', () => {
      showElement(buttonsContainer);
      hideElement(signupForm);
    });
  }

  // Login form submission handling
  const loginFormEl = document.querySelector('.login-form');
  if (loginFormEl) {
    loginFormEl.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.querySelector('#email-login').value.trim();
      const password = document.querySelector('#password-login').value.trim();

      if (email && password) {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          document.location.replace('/dashboard');
        } else {
          alert(response.statusText);
        }
      }
    });
  }

  // Signup form submission handling
  const signupFormEl = document.querySelector('.signup-form');
  if (signupFormEl) {
    signupFormEl.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.querySelector('#name-signup').value.trim();
      const email = document.querySelector('#email-signup').value.trim();
      const password = document.querySelector('#password-signup').value.trim();

      if (username && email && password) {
        const response = await fetch('/api/user/signup', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          document.location.replace('/dashboard');
        } else {
          alert(response.statusText);
        }
      }
    });
  }
});
