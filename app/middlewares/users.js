const { findUserByEmail } = require('../services/users');
const { userEmailRepeatedError, authorizationError } = require('../errors');

exports.validateUserEmailUniqueness = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => (user ? next(userEmailRepeatedError('E-mail already in use')) : next()))
    .catch(next);

const isExpiredToken = (jwtPayload, user) =>
  user.sessionsExpiredAt && jwtPayload.iss <= user.sessionsExpiredAt;

exports.setCurrentUser = (req, res, next) =>
  findUserByEmail(req.jwtPayload.sub)
    .then(user => {
      if (!user) return next(authorizationError('Not a valid user'));
      if (isExpiredToken(req.jwtPayload, user)) return next(authorizationError('Expired token'));
      req.currentUser = user;
      return next();
    })
    .catch(next);

exports.setUserByEmail = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (user) req.body.user = user;
      next();
    })
    .catch(next);
