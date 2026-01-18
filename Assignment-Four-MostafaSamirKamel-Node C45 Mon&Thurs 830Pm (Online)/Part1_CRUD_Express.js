// part 1 - Express.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const portNum = 3000;
const filePath = path.join(__dirname, "users.json");

// Middleware to parse JSON
app.use(express.json());

// Helper function to read users from file
async function readUsers() {
    try {
        const data = await fs.readFile(filePath, { encoding: "utf8" });
        return data
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => JSON.parse(line));
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

// Helper function to write users to file
async function writeUsers(users) {
    const data = users.map((user) => JSON.stringify(user)).join("\n") + "\n";
    await fs.writeFile(filePath, data, { encoding: "utf8" });
}

// 1. Create a new user (POST /user)
app.post("/user", async (req, res) => {
    try {
        const newUser = req.body;

        // Validate required fields
        if (!newUser.id || !newUser.email) {
            return res.status(400).json({ 
                message: "id and email are required fields" 
            });
        }

        const users = await readUsers();

        // Check if user with same id or email already exists
        const existingUser = users.find(
            (u) => u.id === newUser.id || u.email === newUser.email
        );

        if (existingUser) {
            return res.status(409).json({
                message: "user with this id or email already exists",
            });
        }

        // Add new user
        users.push(newUser);
        await writeUsers(users);

        res.status(201).json({ 
            message: "user created", 
            user: newUser 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 2. Update user by ID (PATCH /user/:id)
app.patch("/user/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updates = req.body;

        const users = await readUsers();
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ 
                message: "user not found" 
            });
        }

        // Update user with new values
        users[userIndex] = { ...users[userIndex], ...updates, id }; // Preserve id
        await writeUsers(users);

        res.status(200).json({
            message: "user updated",
            user: users[userIndex],
        });
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 3. Delete user by ID (DELETE /user/:id or DELETE /user)
app.delete("/user/:id?", async (req, res) => {
    try {
        // Get id from params or body
        const id = req.params.id 
            ? Number(req.params.id) 
            : req.body.id;

        if (!id) {
            return res.status(400).json({ 
                message: "user id is required" 
            });
        }

        const users = await readUsers();
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ 
                message: "user not found" 
            });
        }

        // Remove user
        const deletedUser = users.splice(userIndex, 1)[0];
        await writeUsers(users);

        res.status(200).json({
            message: "user deleted",
            user: deletedUser,
        });
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 4. Get user by name (GET /user/getByName?name=...)
app.get("/user/getByName", async (req, res) => {
    try {
        const name = req.query.name;

        if (!name) {
            return res.status(400).json({ 
                message: "name query parameter is required" 
            });
        }

        const users = await readUsers();
        const user = users.find((u) => u.name === name);

        if (!user) {
            return res.status(404).json({ 
                message: "user not found" 
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 6. Filter users by minimum age (GET /user/filter?minAge=...)
app.get("/user/filter", async (req, res) => {
    try {
        const minAge = Number(req.query.minAge);

        if (!minAge && minAge !== 0) {
            return res.status(400).json({ 
                message: "minAge query parameter is required" 
            });
        }

        const users = await readUsers();
        const filteredUsers = users.filter((u) => u.age >= minAge);

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 7. Get user by ID (GET /user/:id)
app.get("/user/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const users = await readUsers();
        const user = users.find((u) => u.id === id);

        if (!user) {
            return res.status(404).json({ 
                message: "user not found" 
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 5. Get all users (GET /user)
app.get("/user", async (req, res) => {
    try {
        const users = await readUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ 
            message: "internal server error", 
            error: error.message 
        });
    }
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "route not found" });
});

// Start server
app.listen(portNum, () => {
    console.log(
        `Server is listening on port ${portNum} http://localhost:${portNum}`
    );
});