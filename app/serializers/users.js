const _ = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');

exports.showUserSerializer = user => underscoreKeys(_.pick(user, 'id', 'firstName', 'lastName', 'email'));

exports.usersPageSerializer = ({ count, rows }) => ({
  total_count: count,
  page: rows.map(exports.showUserSerializer)
});
