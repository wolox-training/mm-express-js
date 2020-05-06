const { createUser } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { showUserSerializer } = require('../serializers/users');
const { hashPassword } = require('../helpers/passwords');

exports.createUser = (req, res, next) => {
  const userBody = creationParamsMapper(req.body);
  return hashPassword(userBody.password)
    .then(password => createUser({ ...userBody, password }))
    .then(user => res.status(201).send(showUserSerializer(user)))
    .catch(next);
};
