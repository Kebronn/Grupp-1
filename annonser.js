document.addEventListener('DOMContentLoaded', function() {
    const announcementForm = document.getElementById('announcement-form');

    announcementForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const announcement = document.getElementById('announcement').value;

        // You can send this data to the server using fetch or XMLHttpRequest
        // Example using fetch:
        fetch('/submit_announcement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, role: role, announcement: announcement })
        })
        .then(response => {
            if (response.ok) {
                // Announcement submitted successfully
                alert('Announcement submitted successfully!');
                // Optionally, you can reload the page to display the new announcement
                location.reload();
            } else {
                // Error submitting announcement
                alert('Error submitting announcement. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error submitting announcement:', error);
            alert('Error submitting announcement. Please try again.');
        });
    });
});

