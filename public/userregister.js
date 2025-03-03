document.querySelector('form').onsubmit = async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate that passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Separate this out into a function for better management
    await submitForm(username, email, password);
};

async function submitForm(username, email, password) {
    // Sending the registration request
    try {
        const response = await fetch('http://localhost:3019/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { username, email, password } )
        });

        if (response.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = 'userlogin.html';
        } else {
            const errorData = await response.json();
            alert(`Registration failed: ${errorData.error || 'Please try again.'}`);
        }
    } catch (error) {
        console.error('Something went wrong!', error);
        alert('An error occurred. Please try again later.');
    }
}