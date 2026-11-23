const previewEmail = (kind, email) => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Email delivery is not configured for production.');
  }

  console.info(`[email preview] ${kind} email for ${email}; no email was sent`);
};

module.exports = {
  sendVerificationEmail: email => previewEmail('verification', email),
  sendResetPasswordEmail: email => previewEmail('password reset', email),
};
