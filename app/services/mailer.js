const nodemailer = require('nodemailer');

const { info } = require('../logger');

const {
  common: { mailer }
} = require('../../config');
const { externalServiceError } = require('../errors');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: mailer.host,
      port: mailer.port,
      secure: false,
      auth: {
        user: mailer.user,
        pass: mailer.pass
      }
    });
  }
  return transporter;
};

exports.sendWelcomeEmail = user => {
  info(`mailer.sendWelcomeEmail to user ${user.id}`);
  return getTransporter()
    .sendMail({
      from: mailer.from,
      to: user.email,
      subject: 'Bienvendio a Weeter!',
      text: `Hola ${user.firstName}. Tu cuenta ha sido creada correctamente en Weeter`
    })
    .catch(() => {
      throw externalServiceError(`Error when sending welcome email to user ${user.id}`);
    });
};
