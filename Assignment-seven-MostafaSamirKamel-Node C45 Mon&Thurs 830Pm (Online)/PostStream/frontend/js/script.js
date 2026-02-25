const API_BASE = 'http://localhost:3000';

const showSection = (section) => {
    document.querySelectorAll('.api-section').forEach(s => s.classList.add('d-none'));
    document.getElementById(`${section}-section`).classList.remove('d-none');
    
    document.querySelectorAll('.list-group-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(section.substring(0, 4))) {
            btn.classList.add('active');
        }
    });
};

const displayResponse = (data) => {
    const area = document.getElementById('responseArea');
    area.innerText = JSON.stringify(data, null, 2);
    area.scrollTop = 0;
};

// USER APIS
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPass').value,
        role: document.getElementById('regRole').value
    };
    try {
        const res = await fetch(`${API_BASE}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        displayResponse(await res.json());
    } catch (err) { displayResponse(err.message); }
});

document.getElementById('upsertForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('upId').value;
    const body = {
        name: document.getElementById('upName').value,
        email: document.getElementById('upEmail').value,
        role: document.getElementById('upRole').value
    };
    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        displayResponse(await res.json());
    } catch (err) { displayResponse(err.message); }
});

const handleSearchByEmail = async () => {
    const email = document.getElementById('searchEmail').value;
    const res = await fetch(`${API_BASE}/users/by-email?email=${email}`);
    displayResponse(await res.json());
};

const handleSearchById = async () => {
    const id = document.getElementById('searchId').value;
    const res = await fetch(`${API_BASE}/user/${id}`);
    displayResponse(await res.json());
};

// POST APIS
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        userId: document.getElementById('postUserId').value
    };
    const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    displayResponse(await res.json());
});

document.getElementById('deletePostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const postId = document.getElementById('delPostId').value;
    const userId = document.getElementById('delUserId').value;
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
    displayResponse(await res.json());
});

const fetchPostDetails = async () => {
    const res = await fetch(`${API_BASE}/posts/details`);
    displayResponse(await res.json());
};

const fetchCommentCount = async () => {
    const res = await fetch(`${API_BASE}/posts/comment-count`);
    displayResponse(await res.json());
};

// COMMENT APIS
const handleBulkComments = async () => {
    const comments = JSON.parse(document.getElementById('bulkComments').value);
    const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments })
    });
    displayResponse(await res.json());
};

const handleUpdateComment = async () => {
    const id = document.getElementById('upCommentId').value;
    const userId = document.getElementById('upCommentUserId').value;
    const content = document.getElementById('upCommentContent').value;
    const res = await fetch(`${API_BASE}/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content })
    });
    displayResponse(await res.json());
};

const searchComments = async () => {
    const word = document.getElementById('commentWord').value;
    const res = await fetch(`${API_BASE}/comments/search?word=${word}`);
    displayResponse(await res.json());
};

const getNewestComments = async () => {
    const postId = document.getElementById('newestPostId').value;
    const res = await fetch(`${API_BASE}/comments/newest/${postId}`);
    displayResponse(await res.json());
};
