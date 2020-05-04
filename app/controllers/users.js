const { body } = require('express-validator');

const { createUser } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { showSerializer } = require('../serializers/users');
const { fieldErrorsValidation } = require('../middlewares/fieldErrors');

exports.createUser = [
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
  fieldErrorsValidation,
  (req, res, next) => {
    createUser(creationParamsMapper(req.body.user))
      .then(user => res.status(201).send(showSerializer(user)))
      .catch(next);
  }
];
