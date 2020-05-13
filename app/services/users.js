const { User } = require('../models');

exports.createUser = userParams => User.create(userParams);

exports.findUserByEmail = email => User.findOne({ where: { email } });

exports.findAndCountAllUsers = ({ offset, limit }) =>
  User.findAndCountAll({ offset, limit, order: [['id', 'asc']] });

exports.createAdminUser = userParams => {
  const defaultParams = { ...userParams, role: 'admin' };
  return User.findOrCreate({
    where: { email: userParams.email },
    defaults: defaultParams
  }).then(([user, created]) => (created ? user : user.update(defaultParams)));
};
