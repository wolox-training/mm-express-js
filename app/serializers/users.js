const _ = require('lodash');

const { underscoreKeys } = require('../helpers/objectUtils');

exports.showSerializer = user => underscoreKeys(_.pick(user, 'id', 'firstName', 'lastName', 'email'));
