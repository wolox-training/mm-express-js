const { body } = require('express-validator');

const { fieldsValidation } = require('./fields_validation');
const { findUserByEmail } = require('../services/users');
const { userEmailRepeatedError } = require('../errors');

exports.userBodyValidations = fieldsValidation([
  body('first_name', 'first_name must be present')
    .not()
    .isEmpty(),
  body('last_name', 'last_name must be present')
    .not()
    .isEmpty(),
  body('password', 'password must be present')
    .not()
    .isEmpty(),
  body('email', 'email must have email format').isEmail()
]);

exports.validateUserEmailUniqueness = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (user) return next(userEmailRepeatedError('E-mail already in use'));
      return next();
    })
    .catch(next);