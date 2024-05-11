const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { sendMail } = require("../services/sendMail");
const Client = require("../models/clients");

router.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const result = await sendMail().create({ to, subject, html });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username });
    console.log(user, "USER");
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(password);
    console.log(user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "password");
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
