const { pick } = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');
const { pageSerializer } = require('./pagination');

const jobPosition = ({ points }) => {
  if (points <= 5) return 'DEVELOPER';
  if (points <= 9) return 'LEAD';
  if (points <= 19) return 'TL';
  if (points <= 29) return 'EM';
  if (points <= 49) return 'HEAD';
  return 'CEO';
};

exports.showUserSerializer = user => {
  const underscoredUser = underscoreKeys(pick(user, 'id', 'firstName', 'lastName', 'email'));
  return { ...underscoredUser, job_position: jobPosition(user) };
};

exports.usersPageSerializer = pageSerializer(exports.showUserSerializer);
