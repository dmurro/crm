const nodemailer = require("nodemailer");

module.exports.sendMail = () => {
  return {
    async create(data) {
      const { to, subject, html } = data;

      const transporter = nodemailer.createTransport({
        host: "mail.fishplanetlondon.co.uk",
        port: 465,
        secure: true,
        auth: {
          user: "info@fishplanetlondon.co.uk",
          pass: "fishplanetlondon",
        },
      });

      try {
        const info = await transporter.sendMail({
          from: "Fish Planet London <info@fishplanetlondon.co.uk>",
          to: to,
          subject: subject,
          html: html
        });

        console.log("Message sent:", info.messageId);
        return { message: "Email sent successfully" };
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
      }
    },
  };
};
