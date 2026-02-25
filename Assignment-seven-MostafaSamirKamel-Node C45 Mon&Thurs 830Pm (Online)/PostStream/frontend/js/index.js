const API_BASE = 'http://localhost:3000';
let currentUser = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    fetchPosts();
});

function updateUI() {
    const navAction = document.getElementById('navAction');
    const addPostBtn = document.getElementById('addPostBtn');

    if (currentUser) {
        navAction.innerHTML = `
            <span class="me-3 text-muted">Hi, <b>${currentUser.name}</b></span>
            <button onclick="logout()" class="btn btn-outline-danger border-0">Logout</button>
        `;
        addPostBtn.style.display = 'flex';
        addPostBtn.onclick = () => {
            const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
            modal.show();
        };
    }
}

async function fetchPosts() {
    const container = document.getElementById('postsContainer');
    try {
        const response = await fetch(`${API_BASE}/posts/details`);
        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = `<div class="text-center py-5 text-muted">No posts yet. Be the first to share!</div>`;
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">Published by <b>${post.User.name}</b></div>
                <div class="post-content mb-4">${post.content || 'No content provided.'}</div>
                
                <hr class="border-secondary opacity-25">
                
                <div class="comments-section">
                    <h6 class="text-muted small mb-3">Comments (${post.Comments.length})</h6>
                    ${post.Comments.map(c => `
                        <div class="comment-box mb-2">
                            <div class="comment-text">${c.content}</div>
                        </div>
                    `).join('')}
                    
                    ${currentUser ? `
                        <div class="mt-3 d-flex gap-2">
                            <input type="text" class="form-control form-control-sm border-secondary-subtle" placeholder="Write a comment..." id="commentInput-${post.id}">
                            <button onclick="addComment(${post.id})" class="btn btn-primary btn-sm px-3">Reply</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">Error loading posts. Make sure the backend is running at ${API_BASE}</div>`;
    }
}

document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, userId: currentUser.id })
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('createPostModal')).hide();
            fetchPosts();
        }
    } catch (err) {
        alert('Error creating post');
    }
});

async function addComment(postId) {
    const input = document.getElementById(`commentInput-${postId}`);
    const content = input.value;
    if (!content) return;

    try {
        // Using Find or Create Comment for variety, or just create bulk with one item
        await fetch(`${API_BASE}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comments: [{ content, postId, userId: currentUser.id }]
            })
        });
        input.value = '';
        fetchPosts();
    } catch (err) {
        alert('Error adding comment');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.reload();
}
