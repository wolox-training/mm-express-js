const moment = require('moment');

const { info, error: logError } = require('../logger');
const { wordsCountByUser } = require('../services/weets');
const { sendCongratulatoryEmail } = require('../services/mailer');

const sendCongratulationMailToUser = (user, wordsCount) => {
  info(`Sending mail to ${user.email}`);
  return sendCongratulatoryEmail(user, wordsCount).catch(logError);
};

module.exports = async () => {
  info('Starting congrats mails job');
  const limit = 10;
  const startingDate = moment().subtract(1, 'days');
  const rows = await wordsCountByUser({ limit, startingDate });
  const mailsSent = rows.map(({ dataValues: { user, totalWordsCount } }) =>
    sendCongratulationMailToUser(user, totalWordsCount)
  );

  await Promise.allSettled(mailsSent);
  info('Finished congrats mails job');
};
