document.querySelector('form').onsubmit = async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Logging in...';
    loadingIndicator.className = 'loading-indicator';
    document.body.appendChild(loadingIndicator);

    try {
        const response = await fetch('http://localhost:3019/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Remove loading indicator
        document.body.removeChild(loadingIndicator);

        if (response.ok) {
            window.location.href = 'userdashboard.html';
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
        document.body.removeChild(loadingIndicator);
    }
};
