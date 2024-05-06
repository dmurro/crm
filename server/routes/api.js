const express = require("express");
const router = express.Router();
const { sendMail } = require("../services/sendMail");
const Client = require("../models/clients");

// @route   POST /api/send-email
// @desc    Send email
// @access  Public
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

module.exports = router;
