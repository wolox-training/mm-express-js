const { pick } = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');
const { pageSerializer } = require('./pagination');

exports.showWeetSerializer = weet => underscoreKeys(pick(weet, 'content', 'userId'));

exports.weetsPageSerializer = pageSerializer(exports.showWeetSerializer);
