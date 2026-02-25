const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 60
    }
});

// Pre-save hook for password hashing and phone encryption
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    if (this.isModified('phone')) {
        this.phone = CryptoJS.AES.encrypt(this.phone, process.env.CRYPTO_SECRET).toString();
    }

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
