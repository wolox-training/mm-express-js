const { ValidationError } = require('sequelize');

const { users } = require('../models');
const errors = require('../errors');

exports.create = params =>
  users.create(params).catch(error => {
    if (error instanceof ValidationError) throw errors.sequelizeValidationError(error);
    throw error;
  });
