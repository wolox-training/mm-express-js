const { ValidationError } = require('sequelize');
const { hash } = require('bcrypt');

const { users } = require('../models');
const { sequelizeValidationError } = require('../errors');

const withHashedPassword = userParams => {
  const { password } = userParams;
  const saltRounds = 10;
  return hash(password, saltRounds).then(hashedPassword => ({ ...userParams, password: hashedPassword }));
};

exports.create = userParams =>
  withHashedPassword(userParams)
    .then(user => users.create(user))
    .catch(error => {
      if (error instanceof ValidationError) throw sequelizeValidationError(error);
      throw error;
    });
