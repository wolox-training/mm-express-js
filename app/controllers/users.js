const { body, validationResult } = require('express-validator');

const users = require('../services/users');
const { fieldValidationError } = require('../errors');
const { creationsParamsMapper } = require('../mappers/users');
const { showSerializer } = require('../serializers/users');

exports.create = [
  body('user.first_name', 'first_name must be present')
    .not()
    .isEmpty(),
  body('user.last_name', 'last_name must be present')
    .not()
    .isEmpty(),
  body('user.password', 'password must be present')
    .not()
    .isEmpty(),
  body('user.email', 'email must have email format').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw fieldValidationError(errors.mapped());

    const userBody = creationsParamsMapper(req.body.user);
    users
      .create(userBody)
      .then(user => res.status(201).send(showSerializer(user)))
      .catch(next);
  }
];
