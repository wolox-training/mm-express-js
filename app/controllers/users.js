const { createUser, findAndCountAllUsers, createAdminUser } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { paginationParamsMapper } = require('../mappers/pagination_params');
const { showUserSerializer, usersPageSerializer } = require('../serializers/users');
const { hashPassword } = require('../helpers/passwords');

const userCreationEndpoint = creator => (req, res, next) => {
  const userBody = creationParamsMapper(req.body);
  return hashPassword(userBody.password)
    .then(password => creator({ ...userBody, password }))
    .then(user => res.status(201).send(showUserSerializer(user)))
    .catch(next);
};

exports.createUser = userCreationEndpoint(createUser);

exports.createAdminUser = userCreationEndpoint(createAdminUser);

exports.usersIndex = (req, res, next) =>
  findAndCountAllUsers(paginationParamsMapper(req.query))
    .then(page => res.status(200).send(usersPageSerializer(page)))
    .catch(next);
