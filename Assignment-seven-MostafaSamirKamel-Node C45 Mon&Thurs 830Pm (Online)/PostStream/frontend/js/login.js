const API_BASE = 'http://localhost:3000';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Fetch user details by email
        const response = await fetch(`${API_BASE}/users/by-email?email=${email}`);
        const data = await response.json();

        if (response.ok && data.user) {
            // Verify password (in a real app, this should be done on the backend with hashing)
            if (data.user.password === password) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid password');
            }
        } else {
            alert(data.message || 'User not found');
        }

    } catch (err) {
        alert('Connection error. Is the server running?');
    }
});
