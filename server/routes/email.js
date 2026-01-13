const express = require("express");
const { body, validationResult } = require("express-validator");
const emailService = require("./services/sendMail");
const { authenticateToken } = require("../middleware/auth");

const emailRouter = express.Router();

// Validation middleware for email sending
const emailValidation = [
  body("to").notEmpty().withMessage("Recipient email is required").isEmail().withMessage("Invalid email format"),
  body("subject").trim().notEmpty().withMessage("Email subject is required"),
  body("html").trim().notEmpty().withMessage("Email content (html) is required"),
  body("text").optional().trim(),
  body("cc").optional().isEmail().withMessage("Invalid CC email format"),
  body("bcc").optional().isEmail().withMessage("Invalid BCC email format"),
];

/**
 * POST /email/send
 * Send a single email
 * Requires authentication
 */
emailRouter.post("/send", authenticateToken, emailValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { to, subject, html, text, cc, bcc } = req.body;

    const result = await emailService.sendEmail({
      to,
      subject,
      html,
      text,
      cc,
      bcc,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
});

/**
 * POST /email/bulk
 * Send bulk emails to multiple recipients
 * Requires authentication
 */
emailRouter.post(
  "/bulk",
  authenticateToken,
  [
    body("recipients")
      .isArray({ min: 1 })
      .withMessage("Recipients array is required and must not be empty")
      .custom((recipients) => {
        const allValid = recipients.every((email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        });
        if (!allValid) {
          throw new Error("All recipients must be valid email addresses");
        }
        return true;
      }),
    body("subject").trim().notEmpty().withMessage("Email subject is required"),
    body("html").trim().notEmpty().withMessage("Email content (html) is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { recipients, subject, html } = req.body;

      const result = await emailService.sendBulkEmail({
        recipients,
        subject,
        html,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Bulk email sending error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to send bulk emails",
      });
    }
  }
);

/**
 * GET /email/test
 * Test email service configuration
 * Requires authentication
 */
emailRouter.get("/test", authenticateToken, async (req, res) => {
  try {
    // Check if email service is configured
    if (!emailService.transporter) {
      return res.status(503).json({
        success: false,
        message: "Email service is not configured. Please check SMTP settings.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email service is configured and ready",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error checking email service",
    });
  }
});

module.exports = emailRouter;
