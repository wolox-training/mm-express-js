const { body } = require('express-validator');

const { fieldErrorsValidation } = require('./field_errors');
const { findUserByEmail } = require('../services/users');

const validateEmailUniqueness = async email => {
  const user = await findUserByEmail(email);
  if (user) throw new Error('E-mail already in use');
};

exports.userBodyValidations = fieldErrorsValidation([
  body('first_name', 'first_name must be present')
    .not()
    .isEmpty(),
  body('last_name', 'last_name must be present')
    .not()
    .isEmpty(),
  body('password', 'password must be present')
    .not()
    .isEmpty(),
  body('email')
    .isEmail()
    .withMessage('email must have email format')
    .bail()
    .custom(validateEmailUniqueness)
]);
