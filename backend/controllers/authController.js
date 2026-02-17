const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please add all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            success: true,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid user data" });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            success: true,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid credentials" });
    }
};

// @desc    Setup Admin User (One-time)
// @route   GET /api/auth/setup-admin
// @access  Public
const setupAdmin = async (req, res) => {
    try {
        const adminEmail = "admin@example.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            // Force update role to admin just in case they registered manually
            adminExists.role = "admin";
            await adminExists.save();
            return res.status(200).json({ success: true, message: "Admin account exists. Role updated to 'admin'." });
        }

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        await User.create({
            name: "Admin User",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });

        res.status(201).json({ success: true, message: "Admin account created. Login with admin@example.com / admin123" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    setupAdmin,
};
