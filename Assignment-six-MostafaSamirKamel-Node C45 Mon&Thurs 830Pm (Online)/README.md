# Assignment Five - Node.js & MySQL

This repository contains the completed Assignment Five, organized into logical sections for design, SQL, and Node.js implementation.

## 📁 Repository Structure

- **[Part-01_Design/](./Part-01_Design/)**: Contains ER Diagrams and Physical Schema Design for the Musicana Records scenario.
- **[Part-02_SQL/](./Part-02_SQL/)**: Includes standalone SQL scripts for the Retail Store database:
  - `01_Schema_and_Inserts.sql`: Initial setup and sample data.
  - `02_Queries.sql`: Solutions for all 16 requirements.
- **[Part-03_Nodejs/](./Part-03_Nodejs/)**: A functional Node.js application that automates the Store database operations:
  - `app.js`: Main execution script.
  - `config/database.js`: Connection pool configuration.
- **[Part-04_Bonus/](./Part-04_Bonus/)**: Solution for the LeetCode bonus problem.

## 🚀 How to Run the Node.js App

1. Navigate to the Node.js directory:
   ```bash
   cd Part-03_Nodejs
   ```
2. Install dependencies (if not already Done):
   ```bash
   npm install
   ```
3. Update database credentials in `config/database.js`.
4. Run the application:
   ```bash
   node app.js
   ```

## 📝 Assignment Requirements

The assignment covers:

- ERD and Schema Mapping.
- DDL/DML/DQL operations in MySQL.
- User management and permissions.
- Node.js integration with `mysql2/promise`.
