const { compare } = require('bcrypt');

const { encode } = require('../helpers/jwt_utils');
const { invalidLoginError } = require('../errors');

const payloadData = ({ email }) => ({ sub: email });
const verifyPassword = (user, password) =>
  compare(password, user.password).then(passwordOk => {
    if (!passwordOk) throw invalidLoginError('Email or password are invalid');
  });

exports.createUserSession = (req, res, next) =>
  verifyPassword(req.user, req.body.password)
    .then(() => res.status(200).send({ token: encode(payloadData(req.user)) }))
    .catch(next);
