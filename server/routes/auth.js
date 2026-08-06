import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const getJwtSecret = () =>
  process.env.JWT_SECRET || "playntric_jwt_super_secret_key_2026";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email address already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, getJwtSecret(), {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ user: user.toJSON() });
  } catch (error) {
    console.error("Fetch Me Error:", error);
    return res.status(500).json({ message: "Server error fetching user profile." });
  }
});

export default router;
