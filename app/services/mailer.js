const nodemailer = require('nodemailer');

const {
  common: { mailer }
} = require('../../config');
const { externalServiceError } = require('../errors');

const transporter = nodemailer.createTransport({
  host: mailer.host,
  port: mailer.port,
  secure: false,
  auth: {
    user: mailer.user,
    pass: mailer.pass
  }
});

exports.sendWelcomeEmail = user =>
  transporter
    .sendMail({
      from: mailer.from,
      to: user.email,
      subject: 'Bienvendio a Weeter!',
      text: `Hola ${user.firstName}. Tu cuenta ha sido creada correctamente en Weeter`
    })
    .catch(() => {
      throw externalServiceError(`Error when sending welcome email to user ${user.id}`);
    });
