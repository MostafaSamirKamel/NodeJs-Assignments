# 🌊 PostStream

[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**PostStream** is a high-performance, full-stack micro-blogging platform built as part of an advanced Node.js assignment. It features a robust **Sequelize ORM** backend and a sleek, minimalist **Frontend** designed for seamless user interaction.

---

## 🏗️ System Architecture

### 🛡️ Backend Features

- **Modular Design**: Clean separation of concerns with controllers, routers, and models.
- **Advanced Validation**: Built-in and custom Sequelize validators for data integrity.
- **Paranoid Mode**: Implemented soft-deletion for data safety.
- **CORS Integration**: Secure cross-origin communication enabled.

### 📊 Database Schema (MySQL)

#### **Users Table**

| Column      | Type                    | Constraints                            |
| :---------- | :---------------------- | :------------------------------------- |
| `id`        | `INT`                   | Primary Key, Auto Increment            |
| `name`      | `VARCHAR(255)`          | NOT NULL, Min Length: 3                |
| `email`     | `VARCHAR(255)`          | NOT NULL, UNIQUE, `isEmail` Validation |
| `password`  | `VARCHAR(255)`          | NOT NULL, Min Length: 7                |
| `role`      | `ENUM('user', 'admin')` | Default: `user`                        |
| `createdAt` | `DATETIME`              | Automatic                              |
| `updatedAt` | `DATETIME`              | Automatic                              |

#### **Posts Table**

| Column      | Type           | Constraints                     |
| :---------- | :------------- | :------------------------------ |
| `id`        | `INT`          | Primary Key, Auto Increment     |
| `title`     | `VARCHAR(255)` | NOT NULL                        |
| `content`   | `TEXT`         | NOT NULL                        |
| `userId`    | `INT`          | Foreign Key (belongsTo `Users`) |
| `createdAt` | `DATETIME`     | Automatic                       |
| `updatedAt` | `DATETIME`     | Automatic                       |
| `deletedAt` | `DATETIME`     | **Paranoid** (Soft Delete)      |

#### **Comments Table**

| Column      | Type       | Constraints                     |
| :---------- | :--------- | :------------------------------ |
| `id`        | `INT`      | Primary Key, Auto Increment     |
| `content`   | `TEXT`     | NOT NULL                        |
| `postId`    | `INT`      | Foreign Key (belongsTo `Posts`) |
| `userId`    | `INT`      | Foreign Key (belongsTo `Users`) |
| `createdAt` | `DATETIME` | Automatic                       |
| `updatedAt` | `DATETIME` | Automatic                       |

---

## 🔌 API Reference

### 👤 User Operations

| Method | Endpoint          | Description                                         |
| :----- | :---------------- | :-------------------------------------------------- |
| `POST` | `/users/signup`   | Register a new user with validation (build & save). |
| `PUT`  | `/users/:id`      | Upsert user by PK (Create or Update).               |
| `GET`  | `/users/by-email` | Find user details via email query.                  |
| `GET`  | `/user/:id`       | Retrieve user by PK (Role excluded).                |

### 📝 Post Operations

| Method   | Endpoint               | Description                                         |
| :------- | :--------------------- | :-------------------------------------------------- |
| `POST`   | `/posts`               | Create a new post instance and save.                |
| `DELETE` | `/posts/:postId`       | Soft-delete post (Ownership verified via `userId`). |
| `GET`    | `/posts/details`       | List all posts including User and Comments info.    |
| `GET`    | `/posts/comment-count` | Aggregate list of posts with total comment count.   |

### 💬 Comment Operations

| Method  | Endpoint                   | Description                                    |
| :------ | :------------------------- | :--------------------------------------------- |
| `POST`  | `/comments`                | Bulk create multiple comments (BulkCreate).    |
| `PATCH` | `/comments/:commentId`     | Update comment content (Owner-only).           |
| `POST`  | `/comments/find-or-create` | Find existing or create new comment.           |
| `GET`   | `/comments/search`         | Search comments by word (`findAndCountAll`).   |
| `GET`   | `/comments/newest/:postId` | Order by `createdAt` DESC, Limit 3.            |
| `GET`   | `/comments/details/:id`    | Get comment with nested Post and User details. |

---

## 📂 Project Structure

```bash
PostStream/
├── 📁 src/
│   ├── 📁 db/             # Connection configuration
│   │   └── connection.js
│   ├── 📁 models/         # Sequelize model definitions
│   │   ├── index.js       # Association handling
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── comment.model.js
│   └── 📁 modules/        # Business logic & Routes
│       ├── 📁 users/
│       ├── 📁 posts/
│       └── 📁 comments/
├── 📁 frontend/           # UI Implementation
│   ├── 📁 css/            # Organized stylesheets
│   ├── 📁 js/             # Interactive logic
│   └── *.html             # Structual pages
├── index.js               # Entry point
└── package.json           # Dependencies & Scripts
```

---

## 🎨 Frontend Design Principles

- **Clean Aesthetic**: A minimalist light theme using variable-driven CSS.
- **Responsive**: Fully compatible with mobile and desktop views via Bootstrap 5.
- **User-Centric**: Clear feedback loops for login, signup, and post creation.

---

## 🚀 How to Start

> [!IMPORTANT]
> Ensure you have **MySQL** installed and a database named `assignment7` created before starting.

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Launch Application**

   ```bash
   npm run dev
   ```

3. **Explore**
   - Head to `frontend/index.html` to start your session.
   - Use `frontend/tester.html` for technical API auditing.

---

## 📬 Postman Collection
🔗 [Open Postman Collection](https://mostafasameer858-6449746.postman.co/workspace/Mostafa-Sameer-kamel-kotb's-Wor~64586934-aefe-4252-853e-43a96fad9221/collection/49870838-4b23df8d-40d9-4925-9f2e-26c478a60378?action=share&creator=49870838&active-environment=49870838-b0bc98a6-830e-4199-9518-070fbdf74c39)

_Created by Mostafa Samir Kamel -_
