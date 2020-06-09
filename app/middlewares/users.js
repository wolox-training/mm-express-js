const { findUserByEmail, findUserByExternalId } = require('../services/users');
const { userEmailRepeatedError, authorizationError } = require('../errors');

exports.validateUserEmailUniqueness = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => (user ? next(userEmailRepeatedError('E-mail already in use')) : next()))
    .catch(next);

exports.setCurrentUser = (req, res, next) => {
  findUserByExternalId(req.jwtPayload.sub)
    .then(user => {
      if (!user) return next(authorizationError('Not a valid user'));
      req.currentUser = user;
      return next();
    })
    .catch(next);
};

exports.setUserByEmail = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (user) req.body.user = user;
      next();
    })
    .catch(next);
