const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { Resend } = require("resend");

// ✅ INIT RESEND
const resend = new Resend(process.env.RESEND_API_KEY);

// 🚀 ROUTE: CREATE ORDER + SEND EMAIL
router.post("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    // ✅ Check user
    if (!req.user || !req.user.id) {
      return res.status(401).json("Unauthorized");
    }

    const { projectType, description } = req.body;

    // ✅ Fetch user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // ✅ Save order
    const order = new Order({
      userId: user._id,
      projectType,
      description,
    });

    await order.save();

    // 🔥 SEND EMAIL USING RESEND
    try {
      console.log("STEP 1: Sending email via Resend...");

      const response = await resend.emails.send({
        from: "onboarding@resend.dev", // default sender
        to: process.env.EMAIL, // your email
        subject: "🔥 New Order Received",
        text: `
📌 Project Type: ${projectType}

👤 Name: ${user.name}
📧 Email: ${user.email}
📱 Phone: ${user.phone}

📝 Description:
${description}
        `,
      });

      console.log("✅ Email sent via Resend");
      console.log("RESPONSE:", response);

    } catch (mailErr) {
      console.error("❌ EMAIL ERROR:", mailErr);
    }

    res.json("✅ Order submitted successfully");

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json(err.message);
  }
});

module.exports = router;