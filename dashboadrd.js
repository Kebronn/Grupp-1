document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user role from localStorage
    const role = localStorage.getItem('role');
    const welcomeMessage = document.getElementById('welcome-message');

    // Display welcome message based on user role
    if (role === 'arbetsokande') {
        welcomeMessage.textContent = 'Välkommen arbetare';
    } else if (role === 'arbetsgivare') {
        welcomeMessage.textContent = 'Välkommen arbetsgivare';
    } else {
        welcomeMessage.textContent = 'Unknown role';
    }
});
