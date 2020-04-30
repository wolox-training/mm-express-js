const { ValidationError } = require('sequelize');
const { hash } = require('bcrypt');

const { User } = require('../models');
const { sequelizeValidationError } = require('../errors');

const withHashedPassword = ({ password, ...userParams }) => {
  const saltRounds = 10;
  return hash(password, saltRounds).then(hashedPassword => ({ ...userParams, password: hashedPassword }));
};

exports.createUser = userParams =>
  withHashedPassword(userParams)
    .then(user => User.create(user))
    .catch(error => {
      if (error instanceof ValidationError) throw sequelizeValidationError(error);
      throw error;
    });
