const { User } = require('../models');
const { databaseError } = require('../errors');
const { info } = require('../logger');

exports.createUser = userParams => {
  info('Calling users.createUser');
  return User.create(userParams).catch(error => {
    throw databaseError(error);
  });
};

exports.findUserByEmail = email => {
  info('Calling users.findUserByEmail');
  return User.findOne({ where: { email } }).catch(error => {
    throw databaseError(error);
  });
};

exports.findAndCountAllUsers = ({ offset, limit }) => {
  info('Calling users.findAndCountAllUsers');
  return User.findAndCountAll({ offset, limit, order: [['id', 'asc']] }).catch(error => {
    throw databaseError(error);
  });
};

exports.upgradeUserToAdmin = user =>
  user.update({ role: 'admin' }).catch(error => {
    throw databaseError(error);
  });

exports.userJobPosition = ({ points }) => {
  if (points <= 5) return 'DEVELOPER';
  if (points <= 9) return 'LEAD';
  if (points <= 19) return 'TL';
  if (points <= 29) return 'EM';
  if (points <= 49) return 'HEAD';
  return 'CEO';
};
