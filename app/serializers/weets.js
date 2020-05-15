const { pick } = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');

exports.showWeetSerializer = weet => underscoreKeys(pick(weet, 'content', 'userId'));
