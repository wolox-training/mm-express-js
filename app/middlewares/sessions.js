const { findUserByEmail } = require('../services/users');
const { invalidLoginError, authorizationError, permisionsError } = require('../errors');
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
  const token = req.headers[header_name] && req.headers[header_name].split(/\s+/)[1];
  if (!token) return next(authorizationError('You need to be logged in'));
  try {
    req.jwt_payload = decode(token);
    return next();
  } catch {
    return next(authorizationError('Invalid credentials'));
  }
};

exports.verifyAdmin = (req, res, next) =>
  req.jwt_payload.role === 'admin'
    ? next()
    : next(permisionsError('You have not permission to access this resource'));
