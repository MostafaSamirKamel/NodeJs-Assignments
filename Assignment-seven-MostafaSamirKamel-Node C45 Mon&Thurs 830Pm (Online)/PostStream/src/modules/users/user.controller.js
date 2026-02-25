const { User } = require('../../models/index');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Use build and save
        const user = User.build({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: "User added successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const upsertUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, role } = req.body; // age is mentioned in assignment but not in model, I'll ignore extra fields or use them if they exist

        // upsert returns [instance, created]
        await User.upsert({ id, name, email, role }, { validate: false });

        res.status(200).json({ message: "User created or updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['role'] }
        });
        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    signup,
    upsertUser,
    getUserByEmail,
    getUserById
};
