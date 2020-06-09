const moment = require('moment');

const { info, error: logError } = require('../logger');
const { wordsCountByUser } = require('../services/users');
const { sendCongratulatoryEmail } = require('../services/mailer');

const sendCongratulationMailToUser = (user, wordsCount) => {
  info(`Sending mail to ${user.email}`);
  return sendCongratulatoryEmail(user, wordsCount).catch(logError);
};

module.exports = () => {
  info('Starting congrats mails job');
  const limit = 10;
  const startingDate = moment().subtract(1, 'days');
  return wordsCountByUser({ limit, startingDate })
    .then(rows =>
      rows.map(({ dataValues: { user, totalWordsCount } }) =>
        sendCongratulationMailToUser(user, totalWordsCount)
      )
    )
    .then(Promise.allSettled)
    .then(() => {
      info('Finished congrats mails job');
    })
    .catch(() => {
      logError('Error when running congrats mails jobs');
    });
};
