document.addEventListener('DOMContentLoaded', function() {
    // Toggle active class for sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebarLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Redirect to specific pages on button click
    document.querySelector('.btn-blue').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'viewcomplement.html'; // Replace with your URL
    });

    document.querySelector('.btn-green').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'raisecomplaint.html'; // Replace with your URL
    });

    document.querySelector('.btn-yellow').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'profile.html'; // Replace with your URL
    });

    document.querySelector('.btn-red').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'settings.html'; // Replace with your URL
    });
});
