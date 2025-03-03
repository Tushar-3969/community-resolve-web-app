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
      window.location.href = 'viewcomplaint.html'; // Replace with your URL
  });

  document.querySelector('.btn-green').addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = 'complaint.html'; // Replace with your URL
  });

  document.querySelector('.btn-yellow').addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = 'profile.html'; // Replace with your URL
  });
});
