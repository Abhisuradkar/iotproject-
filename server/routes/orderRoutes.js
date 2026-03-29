const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.post("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user); // 🔥 DEBUG
    console.log("BODY:", req.body);

    // ✅ Check token decoded user
    if (!req.user || !req.user.id) {
      return res.status(401).json("Unauthorized");
    }

    const { projectType, description } = req.body;

    // ✅ Fetch user safely
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // ✅ Save order
    const order = new Order({
      userId: user._id,
      projectType,
      description
    });

    await order.save();

    // ✅ SEND EMAIL (SAFE WRAP)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: "🔥 New Order",
        text: `
Project Type: ${projectType}

Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}

Description:
${description}
`
      });
    } catch (mailErr) {
      console.log("EMAIL ERROR:", mailErr.message);
    }

    res.json("Order submitted successfully");

  } catch (err) {
    console.log("ORDER ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json(err.message);
  }
});

module.exports = router;