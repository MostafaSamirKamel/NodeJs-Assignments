const API_URL = 'http://localhost:3000';

/**
 * Common API request helper
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['token'] = token;

    try {
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Something went wrong');
            if (res.status === 401) {
                localStorage.removeItem('token');
                if (!location.pathname.includes('login.html') && !location.pathname.includes('signup.html')) {
                    location.href = 'login.html';
                }
            }
            return null;
        }

        return data;
    } catch (err) {
        console.error('API Error:', err);
        alert('Could not connect to the server. Make sure it is running on http://localhost:3000');
        return null;
    }
}
