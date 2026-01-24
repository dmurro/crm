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
    const { email, isProduction } = config;

    if (!email?.host || !email?.auth?.user || !email?.auth?.pass) {
      console.warn("⚠️ Email configuration missing. Email service disabled.");
      return;
    }

    const port = Number(email.port) || 587;
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: email.host,
      port,
      secure,
      auth: {
        user: email.auth.user,
        pass: email.auth.pass,
      },
      tls: {
        rejectUnauthorized: isProduction, // true in prod, false in dev
      },
      from: email.from || email.auth.user
    });

    this.transporter.verify(error => {
      if (error) {
        console.error("❌ SMTP connection error:", error.message);
      } else {
        console.log("✅ SMTP server ready");
      }
    });
  }

  /**
   * Send a single email
   */
  async sendEmail({ to, subject, html, text, cc, bcc, from }) {
    if (!this.transporter) {
      throw new Error("Email service not configured");
    }

    if (!to || !subject || (!html && !text)) {
      throw new Error("Missing required fields: to, subject, html/text");
    }

    const mailOptions = {
      from: from || config.email.from || config.email.user,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      text: text ?? this.stripHtml(html),
      ...(cc && { cc: Array.isArray(cc) ? cc.join(", ") : cc }),
      ...(bcc && { bcc: Array.isArray(bcc) ? bcc.join(", ") : bcc }),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      console.log("📧 Email sent:", {
        id: info.messageId,
        to: mailOptions.to,
        subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ Email send failed:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send bulk emails (sequential, safe)
   */
  async sendBulkEmail({ recipients, subject, html }) {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("Recipients array is required");
    }

    const results = {
      total: recipients.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const recipient of recipients) {
      try {
        await this.sendEmail({ to: recipient, subject, html });
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({ recipient, error: error.message });
      }
    }

    return results;
  }

  /**
   * Basic HTML → text fallback
   */
  stripHtml(html = "") {
    return html
      .replace(/<\/(p|br|div|li)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim();
  }
}

module.exports = new EmailService();
