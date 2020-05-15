const { findUserByEmail } = require('../services/users');
const { invalidLoginError } = require('../errors');

exports.verifyUserPresence = (req, res, next) =>
  findUserByEmail(req.body.email)
    .then(user => {
      if (!user) return next(invalidLoginError('Email or password are invalid'));
      req.body.user = user;
      return next();
    })
    .catch(next);
