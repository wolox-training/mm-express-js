const { Weet } = require('../models');
const { info } = require('../logger');
const { databaseError } = require('../errors');

exports.createWeet = (content, user) => {
  info('weets.createWeet: Creating weet');
  return Weet.create({ content, userId: user.id }).catch(error => {
    throw databaseError(error);
  });
};

exports.findAndCountAllWeets = ({ offset, limit }) => {
  info('Calling weets.findAndCountAllWeets');
  return Weet.findAndCountAll({ offset, limit, order: [['id', 'asc']] }).catch(error => {
    throw databaseError(error);
  });
};
