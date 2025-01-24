
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5501/login', { // Adjust the URL to your server's URL and port
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Login successful');
            // Store some kind of indicator that the user is logged in (like a session token)
            sessionStorage.setItem('isLoggedIn', 'true');
            // Redirect to the expense tracker page
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials, please try again');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem with the login request');
    });
});