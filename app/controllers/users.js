const { createUser, findAndCountAllUsers, upgradeUserToAdmin } = require('../services/users');
const { sendWelcomeEmail } = require('../services/mailer');
const { creationParamsMapper } = require('../mappers/users');
const { paginationParamsMapper } = require('../mappers/pagination_params');
const { showUserSerializer, usersPageSerializer } = require('../serializers/users');
const logger = require('../logger');

exports.createUser = (req, res, next) =>
  createUser(creationParamsMapper(req.body))
    .then(user => {
      res.status(201).send(showUserSerializer(user));
      sendWelcomeEmail(user).catch(logger.error);
    })
    .catch(next);

exports.createAdminUser = (req, res, next) =>
  (req.body.user
    ? upgradeUserToAdmin(req.body.user)
    : createUser({ ...creationParamsMapper(req.body), role: 'admin' })
  )
    .then(user => res.status(201).send(showUserSerializer(user)))
    .catch(next);

exports.usersIndex = (req, res, next) =>
  findAndCountAllUsers(paginationParamsMapper(req.query))
    .then(page => res.status(200).send(usersPageSerializer(page)))
    .catch(next);
