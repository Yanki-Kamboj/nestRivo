// Contact controller – handles contact form submissions
// Sends an email using nodemailer in production, otherwise logs to console

require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter – in dev we just use a stub
function getTransporter() {
  if (process.env.NODE_ENV === 'production') {
    // Expect real SMTP credentials in env vars
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Development – just log the email
  return {
    sendMail: async (mailOptions) => {
      console.log('📧 [DEV] Email would be sent:', mailOptions);
      return Promise.resolve();
    },
  };
}

const transporter = getTransporter();

// @desc   Receive contact form and forward via email
// @route  POST /api/contact
// @access Public
exports.sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: `${name} <${email}>`,
    to: process.env.CONTACT_RECEIVER || 'support@nest-rivo.com',
    subject: `[Contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Contact message sent successfully' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
