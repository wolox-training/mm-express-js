const { Weet } = require('../models');
const { info } = require('../logger');
const { databaseError } = require('../errors');

exports.createWeet = (content, user) => {
  info('weets.createWeet: Creating weet');
  return Weet.create({ content, userId: user.id }).catch(error => databaseError(error));
};
