const { User } = require('../models');

exports.createUser = userParams => User.create(userParams);

exports.findUserByEmail = email => User.findOne({ where: { email } });

exports.findAndCountAllUsers = ({ offset, limit }) =>
  User.findAndCountAll({ offset, limit, order: [['id', 'asc']] });
