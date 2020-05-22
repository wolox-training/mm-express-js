const { pick } = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');
const { pageSerializer } = require('./pagination');
const { userJobPosition } = require('../services/users');

exports.showUserSerializer = user => {
  const underscoredUser = underscoreKeys(pick(user, 'id', 'firstName', 'lastName', 'email', 'points'));
  return { ...underscoredUser, job_position: userJobPosition(user) };
};

exports.usersPageSerializer = pageSerializer(exports.showUserSerializer);
