document.querySelector('form').onsubmit = async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const adminUsername = document.getElementById('admin-username').value;
    const adminPassword = document.getElementById('admin-password').value;

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Logging in...';
    loadingIndicator.className = 'loading-indicator'; // Style this as needed
    document.body.appendChild(loadingIndicator);

    try {
        const response = await fetch('http://localhost:3019/api/users/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: adminUsername, password: adminPassword })
        });
        
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);

        if (response.ok) {
            // Redirect after successful admin login
            window.location.href = 'admin.html'; // Adjust the path as necessary
        } else {
            const errorText = await response.text(); // Get the raw response text
            console.error('Error response:', errorText);
            let errorMessage;

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || 'Admin login failed. Please check your credentials.';
            } catch (e) {
                errorMessage = 'Admin login failed. Please check your credentials.';
            }

            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        alert('An error occurred. Please try again later.');
        
        // Remove loading indicator in case of error
        if (document.body.contains(loadingIndicator)) {
            document.body.removeChild(loadingIndicator);
        }
    }
};