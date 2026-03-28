const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // ❌ validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json("All fields are required");
    }

    // ❌ check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // ✅ hash password
    const hash = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = new User({
      name,
      email,
      phone,
      password: hash
    });

    await user.save();

    res.json("User registered successfully");

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json("Server error");
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❌ validation
    if (!email || !password) {
      return res.status(400).json("Email and password required");
    }

    // ❌ find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("User not found");
    }

    // ❌ check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json("Wrong password");
    }

    // ✅ JWT TOKEN (THIS IS WHAT YOU ASKED)
    const token = jwt.sign(
      { id: user._id },          // payload
      process.env.JWT_SECRET,   // secret key
      { expiresIn: "7d" }       // optional expiry
    );

    // ✅ send token + user info
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
});


// ================= EXPORT =================
module.exports = router;