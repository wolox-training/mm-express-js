const { compare } = require('bcrypt');

const { createUser, findUserByEmail } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { showUserSerializer } = require('../serializers/users');
const { hashPassword } = require('../helpers/passwords');
const { encode } = require('../helpers/jwt_utils');
const { invalidLoginError } = require('../errors');

exports.createUser = (req, res, next) => {
  const userBody = creationParamsMapper(req.body);
  return hashPassword(userBody.password)
    .then(password => createUser({ ...userBody, password }))
    .then(user => res.status(201).send(showUserSerializer(user)))
    .catch(next);
};

const payloadData = ({ id, email }) => ({ sub: id, email });
const validateUser = user => user || Promise.reject(invalidLoginError('User or password is invalid'));
const validatePassword = (user, password) =>
  compare(password, user.password).then(passwordOk =>
    passwordOk ? user : Promise.reject(invalidLoginError('User or password is invalid'))
  );

exports.createSession = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(validateUser)
    .then(user => validatePassword(user, req.body.password))
    .then(user => res.status(201).send({ token: encode(payloadData(user)) }))
    .catch(next);
