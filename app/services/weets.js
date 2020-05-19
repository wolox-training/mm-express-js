const { Weet } = require('../models');
const { info } = require('../logger');
const { databaseError } = require('../errors');

exports.createWeet = (content, user) => {
  info('Calling weets.createWeet');
  const weet = Weet.build({ content });
  weet.setUser(user, { save: false });
  return weet.save().catch(error => databaseError(error));
};
