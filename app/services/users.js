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

exports.createAdminUser = userParams => {
  info('Calling users.createAdminUser');
  const defaultParams = { ...userParams, role: 'admin' };
  return User.findOrCreate({
    where: { email: userParams.email },
    defaults: defaultParams
  })
    .then(([user, created]) => (created ? user : user.update(defaultParams)))
    .catch(error => {
      throw databaseError(error);
    });
};
