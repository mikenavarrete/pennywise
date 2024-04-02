document.addEventListener('DOMContentLoaded', (event) => {
  const logoutButton = document.querySelector('#logout');
  
  const logout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to log out.');
      }
    } catch (error) {
      console.error('Logout Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  } else {
    console.log('Logout button not found.');
  }
});
