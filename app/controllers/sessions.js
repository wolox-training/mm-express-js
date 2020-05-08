const { compare } = require('bcrypt');

const { findUserByEmail } = require('../services/users');
const { encode } = require('../helpers/jwt_utils');
const { invalidLoginError } = require('../errors');

const payloadData = ({ id, email }) => ({ sub: id, email });
const verifyUserPresence = user => user || Promise.reject(invalidLoginError('Email or password are invalid'));
const verifyPassword = (user, password) =>
  compare(password, user.password).then(passwordOk =>
    passwordOk ? user : Promise.reject(invalidLoginError('Email or password are invalid'))
  );

exports.createSession = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(verifyUserPresence)
    .then(user => verifyPassword(user, req.body.password))
    .then(user => res.status(201).send({ token: encode(payloadData(user)) }))
    .catch(next);
