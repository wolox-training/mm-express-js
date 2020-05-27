const { User } = require('../models');
const { databaseError } = require('../errors');
const { info } = require('../logger');

exports.createUser = userParams => {
  info('Calling users.createUser');
  return User.create(userParams).catch(error => {
    throw databaseError(error.message);
  });
};

exports.findUserByEmail = email => {
  info('Calling users.findUserByEmail');
  return User.findOne({ where: { email } }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.findAndCountAllUsers = ({ offset, limit }) => {
  info('Calling users.findAndCountAllUsers');
  return User.findAndCountAll({ offset, limit, order: [['id', 'asc']] }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.upgradeUserToAdmin = user =>
  user.update({ role: 'admin' }).catch(error => {
    throw databaseError(error.message);
  });

exports.userJobPosition = ({ points }) => {
  if (points <= 5) return 'DEVELOPER';
  if (points <= 9) return 'LEAD';
  if (points <= 19) return 'TL';
  if (points <= 29) return 'EM';
  if (points <= 49) return 'HEAD';
  return 'CEO';
};

exports.modifyUserPointsBy = (user, by, transaction) => {
  info(`Calling users.modifyUserPointsBy: userId=${user.id}, by=${by}`);
  return user.increment('points', { by, transaction }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.invalidateUserSessions = user =>
  user.update({ sessionsExpiredAt: new Date() }).catch(error => {
    throw databaseError(error.message);
  });
