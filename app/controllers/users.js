const { body } = require('express-validator');

const { createUser, findUserByEmail } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { showSerializer } = require('../serializers/users');
const { fieldErrorsValidation } = require('../middlewares/fieldErrors');
const { hashPassword } = require('../helpers/passwords');

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
  body('user.email')
    .isEmail()
    .withMessage('email must have email format')
    .bail()
    .custom(async email => {
      const user = await findUserByEmail(email);
      if (user) throw new Error('E-mail already in use');
    }),
  fieldErrorsValidation,
  (req, res, next) => {
    const userBody = creationParamsMapper(req.body.user);
    hashPassword(userBody.password)
      .then(password => createUser({ ...userBody, password }))
      .then(user => res.status(201).send(showSerializer(user)))
      .catch(next);
  }
];
