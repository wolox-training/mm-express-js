const _ = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');

exports.showSerializer = user => underscoreKeys(_.pick(user, 'id', 'firstName', 'lastName', 'email'));
