const { body } = require('express-validator');

const { fieldErrorsValidation } = require('./fieldErrors');
const { findUserByEmail } = require('../services/users');

exports.userBodyValidations = [
  body('user.first_name', 'first_name must be present')
    .not()
    .isEmpty(),
  body('user.last_name', 'last_name must be present')
    .not()
    .isEmpty(),
  body('user.password', 'password must be present')
    .not()
    .isEmpty(),
  body('user.email')
    .isEmail()
    .withMessage('email must have email format')
    .bail()
    .custom(async email => {
      const user = await findUserByEmail(email);
      if (user) throw new Error('E-mail already in use');
    }),
  fieldErrorsValidation
];
