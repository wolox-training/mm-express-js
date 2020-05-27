const { pick } = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');
const { pageSerializer } = require('./pagination');

exports.showUserSerializer = user => underscoreKeys(pick(user, 'id', 'firstName', 'lastName', 'email'));

exports.usersPageSerializer = pageSerializer(exports.showUserSerializer);
