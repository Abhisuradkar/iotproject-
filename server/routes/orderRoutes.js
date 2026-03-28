const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User"); // ✅ ADD THIS
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
    const { projectType, description } = req.body;

    // ✅ FETCH USER FROM DB
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // ✅ SAVE ORDER
    const order = new Order({
      userId: user._id,
      projectType,
      description
    });

    await order.save();

    // ✅ SEND FULL INFO EMAIL
    await transporter.sendMail({
      to: process.env.EMAIL,
      subject: "🔥 New Order",
      text: `
📌 Project Type: ${projectType}

👤 Name: ${user.name}
📧 Email: ${user.email}
📱 Phone: ${user.phone}

📝 Description:
${description}
`
    });

    res.json("Order submitted");

  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;