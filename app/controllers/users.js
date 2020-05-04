const { createUser } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { showSerializer } = require('../serializers/users');
const { hashPassword } = require('../helpers/passwords');

exports.createUser = (req, res, next) => {
  const userBody = creationParamsMapper(req.body.user);
  hashPassword(userBody.password)
    .then(password => createUser({ ...userBody, password }))
    .then(user => res.status(201).send(showSerializer(user)))
    .catch(next);
};
