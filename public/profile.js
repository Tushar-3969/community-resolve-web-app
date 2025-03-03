// profile.js
async function fetchUserProfile() {
    try {
        const response = await fetch('/api/users/profile'); // Adjust the endpoint as needed
        if (!response.ok) throw new Error('Failed to fetch profile data');

        const data = await response.json();
        document.getElementById('username').textContent = data.username;
        document.getElementById('password').textContent = data.password; // Display the password
        document.querySelector('.phone-number').textContent = data.phone || 'N/A';
        document.querySelector('.email-address a').textContent = data.email;
        document.querySelector('.email-address a').href = `mailto:${data.email}`;
        document.querySelector('.state span').textContent = data.state || 'N/A';
        document.querySelector('.address span').textContent = data.city || 'N/A';
    } catch (error) {
        console.error('Error loading profile data:', error);
        alert('Error loading profile data. Please try again later.');
    }
}

function logout() {
    // Clear session data and redirect to login
    localStorage.clear(); // or sessionStorage.clear();
    window.location.href = 'userlogin.html';
}

// Fetch the user profile when the page loads
document.addEventListener('DOMContentLoaded', fetchUserProfile);
