# Sticky Notes - Full Stack API Project

Sticky Notes is a RESTful API application that allows users to register, login, and manage personal sticky notes. This project demonstrates a full-stack implementation using Node.js, Express, MongoDB, and a multi-page vanilla JavaScript frontend.

## 📁 Folder Structure

```text
sticky-notes/
├── app.js                     # Entry point — Express app setup
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables (secrets)
├── README.md                  # Project documentation
│
├── config/
│   └── db.js                  # MongoDB connection logic (Mongoose)
│
├── models/
│   ├── user.model.js          # User schema + Bcrypt & CryptoJS hooks
│   └── note.model.js          # Note schema + custom title validator
│
├── middleware/
│   └── auth.middleware.js     # JWT token verification middleware
│
├── controllers/
│   ├── user.controller.js     # User business logic (Login, Signup, CRUD)
│   └── note.controller.js     # Note business logic (CRUD, Aggregation, Pagination)
│
├── routes/
│   ├── user.routes.js         # /users/* endpoint definitions
│   └── note.routes.js         # /notes/* endpoint definitions
│
└── frontend/                  # Frontend implementation
    ├── index.html             # Entry (redirects to login)
    ├── login.html             # Login page
    ├── signup.html            # Registration page
    ├── home.html              # Main dashboard
    ├── main.js                # Shared API interaction logic
    └── style.css              # Frontend styling
```

## 🌐 Frontend

The frontend is built using **HTML5**, **Bootstrap 5**, and **Vanilla JavaScript**. It is split into separate pages for a cleaner user experience:

- **Signup/Login**: Handles authentication and stores JWT tokens in `localStorage`.
- **Home Dashboard**: Allows users to create, view, edit (via modal), and delete notes.
- **Search & Bulk Actions**: Users can search for notes by title (case-insensitive) and perform bulk updates or deletions.
- **CORS Enabled**: The backend includes `cors` middleware to allow the frontend to safely communicate with the API.

## ⚙️ Backend

The backend is a robust REST API built with **Node.js** and **Express**.

- **Authentication**: Uses **JWT (JSON Web Tokens)**. All note-related endpoints are protected.
- **Security**:
  - **Bcryptjs**: Used for hashing user passwords before saving them to the database.
  - **CryptoJS**: Used to AES-encrypt user phone numbers for sensitive data protection.
- **Validation**: Mongoose schemas include built-in and custom validators (e.g., age range 18-60, and title cannot be entirely uppercase).

## 📊 Database (DB)

- **Engine**: MongoDB with **Mongoose ODM**.
- **Collections**:
  - **Users**: Stores user profiles (name, email, hashed password, encrypted phone, age).
  - **Notes**: Stores notes linked to users via `ObjectId` references.
- **Advanced Features**:
  - **Populate**: Used to join note data with user email.
  - **Aggregation Pipeline**: Used for complex searches and joining user data for a complete view.

## 🚀 API Endpoints

### Users

| Method | Endpoint        | Auth | Description                |
| :----- | :-------------- | :--- | :------------------------- |
| POST   | `/users/signup` | No   | Register a new user        |
| POST   | `/users/login`  | No   | Authenticate and get token |
| GET    | `/users`        | Yes  | Get logged-in user profile |
| PATCH  | `/users`        | Yes  | Update user information    |
| DELETE | `/users`        | Yes  | Delete user account        |

### Notes

| Method | Endpoint                 | Auth | Description                          |
| :----- | :----------------------- | :--- | :----------------------------------- |
| POST   | `/notes`                 | Yes  | Create a single note                 |
| PATCH  | `/notes/:noteId`         | Yes  | Update a note (owner only)           |
| PUT    | `/notes/replace/:noteId` | Yes  | Replace entire note (owner only)     |
| PATCH  | `/notes/all`             | Yes  | Update all note titles               |
| DELETE | `/notes/:noteId`         | Yes  | Delete a note (owner only)           |
| GET    | `/notes/paginate-sort`   | Yes  | Paginated & Sorted notes (DESC)      |
| GET    | `/notes/:id`             | Yes  | Get note by ID (owner only)          |
| GET    | `/notes/note-by-content` | Yes  | Get note by exact content            |
| GET    | `/notes/note-with-user`  | Yes  | Notes with user email (Populate)     |
| GET    | `/notes/aggregate`       | Yes  | Aggregation: Search + Join User info |
| DELETE | `/notes`                 | Yes  | Delete all user notes                |

## 🛠️ Installation

1. `npm install`
2. Create `.env` file with `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CRYPTO_SECRET`.
3. `npm start`

## 🔗 Postman Collection

- [Postman Collection](https://mostafasameer858-6449746.postman.co/workspace/Mostafa-Sameer-kamel-kotb's-Wor~64586934-aefe-4252-853e-43a96fad9221/collection/49870838-a9cf78c1-cea0-4a23-9207-14c698c3da2a?action=share&creator=49870838&active-environment=49870838-b0bc98a6-830e-4199-9518-070fbdf74c39)
