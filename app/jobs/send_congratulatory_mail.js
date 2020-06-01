const { info, error: logError } = require('../logger');
const { findAllUsers } = require('../services/users');
const { sendCongratulatoryEmail } = require('../services/mailer');

const sendCongratulationMailToUser = user => {
  info(`Sending mail to ${user.email}`);
  return sendCongratulatoryEmail(user).catch(logError);
};

module.exports = async () => {
  info('Starting congrats mails job');
  const batchSize = 50;
  const mailsSent = [];
  for (
    let offset = 0, users = await findAllUsers({ offset, limit: batchSize });
    users.length > 0;
    offset += batchSize, users = await findAllUsers({ offset, limit: batchSize })
  ) {
    mailsSent.push(...users.map(sendCongratulationMailToUser));
  }
  await Promise.allSettled(mailsSent);
  info('Finished congrats mails job');
};
