const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");

// ✅ TRANSPORTER (Render-safe config)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  family: 4, // 🔥 Force IPv4 (fixes Render ENETUNREACH)

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // using PASSWORD (Option 2)
  },

  connectionTimeout: 10000,

  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ VERIFY SMTP ON START
transporter.verify()
  .then(() => console.log("✅ SMTP READY"))
  .catch(err => console.log("❌ SMTP ERROR:", err));


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

    // 🔥 DEBUG ENV
    console.log("ENV EMAIL:", process.env.EMAIL);
    console.log("ENV PASSWORD:", process.env.PASSWORD ? "EXISTS" : "MISSING");

    // ✅ SEND EMAIL
    try {
      console.log("STEP 1: Sending email...");

      const info = await transporter.sendMail({
        from: process.env.EMAIL,

        // 🔥 send to yourself + optional test email
        to: `${process.env.EMAIL}`, 
        // you can add: ,yourpersonal@gmail.com

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

      console.log("✅ STEP 2: Email sent successfully");
      console.log("RESPONSE:", info.response);

    } catch (mailErr) {
      console.error("❌ EMAIL ERROR FULL:", mailErr);
    }

    res.json("✅ Order submitted successfully");

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json(err.message);
  }
});

module.exports = router;