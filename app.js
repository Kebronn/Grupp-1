// Client-side JavaScript code

console.log('app.js loaded');

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Send login data to server (example)
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
        if (response.ok) {
            // Redirect user to dashboard or another page
            window.location.href = '/dashboard';
        } else {
            // Display error message to user
            alert('Invalid username or password');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

