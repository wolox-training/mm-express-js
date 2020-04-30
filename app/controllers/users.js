const { body, validationResult } = require('express-validator');

const users = require('../services/users');
const { fieldValidationError } = require('../errors');
const { creationsParamsMapper } = require('../mappers/users');

exports.create = [
  body('user.first_name', 'firstName must be present')
    .not()
    .isEmpty(),
  body('user.last_name', 'lastName must be present')
    .not()
    .isEmpty(),
  body('user.password', 'passWord must be present')
    .not()
    .isEmpty(),
  body('user.email', 'email must be an email').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw fieldValidationError(errors.mapped());

    const userBody = creationsParamsMapper(req.body.user);
    users
      .create(userBody)
      .then(user => res.status(201).send(user))
      .catch(next);
  }
];
