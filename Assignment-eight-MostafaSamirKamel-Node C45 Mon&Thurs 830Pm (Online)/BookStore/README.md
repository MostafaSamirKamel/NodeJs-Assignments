# BookStream | Management System

BookStream is a comprehensive, data-driven Library Management System designed for the modern web. It features a robust Node.js/Express backend integrated with MongoDB, and a premium, responsive dashboard for managing books, authors, and system activity logs.

## 🚀 Features

### Core Management

- **Bookshelf Dashboard**: Real-time overview of library volume and author counts.
- **Inventory Control**: Full CRUD operations for books with instant UI updates.
- **Author Hub**: Manage contributing authors and track their bibliographic details.
- **Audit Trails**: Monitor system activity via a high-performance capped collection for logs.

### Advanced Intelligence

- **Deep Insights**: Custom reports like "Modern Classics" (post-2000) and "Genre Mix" (unwound genres) using MongoDB Aggregation pipelines.
- **Dynamic Search**: Instantly filter through titles or authors across the entire catalog.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Native Driver)
- **Frontend**: HTML5, Vanilla JavaScript, CSS3, Bootstrap 5
- **Icons & Fonts**: Bootstrap Icons, Google Fonts (Outfit)

## 📁 Project Structure

```text
BookStore/
├── frontend/             # Frontend application
│   ├── css/              # Custom styling
│   ├── js/               # Application logic (main.js)
│   └── index.html        # Main dashboard entry
├── src/                  # Backend source code
│   ├── config/           # Database & config setup
│   ├── controllers/      # API logic & handlers
│   └── routes/           # Endpoint definitions
├── .env                  # Environment variables
├── index.js              # Server entry point
├── package.json          # Dependencies & scripts
└── mongosh-solutions.txt # Assignment shell commands
```

## 📡 API Documentation

### Book Endpoints

- `GET /books`: Retrieve the full catalog.
- `POST /books`: Register a new book.
- `DELETE /books/:id`: Permanently remove a book by ID.
- `GET /books/aggregate1`: Filter books published after 2000.
- `GET /books/aggregate3`: Generate a genre distribution report.

### Author Endpoints

- `GET /authors`: Fetch all registered authors.
- `POST /authors`: Add a new contributor.
- `DELETE /authors/:id`: Remove an author entry.

### System Endpoints

- `GET /logs`: View recent activity trail.
- `POST /logs`: Manually insert an activity log.
- `POST /collection/books`: Initialize the books collection with validation.

## 💾 Database Schema

### Books Collection (Explicit Validation)

- `title` (String, Required)
- `author` (String)
- `year` (Int32)
- `genres` (Array of Strings)

### Authors Collection (Implicit)

- `name` (String)
- `nationality` (String)

### Logs Collection (Capped, 1MB)

- `action` (String)
- `book_id` (ObjectId string)

## 🏁 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB running on `localhost:27017`

### Setup

1. Clone the repository and navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment in `.env`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=assignment8
   ```

### Execution

1. Start the backend server:
   ```bash
   node index.js
   ```
2. Launch the Application:
   Open `frontend/index.html` in your preferred web browser.

## 🧪 Testing

Run the automated CLI test suite:

```bash
node test.js
```
