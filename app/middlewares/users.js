const { checkSchema } = require('express-validator');

const { fieldsValidation } = require('./fields_validation');
const { findUserByEmail } = require('../services/users');
const { userEmailRepeatedError } = require('../errors');
const { passwordSchema, emailSchema } = require('./shared/schemas');

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
    password: passwordSchema,
    email: emailSchema
  })
);

exports.validateUserEmailUniqueness = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => (user ? next(userEmailRepeatedError('E-mail already in use')) : next()))
    .catch(next);
