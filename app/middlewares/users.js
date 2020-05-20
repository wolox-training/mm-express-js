const { findUserByEmail } = require('../services/users');
const { userEmailRepeatedError } = require('../errors');

exports.validateUserEmailUniqueness = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => (user ? next(userEmailRepeatedError('E-mail already in use')) : next()))
    .catch(next);

exports.setUserByEmail = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (user) req.currentUser = user;
      next();
    })
    .catch(next);
