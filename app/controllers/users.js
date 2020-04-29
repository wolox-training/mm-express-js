const users = require('../services/users');

exports.create = (req, res, next) => {
  // TODO: validate body
  const userBody = req.body.user;
  users
    .create(userBody)
    .then(user => res.status(201).send(user))
    .catch(next);
};
