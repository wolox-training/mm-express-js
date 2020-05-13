const { findUserByEmail } = require('../services/users');
const { invalidLoginError, authorizationError } = require('../errors');
const { decode } = require('../helpers/jwt_utils');
const {
  common: {
    session: { header_name }
  }
} = require('../../config');

exports.verifyUserPresence = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (!user) return next(invalidLoginError('Email or password are invalid'));
      req.user = user;
      return next();
    })
    .catch(next);

exports.verifyJwt = (req, res, next) => {
  const token = req.headers[header_name] && req.headers[header_name].split(' ')[1];
  if (!token) return next(authorizationError('You need to be logged in'));
  try {
    req.user = req.user || {};
    req.user.jwt_payload = decode(token);
    return next();
  } catch {
    return next(authorizationError('Invalid credentials'));
  }
};
