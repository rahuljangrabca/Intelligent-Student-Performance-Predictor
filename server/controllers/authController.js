const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE LOGIN / REGISTER
exports.googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        password: Math.random().toString(36).slice(-10), // Random placeholder password
        role: role || 'student', // Fallback to provided role
        avatar: picture
      });
      await user.save();
      console.log(`🌱 New Google user created: ${email} as ${user.role}`);
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("❌ Google Login Error:", err);
    res.status(500).json({ msg: "Google Authentication failed" });
  }
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hashing is now handled in the User model pre-save hook
    const userData = { name, email, password };
    if (role) {
      if (!["student", "teacher"].includes(role)) {
        return res.status(400).json({ msg: "Invalid role specified" });
      }
      userData.role = role;
    }

    user = new User(userData);
    await user.save();

    console.log(`✅ User registered: ${email} (${userData.role || 'student'})`);

    res.status(201).json({ 
      msg: "User registered successfully", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Include role in token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.find({ role }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};