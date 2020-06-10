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

const sendMailToUser = (user, { subject, text }) =>
  getTransporter().sendMail({
    from: mailer.from,
    to: user.email,
    subject,
    text
  });

exports.sendWelcomeEmail = user => {
  info(`mailer.sendWelcomeEmail to user ${user.id}`);
  return sendMailToUser(user, {
    subject: 'Bienvenido a Weeter!',
    text: `Hola ${user.firstName}. Tu cuenta ha sido creada correctamente en Weeter`
  }).catch(({ message }) => {
    throw externalServiceError(`Error when sending welcome email to user ${user.id}. Error: ${message}`);
  });
};

exports.sendCongratulatoryEmail = (user, wordsCount) => {
  info(`mailer.sendCongratulatoryEmail to user ${user.id}`);
  return sendMailToUser(user, {
    subject: 'Felicitaciones por Weetear!',
    text: `Hola ${user.firstName}. Tus weets están llegando a mucha gente.
    Hoy weeteaste ${wordsCount} palabras y ya acumulaste ${user.points} puntos!!!
    `
  }).catch(({ message }) => {
    throw externalServiceError(`Error when sending congratulatory email to user ${user.id}: ${message}`);
  });
};
