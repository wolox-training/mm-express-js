const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const { findUserByEmail } = require('../services/users');
const { invalidLoginError, permisionsError } = require('../errors');
const {
  common: { auth0 }
} = require('../../config');

exports.verifyUserPresence = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (!user) return next(invalidLoginError('Email or password are invalid'));
      req.body.user = user;
      return next();
    })
    .catch(next);

exports.verifyJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0.domain}/.well-known/jwks.json`
  }),
  requestProperty: 'jwtPayload',
  audience: auth0.audience,
  issuer: `https://${auth0.domain}/`,
  algorithm: ['RS256']
});

const namespace = 'http://weets.com';
const roleField = `${namespace}/role`;

exports.verifyAdmin = (req, res, next) =>
  req.jwtPayload[roleField] === 'admin'
    ? next()
    : next(permisionsError('You have not permission to access this resource'));
