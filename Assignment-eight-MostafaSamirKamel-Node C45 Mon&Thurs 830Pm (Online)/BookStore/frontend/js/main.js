const BASE_URL = 'http://localhost:3000';
let allBooks = [];
let allAuthors = [];
let allLogs = [];

// Navigation Logic
function switchSection(sectionId, element) {
    document.querySelectorAll('.section-container').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('section-title').textContent = element.textContent.trim();

    // Update floating action button
    const addBtn = document.getElementById('add-btn');
    if (sectionId === 'bookshelf' || sectionId === 'dashboard') {
        addBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i> Add New Book';
        addBtn.setAttribute('data-bs-target', '#addBookModal');
        addBtn.style.display = 'block';
    } else if (sectionId === 'authors') {
        addBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i> Add New Author';
        addBtn.setAttribute('data-bs-target', '#addAuthorModal');
        addBtn.style.display = 'block';
    } else {
        addBtn.style.display = 'none';
    }

    if (sectionId === 'analytics') {
        const firstBtn = document.querySelector('.btn-group .btn');
        if (firstBtn) runAdvancedReport('aggregate1', firstBtn);
    }
}

// Data Handling
async function refreshData() {
    try {
        const [booksRes, authorsRes, logsRes] = await Promise.all([
            fetch(`${BASE_URL}/books`),
            fetch(`${BASE_URL}/authors`),
            fetch(`${BASE_URL}/logs`)
        ]);

        allBooks = await booksRes.json();
        allAuthors = await authorsRes.json();
        allLogs = await logsRes.json();

        updateStats();
        renderTables();
    } catch (error) {
        console.error('Failed to refresh data:', error);
    }
}

function updateStats() {
    document.getElementById('stat-total-books').textContent = allBooks.length;
    document.getElementById('stat-total-authors').textContent = allAuthors.size || new Set(allBooks.map(b => b.author)).size;
    // Actually use the authors collection count if possible
    document.getElementById('stat-total-authors').textContent = allAuthors.length;
    document.getElementById('stat-total-logs').textContent = allLogs.length;
}

function renderTables() {
    renderBooksTables();
    renderAuthorsTable();
    renderLogsTable();
}

function renderBooksTables(data = allBooks) {
    const recentTable = document.getElementById('recent-books-table');
    const bookshelfTable = document.getElementById('bookshelf-table');

    const rows = data.map(book => `
        <tr>
            <td><div class="fw-bold text-dark">${book.title}</div></td>
            <td>${book.author}</td>
            <td><span class="badge bg-light text-dark fw-normal">${book.year}</span></td>
            <td>${(book.genres || []).map(g => `<span class="genre-badge">${g}</span>`).join('')}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteBook('${book._id}')">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        </tr>
    `).join('');

    bookshelfTable.innerHTML = rows || '<tr><td colspan="5" class="text-center py-4 text-muted">No books found in inventory</td></tr>';

    const recentRows = [...data].reverse().slice(0, 5).map(book => `
        <tr>
            <td><div class="fw-bold text-dark">${book.title}</div></td>
            <td>${book.author}</td>
            <td><span class="badge bg-light text-dark fw-normal">${book.year}</span></td>
            <td>${(book.genres || []).map(g => `<span class="genre-badge">${g}</span>`).join('')}</td>
            <td><button class="btn btn-sm btn-outline-danger border-0" onclick="deleteBook('${book._id}')"><i class="bi bi-trash3"></i></button></td>
        </tr>
    `).join('');
    recentTable.innerHTML = recentRows || '<tr><td colspan="5" class="text-center py-4 text-muted">No recent activity</td></tr>';
}

function renderAuthorsTable(data = allAuthors) {
    const table = document.getElementById('authors-table');
    const rows = data.map(author => `
        <tr>
            <td><div class="fw-bold text-dark">${author.name}</div></td>
            <td>${author.nationality}</td>
            <td>${allBooks.filter(b => b.author === author.name).length} books</td>
            <td>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteAuthor('${author._id}')">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        </tr>
    `).join('');
    table.innerHTML = rows || '<tr><td colspan="4" class="text-center py-4 text-muted">No authors registered</td></tr>';
}

function renderLogsTable(data = allLogs) {
    const table = document.getElementById('logs-table');
    const rows = [...data].reverse().map(log => `
        <tr>
            <td><span class="badge bg-info-subtle text-info">${log.action || 'system_event'}</span></td>
            <td><code class="small">${log.book_id || 'N/A'}</code></td>
            <td class="text-muted small">${new Date().toLocaleString()}</td> <!-- Capped logs usually don't have timestamp unless added -->
            <td>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteLog('${log._id}')">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        </tr>
    `).join('');
    table.innerHTML = rows || '<tr><td colspan="4" class="text-center py-4 text-muted">No activity logs found</td></tr>';
}

// Filtering
function filterBooks(query) {
    const filtered = allBooks.filter(b =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())
    );
    renderBooksTables(filtered);
}

function filterAuthors(query) {
    const filtered = allAuthors.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
    renderAuthorsTable(filtered);
}

// Actions
async function deleteBook(id) {
    if (!confirm('Permanently remove this book?')) return;
    await performDelete('books', id);
}

async function deleteAuthor(id) {
    if (!confirm('Remove this author?')) return;
    await performDelete('authors', id);
}

async function deleteLog(id) {
    await performDelete('logs', id);
}

async function performDelete(collection, id) {
    try {
        const res = await fetch(`${BASE_URL}/${collection}/${id}`, { method: 'DELETE' });
        if (res.ok) refreshData();
    } catch (e) {
        alert('Delete failed');
    }
}

// Form Submissions
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        author: formData.get('author'),
        year: parseInt(formData.get('year')),
        genres: formData.get('genres').split(',').map(g => g.trim()).filter(g => g !== "")
    };
    await submitForm('books', data, 'addBookModal', e.target);
});

document.getElementById('addAuthorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        nationality: formData.get('nationality')
    };
    await submitForm('authors', data, 'addAuthorModal', e.target);
});

async function submitForm(endpoint, data, modalId, formElement) {
    try {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
            formElement.reset();

            // Log the action if it's a book
            if (endpoint === 'books') {
                const result = await res.json();
                await fetch(`${BASE_URL}/logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'inserted', book_id: result.insertedId })
                });
            }

            refreshData();
        }
    } catch (error) {
        alert('Server error');
    }
}

// Advanced Reports
async function runAdvancedReport(endpoint, btnElement) {
    document.querySelectorAll('.btn-group .btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    try {
        const res = await fetch(`${BASE_URL}/books/${endpoint}`);
        const data = await res.json();

        const head = document.getElementById('report-table-head');
        const body = document.getElementById('report-table-body');

        if (endpoint === 'aggregate1') {
            head.innerHTML = `<tr><th>Title</th><th>Author</th><th>Year</th></tr>`;
            body.innerHTML = data.map(item => `
                <tr><td class="fw-bold">${item.title}</td><td>${item.author}</td><td><span class="badge bg-primary-subtle text-primary">${item.year}</span></td></tr>
            `).join('');
        } else if (endpoint === 'aggregate3') {
            head.innerHTML = `<tr><th>Genre</th><th>Book Title</th></tr>`;
            body.innerHTML = data.map(item => `
                <tr><td><span class="genre-badge bg-info-subtle text-info border-info">${item.genres}</span></td><td class="fw-bold">${item.title}</td></tr>
            `).join('');
        }
    } catch (error) {
        console.error('Report failed:', error);
    }
}

// Init
window.onload = () => { refreshData(); };
