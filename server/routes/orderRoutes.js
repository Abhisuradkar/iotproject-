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
    // ✅ Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { projectType, description } = req.body;

    // ✅ Validate input
    if (!projectType || !description) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ✅ Fetch user
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Save order
    const order = await Order.create({
      userId: user._id,
      projectType,
      description,
    });

    // 🔥 SEND EMAIL (NON-BLOCKING)
    (async () => {
      try {
        const response = await resend.emails.send({
          from: "onboarding@resend.dev",

          // ✅ send order to YOU
          to: process.env.EMAIL,

          subject: `🔥 New Order: ${projectType}`,

          text: `
📌 Project Type: ${projectType}

👤 Name: ${user.name || "N/A"}
📧 Email: ${user.email || "N/A"}
📱 Phone: ${user.phone || "N/A"}

📝 Description:
${description}
          `,
        });

        console.log("✅ Email sent:", response?.id);
      } catch (mailErr) {
        console.error("❌ EMAIL ERROR:", mailErr?.message);
      }
    })();

    // ✅ Respond fast (don't wait for email)
    return res.json({
      success: true,
      message: "Order submitted successfully",
      orderId: order._id,
    });

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

module.exports = router;