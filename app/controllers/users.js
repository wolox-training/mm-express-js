const { createUser, findAndCountAllUsers, upgradeUserToAdmin } = require('../services/users');
const { creationParamsMapper } = require('../mappers/users');
const { paginationParamsMapper } = require('../mappers/pagination_params');
const { showUserSerializer, usersPageSerializer } = require('../serializers/users');
const { hashPassword } = require('../helpers/passwords');

exports.createUser = (req, res, next) => {
  const userBody = creationParamsMapper(req.body);
  return hashPassword(userBody.password)
    .then(password => createUser({ ...userBody, password }))
    .then(user => res.status(201).send(showUserSerializer(user)))
    .catch(next);
};
exports.createAdminUser = (req, res, next) =>
  (req.currentUser
    ? upgradeUserToAdmin(req.currentUser)
    : createUser({ ...creationParamsMapper(req.body), role: 'admin' })
  )
    .then(user => res.status(201).send(showUserSerializer(user)))
    .catch(next);

exports.usersIndex = (req, res, next) =>
  findAndCountAllUsers(paginationParamsMapper(req.query))
    .then(page => res.status(200).send(usersPageSerializer(page)))
    .catch(next);
