const nodemailer = require("nodemailer");
const config = require("../../config");

/**
 * Email service for sending emails via SMTP
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize the nodemailer transporter with SMTP configuration
   */
  initializeTransporter() {
    if (!config.email.host || !config.email.user || !config.email.pass) {
      console.warn("Email configuration is missing. Email service will not be available.");
      return;
    }

    const port = parseInt(config.email.port, 10) || 587;
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: port,
      secure: secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      // Additional options for better compatibility
      tls: {
        rejectUnauthorized: false, // Set to true in production with valid certificates
      },
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
      } else {
        console.log("SMTP server is ready to send emails");
      }
    });
  }

  /**
   * Send an email
   * @param {Object} emailData - Email data
   * @param {string|string[]} emailData.to - Recipient email address(es)
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.html - HTML content of the email
   * @param {string} [emailData.text] - Plain text content (optional)
   * @param {string|string[]} [emailData.cc] - CC recipients (optional)
   * @param {string|string[]} [emailData.bcc] - BCC recipients (optional)
   * @param {string} [emailData.from] - Sender email (optional, defaults to config)
   * @returns {Promise<Object>} - Result object with messageId and status
   */
  async sendEmail(emailData) {
    if (!this.transporter) {
      throw new Error("Email service is not configured. Please check SMTP settings.");
    }

    const { to, subject, html, text, cc, bcc, from } = emailData;

    if (!to || !subject || (!html && !text)) {
      throw new Error("Missing required email fields: to, subject, and html/text are required");
    }

    try {
      const mailOptions = {
        from: from || `${config.email.user.split("@")[0]} <${config.email.user}>`,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text version if not provided
      };

      if (cc) {
        mailOptions.cc = Array.isArray(cc) ? cc.join(", ") : cc;
      }

      if (bcc) {
        mailOptions.bcc = Array.isArray(bcc) ? bcc.join(", ") : bcc;
      }

      const info = await this.transporter.sendMail(mailOptions);

      console.log("Email sent successfully:", {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send bulk emails to multiple recipients
   * @param {Object} emailData - Email data
   * @param {string[]} emailData.recipients - Array of recipient email addresses
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.html - HTML content
   * @returns {Promise<Object>} - Result object with success count and failures
   */
  async sendBulkEmail(emailData) {
    const { recipients, subject, html } = emailData;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("Recipients array is required and must not be empty");
    }

    const results = {
      total: recipients.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const recipient of recipients) {
      try {
        await this.sendEmail({
          to: recipient,
          subject: subject,
          html: html,
        });
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          recipient: recipient,
          error: error.message,
        });
      }
    }

    return results;
  }
}

// Export singleton instance
const emailService = new EmailService();

module.exports = emailService;
