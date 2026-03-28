const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  projectType: String,
  description: String
});

module.exports = mongoose.model("Order", orderSchema);