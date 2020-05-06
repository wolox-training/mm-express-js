const { checkSchema } = require('express-validator');

const { fieldsValidation } = require('./fields_validation');
const { findUserByEmail } = require('../services/users');
const { userEmailRepeatedError } = require('../errors');

exports.userBodyValidations = fieldsValidation(
  checkSchema({
    first_name: {
      errorMessage: 'first_name must be present',
      isEmpty: { negated: true }
    },
    last_name: {
      errorMessage: 'last_name must be present',
      isEmpty: { negated: true }
    },
    password: {
      errorMessage: 'password must have at least 7 characters',
      isLength: { options: { min: 7 } }
    },
    email: {
      errorMessage: 'email must have email format',
      isEmail: true
    }
  })
);

exports.validateUserEmailUniqueness = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => (user ? next(userEmailRepeatedError('E-mail already in use')) : next()))
    .catch(next);
